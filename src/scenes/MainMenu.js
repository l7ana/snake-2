import { Game, Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.isMobile();

        // Screen dimensions
        const layout = this.calculateLayout();
        
        // Create border
        this.createBorder(layout);
        
        // Create and position story image
        this.createStoryImage(layout);
        
        // Add text
        this.createText(layout);
        
        // Setup input
        this.setupInput();
    }

    isMobile() {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const deviceWidthSmall = this.cameras.main.width <= 1024;
        const isTouchDevice = this.sys.game.device.input.touch;
    
        return regex.test(navigator.userAgent) || deviceWidthSmall || isTouchDevice ? true : false;
    }

    calculateLayout() {
      
        if (this.isMobile()) {
            console.log("Mobile device detected");
        } else {
            console.log("Desktop device detected");
        }

        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        const isTouchDevice = this.isMobile();
        const isMidWidth = this.cameras.main.width >= 600 && this.cameras.main.width <= 768;
        
        return {
            gameWidth,
            gameHeight,
            centerX: gameWidth / 2,
            centerY: gameHeight / 2,
            sceneWidth: isMidWidth ? gameWidth * 0.9 : gameWidth * 0.75,
            sceneHeight: gameHeight * 0.75,
            isTouchDevice,
            isMidWidth,
            scale: this.isMobile() ? 0.5 : 0.5,
            fontSize: this.isMobile() ? 40 : 20
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
        const { centerX, centerY, sceneWidth, sceneHeight, isTouchDevice, isMidWidth } = layout;
        
        const story = this.add.image(centerX, centerY - 50, 'one', 0, {
            width: sceneWidth,
            height: sceneHeight
        });

        console.log(layout.gameWidth, sceneWidth, ((layout.gameWidth - sceneWidth)), (layout.gameWidth - sceneWidth) + ((layout.gameWidth - sceneWidth) / 2))
        
        // Calculate crop values based on device type
        const cropConfig = isTouchDevice && isMidWidth ? {
            // x: (sceneWidth + (layout.gameWidth - sceneWidth) / 2 + 30),
            x: (sceneWidth / 2) + (layout.gameWidth * 0.3) + 12,
            y: (sceneHeight / 2) - 100,
            width: sceneWidth * 2,
            height: sceneHeight * 2
        } : {
            x: ((layout.gameWidth - sceneWidth) * 1.5 - 15),
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
        const { gameWidth, gameHeight, sceneWidth, isTouchDevice, fontSize } = layout;
        const textX = ((gameWidth - sceneWidth) / 2) - 5;
        const textY = isTouchDevice ? gameHeight - 150 : gameHeight - 75;
        const text = 'Once upon one time, in one crack seed stoa, ';
        
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
                        width: gameWidth / 2, 
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

    setupInput() {
        this.input.addPointer(2);
        this.pointer = this.input.activePointer;
        
        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}