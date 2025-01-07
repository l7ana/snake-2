import { Game, Scene } from 'phaser';

export class Intro1 extends Scene {
    constructor() {
        super('Intro1');
        // Add content arrays to store multiple images and texts
        this.storyContent = [
            {
                imageKey: 'one',
                text: 'Once upon one time, in one crack seed stoa, '
            },
            {
                imageKey: 'two', // Make sure this image is loaded in your preload
                text: 'Your second story text goes here...'
            },
            // Add more content objects as needed
        ];
        this.currentContentIndex = 0;
    }

    create() {
        this.isMobile();

        // Screen dimensions
        const layout = this.calculateLayout();
        console.log(layout.sceneWidth, layout.sceneHeight)
        
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

        // const testImage = this.add.image(layout.centerX, layout.centerY - 50, this.storyContent[0].imageKey, 0, {
        //     width: layout.sceneWidth,
        //     height: layout.sceneHeight
        // })
        // console.log(testImage)
        
        // Setup input
        this.setupInput(layout);
    }

    isMobile() {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const deviceWidthSmall = screen.availHeight > screen.availWidth || window.innerHeight > window.innerWidth;
        const isTouchDevice = this.sys.game.device.input.touch;
    
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
            sceneWidth: isTouchDevice ? gameWidth * 0.9 : gameWidth * 0.75,
            sceneHeight: isTouchDevice ? gameWidth * 0.9 : gameHeight * 0.75,
            isTouchDevice,
            scale: 1,
            fontSize: this.isMobile() ? 36 : 20
        };
    }

    createBorder({ gameWidth, sceneWidth, sceneHeight }) {
        const debug = this.add.graphics();
        const borderX = (gameWidth - sceneWidth) / 2;
        
        debug.lineStyle(10, 0x457E7B)
            .strokeRect(borderX, 50, sceneWidth, sceneHeight);
            
        return debug;
    }

    updateContent() {
        const content = this.storyContent[this.currentContentIndex];
        
        // Fade out current content
        this.tweens.add({
            targets: [this.storyImage, this.storyText],
            alpha: 0,
            duration: 500,
            onComplete: () => {
                // Update image
                this.storyImage.setTexture(content.imageKey);
                
                // Update text
                this.storyText.setText(content.text);
                
                // Fade in new content
                this.tweens.add({
                    targets: [this.storyImage, this.storyText],
                    alpha: 1,
                    duration: 500
                });
            }
        });
    }

    createStoryImage(layout) {
        const { centerX, centerY, sceneWidth, sceneHeight, isTouchDevice } = layout;
        
        const story = this.add.image(centerX, centerY - 50, this.storyContent[0].imageKey, 0, {
            width: sceneWidth,
            height: sceneHeight
        });

        // Calculate crop values based on device type
        const cropConfig = isTouchDevice ? {
            x: 5,
            y: 0,
            // x: (sceneWidth / 2) + (layout.gameWidth * 0.25) + 47.5,
            // y: (sceneHeight / 2) - 5,
            width: sceneWidth,
            height: sceneHeight
        } : {
            // x: (sceneWidth / 2) - 15,
            // y: (sceneHeight * 1.25) + 5,
            x: 0,
            y: 0,
            width: sceneWidth * 2,
            height: sceneHeight * 2
        };
        
        story.setScale(layout.scale)
            .setCrop(
                cropConfig.x,
                cropConfig.y,
                cropConfig.width,
                cropConfig.height
            );
        console.log(story)
        return story;
    }

    createText(layout) {
        const { gameWidth, gameHeight, centerY, sceneHeight, sceneWidth, isTouchDevice, fontSize } = layout;
        const textX = ((gameWidth - sceneWidth) / 2) - 5;
        const textY = isTouchDevice ? centerY + (sceneHeight/2) - 100 : gameHeight - 75;
        
        if (isTouchDevice) {
            return this.make.text({
                x: textX,
                y: textY,
                text: this.storyContent[0].text,
                origin: 0,
                style: {
                    fontFamily: 'Open Sans',
                    fontSize: fontSize,
                    color: '#DECEB7',
                    wordWrap: { 
                        width: gameWidth * 0.75, 
                        useAdvancedWrap: true 
                    }
                }
            });
        } else {
            return this.add.text(textX, textY, this.storyContent[0].text, {
                fontFamily: 'Open Sans',
                fontSize: fontSize,
                color: '#DECEB7',
                align: 'left'
            }).setOrigin(0);
        }
    }

    setupInput(layout) {
        this.input.addPointer(2);
        this.pointer = this.input.activePointer;

        const { gameHeight, sceneWidth, isTouchDevice, fontSize } = layout;
        const buttonWidth = isTouchDevice ? 86 : 43;
        const buttonY = isTouchDevice ? gameHeight - 150 : gameHeight - 75;
        const nextX = isTouchDevice ? sceneWidth - (buttonWidth*0.45) : sceneWidth + (buttonWidth*2);
        const next = this.add.image(nextX, buttonY + 25, 'next', 0, {
            width: buttonWidth
        });
        next.setInteractive().setTint(0x128884);

        next.on('pointerover', function () {
            next.clearTint();
        })
        next.on('pointerout', function () {
            next.setTint(0x128884);
        })
        
        next.on('pointerup', () => {
            this.currentContentIndex++;
            
            // If we've reached the end of the content, move to next scene
            if (this.currentContentIndex >= this.storyContent.length) {
                this.scene.start('Intro2');
                this.scene.transition({
                    target: 'Intro2',
                    ease: 'linear',
                    duration: 1000,
                    moveAbove: true,
                });
            } else {
                // Otherwise, update the content
                this.updateContent();
            }
        });
        
        if (isTouchDevice) {
            return next.setScale(0.75);
        } else {
            return next.setScale(0.5);
        }
    }
}