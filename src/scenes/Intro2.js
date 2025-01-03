import { Game, Scene } from 'phaser';

export class Intro2 extends Scene {
    constructor() {
        super('Intro2');
    }

    create() {
        this.isMobile();

        // Screen dimensions
        const layout = this.calculateLayout();
        
        // Create border
        this.createBorder(layout);

        // Create and position story image
        const image = this.createStoryImage(layout).setAlpha(0);
        
        // Add text
        const words = this.createText(layout).setAlpha(0);
        
        this.events.on('transitionstart', function (fromScene, duration)
        {
          this.tweens.add({
            targets: [ words, image ],
            ease: 'linear',
            alpha: 1,
            duration: duration
        });

        }, this);
        
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
            scale: 0.5,
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

    createStoryImage(layout) {
        const { centerX, centerY, sceneWidth, sceneHeight, isTouchDevice } = layout;
        
        const story = this.add.image(centerX, centerY - 50, 'two', 0, {
            width: sceneWidth,
            height: sceneHeight
        });

        // Calculate crop values based on device type
        const cropConfig = isTouchDevice ? {
            x: (sceneWidth / 2) + (layout.gameWidth * 0.25) + 47.5,
            // x: (sceneWidth / 2) + (layout.gameWidth * 0.25) + 47.5,
            y: (sceneHeight / 2) - 5,
            width: sceneWidth * 2,
            height: sceneHeight * 2
        } : {
            x: (sceneWidth / 2) - 15,
            y: (sceneHeight * 1.25) + 5,
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
        return story;
    }

    createText(layout) {
        const { gameWidth, gameHeight, centerY, sceneHeight, sceneWidth, isTouchDevice, fontSize } = layout;
        const textX = ((gameWidth - sceneWidth) / 2) - 5;
        const textY = isTouchDevice ? centerY + (sceneHeight/2) - 100 : gameHeight - 75;
        const text = 'Had small kine magic in da li hing mui, cuz one night, next ting you know ';
        
        if (isTouchDevice) {
            return this.make.text({
                x: textX,
                y: textY,
                text: text,
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
            return this.add.text(textX, textY, text, {
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
        const prevX = isTouchDevice ? (sceneWidth*0.9) - (buttonWidth*1.75): sceneWidth - (buttonWidth);
        const prev = this.add.image(prevX, buttonY + 25, 'prev', 0, {
            width: buttonWidth
        });
        const next = this.add.image(nextX, buttonY + 25, 'next', 0, {
            width: buttonWidth
        });
        prev.setInteractive().setTint(0x128884),
        next.setInteractive().setTint(0x128884);

        prev.on('pointerover', function () {
            prev.clearTint();
        })
        next.on('pointerover', function () {
            next.clearTint();
        })
        prev.on('pointerout', function () {
            prev.setTint(0x128884);
        })
        next.on('pointerout', function () {
            next.setTint(0x128884);
        })

        prev.once('pointerup', () => {
          this.scene.transition({
              target: 'Intro1',
              ease: 'linear',
              duration: 1000,
              moveAbove: true,
          })
        });
        
        next.once('pointerup', () => {
            this.scene.start('Game');
        });
        
        if (isTouchDevice) {
            return prev.setScale(0.75), next.setScale(0.75);
        } else {
            return prev.setScale(0.5), next.setScale(0.5);
        }
    }
}