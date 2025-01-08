import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        const gameCenterX = gameWidth / 2;
        const gameCenterY = gameHeight / 2;
        this.cursors = this.input.keyboard.createCursorKeys();
        //  We loaded this image in our Boot Scene, so we can display it here

        //  A simple progress bar. This is the outline of the bar.
        const rectangle = this.add.rectangle(gameCenterX, gameCenterY - 50, ((gameWidth*0.9) + 2), 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(gameCenterX - (rectangle.width / 2) + 1, gameCenterY - 50, 2, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 2 + (((gameWidth*0.9) - 2) * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.font('Price Check', 'pricecheck-webfont.woff', 'otf');

        this.load.spritesheet('snake1','./sprites/SDG_snake_1.png', {frameWidth: 64, frameHeight: 64})
            // this.load.spritesheet('body', 'body.png', {frameWidth: 50, frameHeight: 50});
        this.load.image('food', 'food.png')
        //load treats
        this.load.image('food1', '/treat/cookie_chocolate_chip.png')
        this.load.image('food2', '/treat/cupcake.png')
        this.load.image('food3', '/treat/doughnut.png')
        this.load.image('food4', '/treat/ice_cream_bar_01.png')
        this.load.image('food5', '/treat/ice_cream_sundae_02.png')
        this.load.image('food6', '/treat/popsicle.png')
        this.load.image('food7', '/treat/shake.png')
        this.load.image('food8', '/treat/ice_cream_sandwich_02.png')

        //load key buttons
        this.load.image('left', '/buttons/KeyboardButtonsDir_left.png')
        this.load.image('right', '/buttons/KeyboardButtonsDir_right.png')
        this.load.image('up', '/buttons/KeyboardButtonsDir_up.png')
        this.load.image('down', '/buttons/KeyboardButtonsDir_down.png')

        this.load.svg('next', '/buttons/SDG_LNY2025_Next.svg')
        this.load.svg('prev', '/buttons/SDG_LNY2025_Prev.svg')
        this.load.svg('start', '/buttons/SDG_LNY2025_Start.svg')
    }

    create ()
    {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        const gameCenterX = gameWidth / 2;
        const gameCenterY = gameHeight / 2;
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        const beginText = this.add.text(gameCenterX, gameCenterY, 'Click to Start', {
            fontFamily: 'Price Check',
            fontSize: 40,
            color: '#FF593F',
            align: 'center'
        }).setOrigin(0.5);

        // this.load.on('complete', function () {
        //     beginText.visible = true;
        //     beginText.setAlpha(1);
        // })

        //  Move to the Intro. You could also swap this for a Scene Transition, such as a camera fade.
        // this.scene.start('Intro1');
        this.input.addPointer(2);
        this.pointer = this.input.activePointer;
    }

    update () {
        this.goNext = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        if (Phaser.Input.Keyboard.JustDown(this.goNext)) {
            this.scene.start('Game');
            return;
          }

        this.input.once('pointerup', () => {
            // this.scene.start('Intro1');
            this.scene.transition({
                target: 'Intro1',
                ease: 'linear',
                duration: 1000,
                moveAbove: true,
            })
        });
    }
}
