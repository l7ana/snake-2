import { Scene } from 'phaser';
import { isMobile, calculateLayout } from '../components/Helpers';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        const mobile = isMobile(this);
        const layout = calculateLayout(mobile, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        //  We loaded this image in our Boot Scene, so we can display it here

        //  A simple progress bar. This is the outline of the bar.
        this.rectangle = this.add.rectangle(layout.centerX, layout.centerY - 50, layout.sceneWidth + 2, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        this.bar = this.add.rectangle(layout.centerX - (this.rectangle.width / 2) + 1, layout.centerY - 50, 2, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            this.bar.width = 2 + (layout.sceneWidth - 2 * progress);

        });

        this.beginText = this.add.text(layout.centerX, layout.centerY - 150, 'CLICK TO START', {
            fontFamily: 'Price Check',
            fontSize: 72,
            color: '#FF593F',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0).setScale(1).setLetterSpacing(2);

        this.load.on('complete', function ()
        {
          this.tweens.add({
            targets: this.beginText,
            ease: 'Power1',
            alpha: 1,
            duration: 1000,
            onComplete: () => {
                this.tweens.add({
                    targets:  this.beginText,
                    scale: 1.1,
                    ease: 'Power1',
                    yoyo: true,
                    loop: 100,
                    duration: 1000
                });
            }
        });

        }, this);
    }

    preload ()
    {
        const mobile = isMobile(this);
        const layout = calculateLayout(mobile, this);
        if (this.sys.game.device.browser.safari || this.sys.game.device.browser.mobileSafari ) {
            this.load.image('one', mobile ? 'assets/scenes/01_Window_382x382_@2x.jpg' : 'assets/scenes/01_Window_890x593_@2x.jpg');
            this.load.image('two', mobile ? 'assets/scenes/02_Jars_382x283_@2x.jpg' : 'assets/scenes/02_Jars_890x593_@2x.jpg');
            this.load.image('three', mobile ? 'assets/scenes/03_Wallhooks_382x282_@2x.jpg' : 'assets/scenes/03_Wallhooks_890x593_@2x.jpg');
            this.load.image('four', mobile ? 'assets/scenes/04_OnFloor_382x382_@2x.jpg' : 'assets/scenes/04_OnFloor_890x593_@2x.jpg');
            this.load.image('five', mobile ? 'assets/scenes/05_EndScreen_382x382_@2x.jpg' : 'assets/scenes/05_EndScreen_890x593_@2x.jpg');
        } 
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('one', mobile ? 'scenes/01_Window_382x382_@2x.jpg' : 'scenes/01_Window_890x593_@2x.jpg');
        this.load.image('two', mobile ? 'scenes/02_Jars_382x283_@2x.jpg' : 'scenes/02_Jars_890x593_@2x.jpg');
        this.load.image('three', mobile ? 'scenes/03_Wallhooks_382x282_@2x.jpg' : 'scenes/03_Wallhooks_890x593_@2x.jpg');
        this.load.image('four', mobile ? 'scenes/04_OnFloor_382x382_@2x.jpg' : 'scenes/04_OnFloor_890x593_@2x.jpg');
        this.load.image('five', mobile ? 'scenes/05_EndScreen_382x382_@2x.jpg' : 'scenes/05_EndScreen_890x593_@2x.jpg');
        
        this.load.audio('bookflip', ['sfx/book_flip.1.ogg', 'sfx/book_flip.1.mp3'])
        this.load.audio('music1', ['music/likea_my_chinese.ogg', 'music/likea_my_chinese.mp3'])
        this.load.audio('gong1', 'sfx/gong_01_01.mp3')
        this.load.audio('gong2', 'sfx/gong_02_02.mp3')
        this.load.audio('music2', ['music/Beijing-Beats-31s_AdobeStock.ogg', 'music/Beijing-Beats-31s_AdobeStock.mp3'])
        this.load.audio('crash', ['sfx/tr707-crash-cymbal.ogg', 'sfx/tr707-crash-cymbal.mp3']);

        this.load.spritesheet('snake1','./sprites/SDG_snake_1.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('sHead', './sprites/SDG_SnakeHead1.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('sTail', './sprites/SDG_SnakeButt1.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('sBodyAB', './sprites/BODY SPLIT SHEET.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('sBendAB', './sprites/TURN SPLIT SHEET.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('sBodyA', './sprites/BODY YELLOW SHEET.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('sBendA', './sprites/TURN YELLOW SHEET.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('sBodyB', './sprites/BODY RED SHEET.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('sBendB', './sprites/TURN RED SHEET.png', {frameWidth: 64, frameHeight: 64})

        this.load.svg('food1', '/treat/SDG_LNY2025_Watermelon.svg', { scale: mobile ? 1 : 0.6 })
        this.load.svg('food2', '/treat/SDG_LNY2025_Mui2.svg', { scale: mobile ? 1 : 0.6 })
        this.load.svg('food3', '/treat/SDG_LNY2025_Mui1.svg', { scale: mobile ? 1 : 0.6 })
        this.load.svg('food4', '/treat/SDG_LNY2025_Arare1.svg', { scale: mobile ? 1 : 0.6 })
        this.load.svg('food5', '/treat/SDG_LNY2025_Arare2.svg', { scale: mobile ? 1 : 0.6 })
        this.load.svg('food6', '/treat/SDG_LNY2025_Gummy1.svg', { scale: mobile ? 1 : 0.6 })
        this.load.svg('food7', '/treat/SDG_LNY2025_Gummy2.svg', { scale: mobile ? 1 : 0.6 })
        this.load.svg('food8', '/treat/SDG_LNY2025_Gummy3.svg', { scale: mobile ? 1 : 0.6 })

        //load key buttons
        this.load.image('left', '/buttons/SDG_LNY2025_Left.svg')
        this.load.image('right', '/buttons/SDG_LNY2025_Right.svg')
        this.load.image('up', '/buttons/SDG_LNY2025_Up.svg')
        this.load.image('down', '/buttons/SDG_LNY2025_Down.svg')


        this.load.svg('sound', '/buttons/SDG_LNY2025_Sound.svg')
        this.load.svg('mute', '/buttons/SDG_LNY2025_Mute.svg')

        this.load.image('next', '/buttons/SDG_LNY2025_Next.svg')
        this.load.image('prev', '/buttons/SDG_LNY2025_Prev.svg')
        this.load.image('start', '/buttons/SDG_LNY2025_Start.svg')
        this.load.image('replay', '/buttons/SDG_LNY2025_Replay.svg')
        this.load.image('share', '/buttons/SDG_LNY2025_Share.svg')
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
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
            this.tweens.add({
                targets: [this.beginText, this.bar, this.rectangle],
                ease: 'Power3',
                alpha: 0,
                duration: 1000,
                onComplete: () =>{
                    this.scene.transition({
                        target: 'Intro1',
                        ease: 'linear',
                        duration: 1000,
                        moveBelow: true,
                    })
                }
            });
        });
    }
}
