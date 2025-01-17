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
    
        return isTouchDevice && regex.test(navigator.userAgent) && deviceWidthSmall ? true : false;
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        if (this.sys.game.device.browser.safari || this.sys.game.device.browser.mobileSafari ) {
            try {
                this.load.font('Price Check', 'assets/pricecheck-webfont.woff', 'woff');
                this.load.font('Price Check Wide', 'assets/pricecheck-extended-webfont.woff', 'woff');
                this.load.font('Price Check Condensed', 'assets/pricecheck-condensed-webfont.woff', 'woff');

            } catch(error) {
                console.log(error)
            } finally {
        
                const newFontFace1 = new FontFace('Price Check', 'url(assets/pricecheck-webfont.woff)');
                document.fonts.add(newFontFace1);
        
                const newFontFace2 = new FontFace('Price Check Wide', 'url(assets/pricecheck-extended-webfont.woff)');
                document.fonts.add(newFontFace2);
        
                const newFontFace3 = new FontFace('Price Check Condensed', 'url(assets/pricecheck-condensed-webfont.woff)');
                document.fonts.add(newFontFace3);
        
                newFontFace1.load().then(() => {
                    this.scene.start("Preloader");
                    newFontFace2.load();
                    newFontFace3.load();
                });

            }
        }
        
        const newFontFace1 = new FontFace('Price Check', 'url(assets/pricecheck-webfont.woff)');
        document.fonts.add(newFontFace1);

        const newFontFace2 = new FontFace('Price Check Wide', 'url(assets/pricecheck-extended-webfont.woff)');
        document.fonts.add(newFontFace2);

        const newFontFace3 = new FontFace('Price Check Condensed', 'url(assets/pricecheck-condensed-webfont.woff)');
        document.fonts.add(newFontFace3);

        newFontFace1.load().then(() => {
            this.scene.start("Preloader");
            newFontFace2.load();
            newFontFace3.load();
        });
    }

    create ()
    {
        // this.scene.start('Preloader');
    }
}
