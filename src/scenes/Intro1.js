import { Game, Scene } from 'phaser';
import { isMobile, calculateLayout } from '../components/Helpers';

export class Intro1 extends Scene {
    constructor() {
        super('Intro1');
        this.storyContent = [
            {
                imageKey: 'one',
                text: 'Once upon one time, in one crack seed stoa, '
            },
            {
                imageKey: 'two', 
                text: 'Had small kine magic in da li hing mui, cuz one night, next ting you know '
            },
            {
                imageKey: 'three',
                text: 'One litto gummy worm came alive! Buggah was hungry, so he went break loose!'
            },
            {
                imageKey: 'four',
                text: 'He landed on da floa and saw one big juicy candy good enough fo’ eat. Help him eat all da goodies befoa Uncle Kimo finds out!'
            }
        ];
        this.currentContentIndex = 0;
    }

    create() {

        const mobile = isMobile(this);
        const layout = calculateLayout(mobile, this);

        this.sound.mute = false;
        
        // Store references to image and text as class properties
        this.storyImage = this.createStoryImage(layout).setAlpha(0);
        this.storyText = this.createText(layout).setAlpha(0);
        
        // Create border
        this.createBorder(layout);

        this.events.on('transitionstart', function (fromScene, duration)
        {
          this.tweens.add({
            targets: [ this.storyText, this.storyImage ],
            ease: 'linear',
            alpha: 1,
            duration: duration
        });

        }, this);
        
        // Setup input
        this.input = this.setupInput(layout);
        this.sound.unlock();
        this.sound.play('music1', {loop: true, volume: 0.5})
        this.sound.setVolume(0.3)

        const wordWrapWidth = mobile ? layout.gameWidth * 0.5: layout.gameWidth;
        this.gameText = this.add.text(layout.centerX, layout.isTouchDevice ? (layout.gameHeight*0.15) : 50 + (layout.gameHeight*0.15), 'CLICK START GAME TO BEGIN', {
            fontFamily: 'Price Check',
            fontSize: 50,
            color: '#FF593F',
            align: 'center',
            scale: 0.5,
            wordWrap: { 
                width: wordWrapWidth, 
                useAdvancedWrap: true 
            }
        }).setOrigin(0.5).setAlpha(0).setScale(1).setLetterSpacing(2);
    }

    createBorder({ gameWidth, sceneWidth, sceneHeight }) {
        const debug = this.add.graphics();
        const borderX = (gameWidth - sceneWidth) / 2;
        
        debug.lineStyle(10, 0x345F5C).strokeRect(borderX, 50, sceneWidth, sceneHeight);
            
        return debug;
    }

    updateContent() {
        const content = this.storyContent[this.currentContentIndex];
        this.sound.play('bookflip', {volume: 0.5});
        const fx = this.storyImage.preFX.addWipe(0.5, 0, 0);
        
        // Fade out current content
        this.tweens.add({
            targets: [this.storyText, fx],
            alpha: 0,
            progress: 1,
            duration: 500,
            onComplete: () => {
                // Update image
                this.storyImage.setTexture(content.imageKey);
                
                // Update text
                this.storyText.setText(content.text);
                
                // Fade in new content
                this.tweens.add({
                    targets: [this.storyImage, this.storyText, fx],
                    alpha: 1,
                    progress: 0,
                    duration: 500
                });
            }
        });
    }

    createStoryImage(layout) {
        const { centerX, centerY, sceneWidth, sceneHeight, scale, isTouchDevice } = layout;
        const storyYCenter = isTouchDevice ? (centerY/2) + (50*scale) : centerY - 50 + 5;
        //The Y of Border is 50, the border width is 10
        const story = this.add.image(centerX, storyYCenter, this.storyContent[0].imageKey, 0, {
            width: sceneWidth,
            height: sceneHeight
        }).setScale(scale).setDisplaySize(sceneWidth, sceneHeight);
        if (this.sys.game.device.browser.safari || this.sys.game.device.browser.mobileSafari) {
            story.setScale(story.scaleX, story.scaleX)
        }
        
        return story;
    }

    createText(layout) {
        const { gameWidth, gameHeight, centerY, sceneHeight, sceneWidth, isTouchDevice } = layout;
        const textX = ((gameWidth - sceneWidth) / 2) - 5;
        const textY = isTouchDevice ? centerY + (sceneHeight/2) - 100 : gameHeight - 100;
        const fontSize = isTouchDevice ? 26 : 18;
        const wordWrapWidth = isTouchDevice ? gameWidth * 0.8: gameWidth * 0.4;
        
        return this.add.text(textX, textY, this.storyContent[0].text, {
            fontFamily: 'Open Sans',
            fontSize: fontSize,
            color: '#DECEB7',
            lineSpacing: fontSize/4,
            align: 'left',
            wordWrap: { 
                width: wordWrapWidth, 
                useAdvancedWrap: true 
            }
        }).setOrigin(0);
    }

    animateGameText() {
         this.tweens.add({
            targets: this.gameText,
            ease: 'Power3',
            alpha: 1,
            delay: 500,
            duration: 1000,
            onActive: () => {
                
                this.tweens.add({
                    targets:  this.gameText,
                    scale: 1.1,
                    ease: 'Power1',
                    yoyo: true,
                    loop: 100,
                    duration: 1000
                });
            }
        });
    }

