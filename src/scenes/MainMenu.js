import { Game, Scene } from 'phaser';

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

        var story = this.add.image(gameCenterWidth, gameCenterHeight, 'one', 0, {
            width: width,
            height: height
        })

        console.log(story)
        console.log(gameWidth,story.displayOriginX)
        story.displayWidth = width;
        // story.displayHeight= height;
        story.scale = .5;
        // story.setCrop((story.displayOriginX *.2) - (story.displayOriginX * .1), 0, width*2, height*2)

        this.add.text(50, gameHeight-50, 'Once upon one time, in one crack seed stoa, ', {
            fontFamily: 'Open Sans', fontSize: 20, color: '#DECEB7',
            align: 'left'
        }).setOrigin(0.75);

        if (!this.sys.game.device.input.touch) {
            this.add.text(gameCenterWidth, 500, 'not mobile', {
                fontFamily: 'Open Sans', fontSize: 20, color: '#ffffff',
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
