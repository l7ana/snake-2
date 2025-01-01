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
        var sceneWidth = gameWidth * .75;
        var sceneHeight = gameHeight * .75;

        const debug = this.add.graphics();
        const parent = new Phaser.Structs.Size(sceneWidth, sceneHeight);

        var story = this.add.image(gameCenterWidth, gameCenterHeight - 50, 'one', 0, {
            width: sceneWidth,
            height: sceneHeight
        })
        // story.scaleX  = story.scaleY
        
        story.setScale(0.5).setCrop(((gameWidth - parent.width)*1.5 - 15), (parent.height*1.25) + 5, parent.width*2, parent.height*2)

        const draw = () => {
            debug.lineStyle(10, 0x457E7B).strokeRect((gameWidth - parent.width) / 2, 50, parent.width, parent.height);
        }

        if (!this.sys.game.device.input.touch) {
            story.setScale(0.5).setCrop(((gameWidth - parent.width)*1.5 - 15), (parent.height*1.25) + 5, parent.width*2, parent.height*2)

            this.add.text(((gameWidth - parent.width) / 2) - 5, gameHeight-75, 'Once upon one time, in one crack seed stoa, ', {
                fontFamily: 'Open Sans', fontSize: 20, color: '#DECEB7',
                align: 'left'
            }).setOrigin(0);
        } else {
            story.setScale(0.5).setCrop(parent.width + (gameWidth - parent.width)/2 + 30, (parent.height/2)-100, parent.width*2, parent.height*2)
            console.log(gameWidth - parent.width)

            this.make.text({
                x: ((gameWidth - parent.width) / 2) - 5,
                y: gameHeight-150,
                text: 'Once upon one time, in one crack seed stoa, ',
                origin: 0,
                style: {
                    fontFamily: 'Open Sans',
                    fontSize: 40,
                    color: '#DECEB7',
                    wordWrap: { width: gameWidth / 2, useAdvancedWrap: true }
                }
            })
        }

        draw();

        this.input.addPointer(2);
        this.pointer = this.input.activePointer;

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
