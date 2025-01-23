import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { Intro1 } from './scenes/Intro1';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig


let width = 1080;
let height = 720;

function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const deviceWidthSmall = screen.availHeight > screen.availWidth || window.innerHeight > window.innerWidth;
  return regex.test(navigator.userAgent) && deviceWidthSmall ? true : false;
}
  
  if (isMobile()) {
    width = 720;
    height = 1080;
  } else {
    width = 1080;
    height = 720;
  }


const config = {
    type: Phaser.AUTO,
    // renderer: Phaser.CANVAS,
    parent: 'game-container',
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: height,
    backgroundColor: '#112725',
    scene: [
        Boot,
        Preloader,
        Intro1,
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
