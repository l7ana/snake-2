import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.isMobile();
        const layout = this.calculateLayout();
        
        // Create border
        this.createStoryImage(layout);
        this.createBorder(layout);
        this.createText(layout);

        const firstLineTextY = 120;
        const secondLineTextY = this.isMobile() ? layout.centerY - (layout.sceneHeight/2) + 10 : layout.centerY - 150;
        const thirdLineTextY = this.isMobile() ? layout.centerY - (layout.centerY/2) + 60 : layout.centerY - 60;

        this.add.text(layout.centerX, firstLineTextY, 'THANKS FOR PLAYING!', {
            fontFamily: 'Price Check Wide', fontSize: this.isMobile() ? 30 : 20, color: '#FF593F',
            align: 'center'
        }).setOrigin(0.5).setLetterSpacing(1.5);

        this.add.text(layout.centerX, secondLineTextY, 'WISHING YOU A VERY LI HING LUNAR NEW YEAR', {
            fontFamily: 'Price Check Condensed',
            fontSize: 64,
            color: '#FF593F',
            align: 'center',
            lineSpacing: -10,
            wordWrap: { 
                width: this.isMobile() ? layout.sceneWidth : layout.sceneWidth*.75, 
                useAdvancedWrap: true 
            }
        }).setOrigin(0.5).setLetterSpacing(1);


        this.add.text(layout.centerX, thirdLineTextY, 'FROM ALL OF US AT SAE DESIGN', {
            fontFamily: 'Open Sans', fontSize: this.isMobile() ? 24 : 18, color: '#DECEB7',
            align: 'center'
        }).setOrigin(0.5).setLetterSpacing(3);

        this.sound.stopByKey('music2');
        this.sound.removeByKey('music2');

        
        const buttonY = this.isMobile() ? layout.gameHeight - 100 : layout.gameHeight - 90;
        const replayButtonWidth = this.isMobile() ? 180 : 90;
        const buttonScale = this.isMobile() ? 1 : 0.6;
        const buttonHeight = this.isMobile() ? 64 : 32;
        const shareButtonWidth = this.isMobile() ? 116 : 116;
        const shareButtonX = this.isMobile() ? layout.sceneWidth + 25 : layout.sceneWidth + shareButtonWidth + 25;
        const replayButtonX = this.isMobile() ? layout.gameWidth*0.2 + replayButtonWidth + 5 : shareButtonX - replayButtonWidth - 50;
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

    isMobile() {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const deviceWidthSmall = screen.availHeight > screen.availWidth || window.innerHeight > window.innerWidth;
    
        return regex.test(navigator.userAgent) && deviceWidthSmall ? true : false;
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
            sceneWidth: isTouchDevice ? gameWidth * 0.9 : gameWidth * 0.75,
            sceneHeight: isTouchDevice ? gameWidth * 0.9 : gameHeight * 0.75,
            isTouchDevice,
            scale: isTouchDevice ? 2 : 1
        };
    }

    createBorder({ gameWidth, sceneWidth, sceneHeight }) {
        const debug = this.add.graphics();
        const borderX = (gameWidth - sceneWidth) / 2;
        
        debug.lineStyle(10, 0x457E7B).strokeRect(borderX, 50, sceneWidth, sceneHeight);
            
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
