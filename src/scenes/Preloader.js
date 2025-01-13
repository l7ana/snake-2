import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        const isTouchDevice = this.isMobile();
        const layout = this.calculateLayout();

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
        }).setOrigin(0.5).setAlpha(0).setScale(1);

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

    isMobile() {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const deviceWidthSmall = screen.availHeight > screen.availWidth || window.innerHeight > window.innerWidth;
    
        return regex.test(navigator.userAgent) || deviceWidthSmall ? true : false;
    }
    calculateLayout() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        const isTouchDevice = this.isMobile();
        
        return {
            gameWidth,
            gameHeight,
            centerX: gameWidth / 2,
            centerY: gameHeight / 2,
            sceneWidth: gameWidth * 0.75,
            sceneHeight: isTouchDevice ? gameWidth * 0.9 : gameHeight * 0.75,
            isTouchDevice
        };
    }

    preload ()
    {
        const isTouchDevice = this.isMobile();
        if (this.sys.game.device.browser.safari) {
            this.load.image('one', isTouchDevice ? 'assets/scenes/01_Window_382x382_@2x.jpg' : 'assets/scenes/01_Window_890x593_@2x.jpg');
            this.load.image('two', isTouchDevice ? 'assets/scenes/02_Jars_382x283_@2x.jpg' : 'assets/scenes/02_Jars_890x593_@2x.jpg');
            this.load.image('three', isTouchDevice ? 'assets/scenes/03_Wallhooks_382x282_@2x.jpg' : 'assets/scenes/03_Wallhooks_890x593_@2x.jpg');
            this.load.image('four', isTouchDevice ? 'assets/scenes/04_OnFloor_382x382_@2x.jpg' : 'assets/scenes/04_OnFloor_890x593_@2x.jpg');
            this.load.image('five', isTouchDevice ? 'assets/scenes/05_EndScreen_382x382_@2x.jpg' : 'assets/scenes/05_EndScreen_890x593_@2x.jpg');
        } 
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('one', isTouchDevice ? 'scenes/01_Window_382x382_@2x.jpg' : 'scenes/01_Window_890x593_@2x.jpg');
        this.load.image('two', isTouchDevice ? 'scenes/02_Jars_382x283_@2x.jpg' : 'scenes/02_Jars_890x593_@2x.jpg');
        this.load.image('three', isTouchDevice ? 'scenes/03_Wallhooks_382x282_@2x.jpg' : 'scenes/03_Wallhooks_890x593_@2x.jpg');
        this.load.image('four', isTouchDevice ? 'scenes/04_OnFloor_382x382_@2x.jpg' : 'scenes/04_OnFloor_890x593_@2x.jpg');
        this.load.image('five', isTouchDevice ? 'scenes/05_EndScreen_382x382_@2x.jpg' : 'scenes/05_EndScreen_890x593_@2x.jpg');
        
        this.load.audio('glass3', ['sfx/glass_03.ogg', 'sfx/glass_03.mp3'])
        this.load.audio('glass2', ['sfx/glass_02.ogg', 'sfx/glass_02.mp3'])
        this.load.audio('bookflip', ['sfx/book_flip.1.ogg', 'sfx/book_flip.1.mp3'])
        this.load.audio('button1', ['sfx/button press 1.ogg', 'sfx/button press 1.mp3'])
        this.load.audio('button2', ['sfx/button press 2.ogg', 'sfx/button press 2.mp3'])
        this.load.audio('music1', ['music/likea_my_chinese.ogg', 'music/likea_my_chinese.mp3'])
        this.load.audio('music2', ['music/Beijing-Beats---31s_AdobeStock.ogg', 'music/Beijing-Beats---31s_AdobeStock.mp3'])
        this.load.audio('crash', ['sfx/tr707-crash-cymbal-241376.ogg', 'sfx/tr707-crash-cymbal-241376.mp3']);
        //Add audio files to audioFiles to decode
        // this.sound.decodeAudio(audioFiles)

        this.load.spritesheet('snake1','./sprites/SDG_snake_1.png', {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet('sHead', './sprites/snakehead-spritesheet-01.png', {frameWidth: 64, frameHeight: 64})
        this.load.image('food', 'food.png')
        this.load.image('food1', '/treat/cookie_chocolate_chip.png')
        this.load.image('food2', '/treat/cupcake.png')
        this.load.image('food3', '/treat/doughnut.png')
        this.load.image('food4', '/treat/ice_cream_bar_01.png')
        this.load.image('food5', '/treat/ice_cream_sundae_02.png')
        this.load.image('food6', '/treat/popsicle.png')
        this.load.image('food7', '/treat/shake.png')
        this.load.image('food8', '/treat/ice_cream_sandwich_02.png')

        //load key buttons
        this.load.image('left', '/buttons/SDG_LNY2025_Left.svg')
        this.load.image('right', '/buttons/SDG_LNY2025_Right.svg')
        this.load.image('up', '/buttons/SDG_LNY2025_Up.svg')
        this.load.image('down', '/buttons/SDG_LNY2025_Down.svg')

        this.load.svg('next', '/buttons/SDG_LNY2025_Next.svg')
        this.load.svg('prev', '/buttons/SDG_LNY2025_Prev.svg')
        this.load.svg('start', '/buttons/SDG_LNY2025_Start.svg')
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