    setupInput(layout) {
        this.input.addPointer(2);
        this.pointer = this.input.activePointer;

        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

        const { gameHeight, sceneWidth, isTouchDevice } = layout;
        const isSpecialDevice = isSafari || isChrome && isMacOS;

        const buttonWidth = isTouchDevice ? 86 : 43;
        const buttonY = isTouchDevice ? gameHeight - 100 : gameHeight - 90 ;
        const buttonScale = isSpecialDevice ? 1 : 
            isTouchDevice ? 0.75 : 0.5;
        const startButtonScale = isSpecialDevice ? 1 : 
            isTouchDevice ? 1 : 0.6;

        const nextX = isTouchDevice ? sceneWidth - (buttonWidth*1.25) - 5 : sceneWidth + buttonWidth - 5;
        const prevX = isTouchDevice ? (sceneWidth*0.9) - (buttonWidth*1.75): sceneWidth - (buttonWidth);
        
        const startButtonWidth = isTouchDevice ? 180 : 90;
        const startButtonX = isSpecialDevice ? sceneWidth + sceneWidth*0.05 :
            isTouchDevice ? sceneWidth + sceneWidth*0.05  : sceneWidth + startButtonWidth*1.5 + 5;
        const startButtonTween = isTouchDevice ? 1.05 : 0.65;
        
        const next = this.add.image(nextX, buttonY + 25, 'next', 0, { width: buttonWidth }).setOrigin(0, 0.5).setScale(buttonScale);
        const prev = this.add.image(prevX, buttonY + 25, 'prev', 0, { width: buttonWidth }).setScale(buttonScale);
        const muteButton = this.add.image( isTouchDevice ? 64+45 : layout.gameWidth*0.1 + 64, isTouchDevice ? gameHeight-64 : 55 + 32, 'sound').setAlpha(0.5).setScale(buttonScale);
        const startButton = this.add.image(startButtonX, buttonY + 25, 'start', 0, { width: startButtonWidth }).setOrigin(1, 0.5).setAlpha(0).setScale(startButtonScale);

        //Troubleshooting special devices
        if (isSpecialDevice) {
            next.setDisplaySize(100, 50)
            startButton.setDisplaySize(180, 64).setAlpha(1).setScale(0.6)
            startButton.width = 180;
            startButton.height = 64;
            startButton.setVisible(true);
            console.log(startButton)
        }
        console.log(isSpecialDevice)

        prev.setVisible(false);
        startButton.setVisible(false);

        next.setInteractive().setTint(0x008884)
        .on('pointerover', function () {
            next.clearTint();
        }).on('pointerout', function () {
            next.setTint(0x008884);
        }).on('pointerup', () => {
            this.currentContentIndex++;
            prev.setVisible(true);
            
            // If we've reached the end of the content, move to next scene// If we've reached the end of the content, move to next scene
            if (this.currentContentIndex >= this.storyContent.length - 1) {
                this.updateContent();
                next.setVisible(false);
                prev.setX(prevX - startButtonWidth + 10)

                startButton.setVisible(true);
                this.gameText.setVisible(true);
                this.tweens.add({
                    targets: startButton,
                    ease: 'Power3',
                    alpha: 1,
                    delay: 250,
                    duration: 1000,
                    onActive: () =>{
                        this.tweens.add({
                            targets: startButton,
                            scale: this.sys.game.device.browser.safari || this.sys.game.device.browser.mobileSafari ? 1.1 : startButtonTween,
                            ease: 'Power1',
                            yoyo: true,
                            loop: 100,
                            duration: 1000
                        });
                    }
                });
                this.animateGameText();

            } else {
                // Otherwise, update the content
                this.updateContent();
            }
        });

        prev.setInteractive().setTint(0x008884)
        .on('pointerover', function () {
            prev.clearTint();
        }).on('pointerout', function () {
            prev.setTint(0x008884);
        }).on('pointerup', () => {
            this.currentContentIndex--;
            console.log(this.currentContentIndex)
            this.gameText.setVisible(false);
            startButton.setVisible(false);
            next.setVisible(true);
            prev.setX(prevX);

            if (this.currentContentIndex === 0) {
                prev.setVisible(false);
            } else {
                prev.setVisible(true);
            }
            
            this.updateContent();
        });

        muteButton.setInteractive();
        muteButton.on('pointerup', () => {
            if (this.sound.mute) {
                muteButton.clearTint();
                this.sound.mute = false;
                console.log('hii')
                muteButton.setTexture('sound')
            } else {
                this.sound.mute = true;
                console.log('hii')
                muteButton.setTexture('mute')
                muteButton.setTint(0x008884)
            }
        })

        startButton.setInteractive()
        .on('pointerover', function () {
            next.clearTint();
        }).on('pointerout', function () {
            next.setTint(0x008884);
        }).on('pointerup', () => {
            // If we've reached the end of the content, move to next scene// If we've reached the end of the content, move to next scene
            this.cameras.main.fadeOut(1000,17, 39, 37, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start('Game');
                    this.sound.stopByKey('music1')
                }
            });
        });

        return next, prev, startButton;
    }
}