import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
// import { GridEngine, GridEngineHeadless } from "grid-engine";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

let width = 1200;
let height = 800;

function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }
  
  if (isMobile()) {
    console.log("Mobile device detected");
    width = 800;
    height = 1200;
  } else {
    console.log("Desktop device detected");
  }

const config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    parent: 'game-container',
    backgroundColor: '#f4ffd4',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
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
            fps: 12,
            OVERLAP_BIAS: 50
         }
    },
};

export default new Phaser.Game(config);
