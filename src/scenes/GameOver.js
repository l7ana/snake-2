import { Scene } from 'phaser';
import { isMobile, calculateLayout } from '../components/Helpers';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        const mobile = isMobile(this);
        const layout = calculateLayout(mobile, this);

        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const isSpecialDevice = isSafari || isChrome && isMacOS;
        
        // Create border
        this.createStoryImage(layout);
        this.createBorder(layout);
        this.createText(layout);

        const firstLineTextY = 120;
        const secondLineTextY = mobile ? layout.centerY - (layout.sceneHeight/2) + 10 : layout.centerY - 150;
        const thirdLineTextY = mobile ? layout.centerY - (layout.centerY/2) + 60 : layout.centerY - 60;

        this.add.text(layout.centerX, firstLineTextY, 'THANKS FOR PLAYING!', {
            fontFamily: 'Price Check Wide', fontSize: mobile ? 30 : 20, color: '#FF593F',
            align: 'center'
        }).setOrigin(0.5).setLetterSpacing(1.5);

        this.add.text(layout.centerX, secondLineTextY, 'WISHING YOU A VERY LI HING LUNAR NEW YEAR', {
            fontFamily: 'Price Check Condensed',
            fontSize: 64,
            color: '#FF593F',
            align: 'center',
            lineSpacing: -10,
            wordWrap: { 
                width: mobile ? layout.sceneWidth : layout.sceneWidth*.75, 
                useAdvancedWrap: true 
            }
        }).setOrigin(0.5).setLetterSpacing(1);


        this.add.text(layout.centerX, thirdLineTextY, 'FROM ALL OF US AT SAE DESIGN', {
            fontFamily: 'Open Sans', fontSize: mobile ? 24 : 18, color: '#DECEB7',
            align: 'center'
        }).setOrigin(0.5).setLetterSpacing(3);

        this.sound.stopByKey('music2');
        this.sound.removeByKey('music2');

        
        const buttonY = mobile ? layout.gameHeight - 100 : layout.gameHeight - 90;
        const replayButtonWidth = mobile ? 180 : 90;
        const buttonScale = isSpecialDevice && mobile ? 1.5 :
            isSpecialDevice ? .9 : 
            mobile ? 1 : 0.5;
        const shareButtonWidth = mobile ? 116 : 116;
        const shareButtonX = isSpecialDevice && mobile ? layout.sceneWidth :
            isSpecialDevice ? layout.sceneWidth + shareButtonWidth*1.25 + 30 :
            mobile ? layout.sceneWidth - 50 : layout.sceneWidth + shareButtonWidth + 25;
        const replayButtonX = isSpecialDevice ? shareButtonX - replayButtonWidth - 100 :
            mobile ? layout.gameWidth*0.2 + replayButtonWidth + 5 + 45 : shareButtonX - replayButtonWidth - 50;

        const shareButton = this.add.image(shareButtonX, buttonY + 25, 'share', 0).setOrigin(1, 0.5).setScale(buttonScale);
        const replayButton = this.add.image(replayButtonX, buttonY + 25, 'replay', 0, { width: replayButtonWidth }).setOrigin(1, 0.5).setScale(buttonScale);
        console.log(shareButton)
        console.log(replayButton)
        shareButton.displayHeight = replayButton.displayHeight;
        shareButton.displayWidth = shareButtonWidth;
        shareButton.scaleX = shareButton.scaleY;

        replayButton.setInteractive();
        replayButton.on('pointerup', () => {
            this.scene.start('Game');
        });

        shareButton.setInteractive();
        shareButton.on('pointerup', () => {
            var dummy = document.createElement('input'),
            text = window.location.href;

            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert("Link copied!")
        });
    }

    createBorder({ gameWidth, sceneWidth, sceneHeight }) {
        const debug = this.add.graphics();
        const borderX = (gameWidth - sceneWidth) / 2;
        
        debug.lineStyle(10, 0x345F5C).strokeRect(borderX, 50, sceneWidth, sceneHeight);
            
        return debug;
    }

    createStoryImage(layout) {
        const { centerX, centerY, sceneWidth, sceneHeight, scale, isTouchDevice } = layout;
        const storyYCenter = isTouchDevice ? (centerY/2) + (50*scale) : centerY - 50 + 5;
        //The Y of Border is 50, the border width is 10
        const story = this.add.image(centerX, storyYCenter, 'five', 0, {
            width: sceneWidth,
            height: sceneHeight
        }).setScale(scale).setDisplaySize(sceneWidth, sceneHeight);
        if (this.sys.game.device.browser.safari) {
            story.setScale(story.scaleX, story.scaleX)
        }
        
        return story;
    }

    createText(layout) {
        const { gameWidth, gameHeight, centerY, sceneHeight, sceneWidth, isTouchDevice } = layout;
        const textX = ((gameWidth - sceneWidth) / 2) - 5;
        const textY = isTouchDevice ? centerY + (sceneHeight/2) - 100 : gameHeight - 100;
        const fontSize = isTouchDevice ? 26 : 20;
        const wordWrapWidth = isTouchDevice ? gameWidth * 0.9: gameWidth * 0.45;
        
        return this.add.text(textX, textY, 'Wishing you a very yummy, sweet, li hing Lunar New Year filled with prosperity and abundance, from all of us at Sae Design Group!', {
            fontFamily: 'Open Sans',
            fontSize: fontSize,
            color: '#DECEB7',
            lineSpacing: fontSize/4,
            align: 'left',
            fontStyle: 'Bold',
            wordWrap: { 
                width: wordWrapWidth, 
                useAdvancedWrap: true 
            }
        }).setOrigin(0);
    }
}
