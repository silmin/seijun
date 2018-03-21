enchant();

const SIZE_X = 640;
const SIZE_Y = 960;

const FPS = 50;

const SCENE = 4;
const TOP = 1;
const DESCRIPTION = 2;
const GAME = 3;
const RESULT = 4;

const ASSET = [
    './img/title.png',
    './img/hart.png',
    './img/description.png',
    './img/r18.png',
    './img/rabbit.png',
    './img/result.png',
    './sound/click.mp3',
    './sound/start.mp3',
    './sound/fujun1.mp3',
    './sound/hazure.mp3',
    './sound/return.mp3',
    './sound/title.mp3',
    './sound/main.mp3',
    './sound/damage.mp3',
    './sound/result.mp3'
];


window.onload = function() {
    let core = new Core(SIZE_X, SIZE_Y);
    core.fps = FPS;
    core.preload(ASSET);

    core.onload = function() {
        //Scene Gene
        let scene = new Array();
        for(let i = 1; i <= SCENE; ++i) {
            scene[i] = new Scene();
            scene[i].backgroundColor = "#ffe8fc";
        }

        let bgm;

        let topSprite = new Sprite();
        topSprite.image = core.assets['./img/title.png'];
        topSprite.width = 480;
        topSprite.height = 100;
        topSprite.moveTo((core.width - topSprite.width) / 2, 300);
        scene[TOP].addChild(topSprite);
        
        let myAccountLabel = new Label("製作者: mina(twitter: @silmin_)");
        myAccountLabel.font = "15px 'meiryo'";
        myAccountLabel.width = 300;
        myAccountLabel.moveTo(10, core.height - 30);
        scene[TOP].addChild(myAccountLabel);

        let clickStartLabel = new Label("click start");
        clickStartLabel.font = "30px 'meiryo'";
        clickStartLabel.moveTo((core.width - clickStartLabel._boundWidth) / 2, 600 );
        scene[TOP].addChild(clickStartLabel);

        clickStartLabel.addEventListener('enterframe', function() {
            clickStartLabel.opacity = (Math.cos(core.frame*2*Math.PI/180)+1)*0.5;
        });

        scene[TOP].addEventListener('enter', function() {
            bgm = core.assets['./sound/title.mp3'];
            bgm.play();
            bgm.volume -= 0.7;
        });
        scene[TOP].addEventListener('touchstart', function() {
            core.assets['./sound/click.mp3'].play();
            core.replaceScene(scene[DESCRIPTION]);
        });
        
        core.pushScene(scene[TOP]);

        let descSprite = new Sprite();
        descSprite.image = core.assets['./img/description.png'];
        descSprite.moveTo(0, 0);
        descSprite.width = core.width;
        descSprite.height = core.height;
        scene[DESCRIPTION].addChild(descSprite);

        scene[DESCRIPTION].addEventListener('touchend', function() {
            core.assets['./sound/start.mp3'].play();
            bgm.stop();
            core.replaceScene(scene[GAME]);
        });

        let life = 3;
        let lifeSprite = Array();
        let life_x = 400;
        for(let i = life-1; i >= 0 ; i--) {
            lifeSprite[i] = new Sprite();
            lifeSprite[i].width = 50;
            lifeSprite[i].height = 50;
            lifeSprite[i].moveTo(life_x, 10);
            life_x += 50;
            lifeSprite[i].image = core.assets['./img/hart.png'];
            scene[GAME].addChild(lifeSprite[i]);
        }

        let timer = 0;
        let score = 0;
        let scoreLabel = new Label();
        scoreLabel.font = "30px 'meiryo'";
        scoreLabel.moveTo(5,5);
        let timeLabel = new Label();
        timeLabel.font = "30px 'meiryo'";
        timeLabel.moveTo(5,40);

        let interval = 25;

        scene[GAME].addEventListener('enter', function() {
            bgm = core.assets['./sound/main.mp3'];
            bgm.play();
            bgm.volume -= 0.7;
            core.frame = 0;
        });
        scene[GAME].addEventListener('enterframe',function() {
            timer = Math.floor(core.frame / core.fps);

            scoreLabel.text = "スコア: " + score;
            timeLabel.text = "クリアまで: " + (80 - timer);
            
            if(core.frame % interval == 0) {
                let date = new Date();
                let itemSprite = new Sprite();
                itemSprite.id = core.frame;
                itemSprite.type = "";
                if(Math.round(Math.random()) === 0) {
                    itemSprite.type = "seijun";
                    itemSprite.image = core.assets['./img/rabbit.png'];
                } else {
                    itemSprite.type = "fujun";
                    itemSprite.image = core.assets['./img/r18.png'];
                    itemSprite.debugColor = "#0000ff";
                }
                itemSprite.width = 100;
                itemSprite.height = 100;
                itemSprite.moveTo(Math.random() * (SIZE_X - itemSprite.width), -120);

                itemSprite.addEventListener('enterframe', function() {
                    itemSprite.y += 5;
                    itemSprite.y += Math.floor(timer / 5);

                    if(itemSprite.y > SIZE_Y) {
                        if(itemSprite.type == "fujun") {
                            if(score >= 30) score -= 30;
                            else score = 0;
                            life--;
                            let se = core.assets['./sound/damage.mp3'].clone();
                            se.play();
                            scene[GAME].removeChild(lifeSprite[life]);
                            if(life == 0) {
                                bgm.stop();
                                core.replaceScene(scene[RESULT]);
                            }
                            scene[GAME].removeChild(itemSprite);
                            itemSprie = null;
                        }
                    }
                });
                itemSprite.addEventListener('touchstart', function() {
                    if(itemSprite.type == "fujun") {
                        let se = core.assets['./sound/fujun1.mp3'].clone();
                        se.play();
                        score += 10;
                    } else {
                        let se = core.assets['./sound/hazure.mp3'].clone();
                        se.play();
                        if(score >= 10) { 
                            score -= 10;
                        } else {
                            score = 0;
                        }
                    }
                    scene[GAME].removeChild(itemSprite);
                    itemSprite = null;
                });

                scene[GAME].addChild(itemSprite);
            }
            if(score < 0) score = 0;
            if(timer >= 80) {
                bgm.stop();
                core.replaceScene(scene[RESULT]);
            }
        });
        
        scene[GAME].addChild(scoreLabel);
        scene[GAME].addChild(timeLabel);

        let resultSprite = new Sprite();
        resultSprite.image = core.assets['./img/result.png'];
        resultSprite.width = 300;
        resultSprite.height = 100;
        resultSprite.moveTo((core.width - resultSprite.width) / 2, 300);
        scene[RESULT].addChild(resultSprite);

        let resultScoreLabel = new Label();
        resultScoreLabel.font = "50px 'meiryo'";
        resultScoreLabel.width = 350;
        resultScoreLabel.moveTo((core.width - resultScoreLabel.width) / 2, 500);
        scene[RESULT].addChild(resultScoreLabel);

        let returnLabel = new Label("click return");
        returnLabel.font = "20px 'meiryo'";
        returnLabel.moveTo((core.width - returnLabel._boundWidth) / 2, 750 );
        scene[RESULT].addChild(returnLabel);

        let tweetLabel = new Label("ついーとする");
        tweetLabel.font = "35px 'meiryo'";
        tweetLabel.width = 220;
        tweetLabel.moveTo((core.width - tweetLabel.width) / 2, 650 );
        scene[RESULT].addChild(tweetLabel);

        
        tweetLabel.addEventListener('touchstart', function() {
            let EUC = encodeURIComponent;
            let tweetUrl = "http://twitter.com/?status=";
            let message = "響木アオちゃんファンゲーム【清純ですよ？】 あなたの清純度は" + Math.floor(score / 600 * 100)+ "%でした！遊んでくれてありがとう！ ゲームのリンクはココ！ https://silmin.github.io #HibikiAo";

            location.href = tweetUrl + EUC(message);
        });

        scene[RESULT].addEventListener('enter', function() {
            scene[RESULT].addChild(myAccountLabel);
            bgm = core.assets['./sound/result.mp3'];
            bgm.play();
            bgm.volume = 0.3;

            if(score < 0) score = 0;
            resultScoreLabel.text = "清純度 : " + Math.floor(score / 600 * 100) + " %";
        });
        returnLabel.addEventListener('touchstart', function() {
            core.assets['./sound/return.mp3'].play();
            location.reload();
        });
    };
    core.start();
    //core.debug();
};
