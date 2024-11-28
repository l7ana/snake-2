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
        this.load.spritesheet('body', './sprites/MiddleSprite.png', {frameWidth: 50, frameHeight: 50});
        this.load.image('food', 'foodsample.png')
        this.load.image('tiles', 'drawtiles-spaced.png')
        this.load.tilemapTiledJSON('map', 'blankmap2.json');
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
