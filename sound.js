enchant();


SoundLoop = Class.create(Sprite, {
  Sound,
  SFlg:0,
  game,
  initialize:function(_game){ //クラスの初期化(コンストラクタ)
    game=_game;
    Sprite.call(this,0,0); //スプライトの初期化
    SFlg=0;
    game.onenterframe=function(){ //enterframeイベントのイベントリスナー
      if(SFlg==1){
        try{
          if(!Sound.src){ //もしSound.srcがないならenterframeによるループ再生
            Sound.play();
          }
        }catch(e){}
      } 
    };
  },
  Set:function(_Sound){
    Sound=_Sound;
    SFlg=0;
    try{
      Sound.stop();
    }catch(e){}
    Sound=game.assets[Sound];
    try{ 
      // もしSound.srcがあるなら、ループ再生フラグをtrueにする。
      if(Sound.src){
        Sound.play();
        Sound.src.loop = true;
      }
    }catch(e){}
    SFlg=1;
  },
  Stop:function(Sound){
    try{
      Sound.stop();
      SFlg=0;
    }catch(e){}
  }
});
