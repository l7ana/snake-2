import { Game, Scene } from 'phaser';




export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        var gameWidth = this.cameras.main.width;
        var gameHeight = this.cameras.main.height;
        var gameCenterWidth = gameWidth / 2;
        var gameCenterHeight = gameHeight / 2;
        
        this.add.image(gameCenterWidth, gameCenterHeight, 'background');

        this.add.image(gameCenterWidth, gameCenterHeight-200, 'logo');

        this.add.text(gameCenterWidth, gameCenterHeight+50, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        if (!this.sys.game.device.input.touch) {
            this.add.text(gameCenterWidth, 500, 'not mobile', {
                fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'center'
            }).setOrigin(0.5);
        } else {
            this.add.text(gameCenterWidth, 500, 'mobile', {
                fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'center'
            }).setOrigin(0.5);
        }

        this.input.addPointer(2);
        this.pointer = this.input.activePointer;

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
