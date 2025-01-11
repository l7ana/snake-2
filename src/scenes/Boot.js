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

        const newFontFace = new FontFace('CustomFont', 'url(assets/pricecheck-webfont.woff)');
        document.fonts.add(newFontFace);
        newFontFace.load().then(() => {
            this.scene.start("Preloader");
        });
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
