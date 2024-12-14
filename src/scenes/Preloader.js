import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        
        this.load.spritesheet('head', './sprites/HeadSprite.png', {frameWidth: 50, frameHeight: 50});
        this.load.image('body', 'body.png');
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

        
        this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');

        
        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'head',
            frames: this.anims.generateFrameNames('head', { prefix: '', start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
    }
}
