import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
// import { GridEngine, GridEngineHeadless } from "grid-engine";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig


let width = 1080;
let height = 720;

function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const deviceWidthSmall = window.innerWidth <= 1024;
  return regex.test(navigator.userAgent) || deviceWidthSmall ? true : false;
  }
  
  if (isMobile()) {
    console.log("Mobile device detected");
    width = 720;
    height = 1090;
  } else {
    console.log("Desktop device detected");
  }


const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    mode: Phaser.Scale.FIT,
    width: width,
    height: height,
    backgroundColor: '#112725',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        GameOver
    ],
    physics: {
        default: 'arcade',
        arcade: { 
            debug: true,
            fps: 12
         }
    },
};

export default new Phaser.Game(config);
