import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
// import { GridEngine, GridEngineHeadless } from "grid-engine";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig


const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    mode: Phaser.Scale.FIT,
    width: 1920,
    height: 1080,
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
