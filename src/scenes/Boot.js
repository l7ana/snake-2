import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
        this.isMobile();
    }

    isMobile() {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const deviceWidthSmall = screen.availHeight > screen.availWidth || window.innerHeight > window.innerWidth;
        const isTouchDevice = Phaser.Input.Touch;
    
        return isTouchDevice && regex.test(navigator.userAgent) || deviceWidthSmall ? true : false;
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');

        const isTouchDevice = this.isMobile();
        this.load.image('one', isTouchDevice ? 'assets/scenes/01_Window_382x382_@2x.jpg' : 'assets/scenes/01_Window_890x593_@2x.jpg');
        this.load.image('two', isTouchDevice ? 'assets/scenes/01_Jars_382x283_@2x.jpg' : 'assets/scenes/02_Jars_890x593_@2x.jpg');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
