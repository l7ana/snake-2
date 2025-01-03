// import { Game, Scene } from 'phaser';

// export class Panel extends Scene {
//     constructor(words, image) {
//         super('Panel');
//     }

//     create() {
//         this.isMobile();

//         // Screen dimensions
//         const layout = this.calculateLayout();
        
//         // Create border
//         this.createBorder(layout);
        
//         // Create and position story image
//         this.createStoryImage(layout);
        
//         // Add text
//         this.createText(layout);
        
//         // Setup input
//         this.setupInput(layout);
//     }

//     isMobile() {
//         const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
//         const deviceWidthSmall = screen.availHeight > screen.availWidth || window.innerHeight > window.innerWidth;
//         const isTouchDevice = this.sys.game.device.input.touch;
    
//         return regex.test(navigator.userAgent) || deviceWidthSmall ? true : false;
//     }

//     calculateLayout() {
      
//         if (this.isMobile()) {
//             console.log("Mobile device detected");
//             console.log("Aspect ratio of story image needs to be square.")
//         } else {
//             console.log("Desktop device detected");
//         }

//         const gameWidth = this.cameras.main.width;
//         const gameHeight = this.cameras.main.height;
//         const isTouchDevice = this.isMobile();
        
//         return {
//             gameWidth,
//             gameHeight,
//             centerX: gameWidth / 2,
//             centerY: gameHeight / 2,
//             sceneWidth: isTouchDevice ? gameWidth * 0.9 : gameWidth * 0.75,
//             sceneHeight: isTouchDevice ? gameWidth * 0.9 : gameHeight * 0.75,
//             isTouchDevice,
//             scale: 0.5,
//             fontSize: this.isMobile() ? 36 : 20
//         };
//     }

//     createBorder({ gameWidth, sceneWidth, sceneHeight }) {
//         const debug = this.add.graphics();
//         const borderX = (gameWidth - sceneWidth) / 2;
        
//         debug.lineStyle(10, 0x457E7B)
//             .strokeRect(borderX, 50, sceneWidth, sceneHeight);
            
//         return debug;
//     }

//     createStoryImage(layout) {
//         const { centerX, centerY, sceneWidth, sceneHeight, isTouchDevice } = layout;
        
//         const story = this.add.image(centerX, centerY - 50, 'one', 0, {
//             width: sceneWidth,
//             height: sceneHeight
//         });

//         // Calculate crop values based on device type
//         const cropConfig = isTouchDevice ? {
//             x: (sceneWidth / 2) + (layout.gameWidth * 0.25) + 47.5,
//             // x: (sceneWidth / 2) + (layout.gameWidth * 0.25) + 47.5,
//             y: (sceneHeight / 2) - 5,
//             width: sceneWidth * 2,
//             height: sceneHeight * 2
//         } : {
//             x: (sceneWidth / 2) - 15,
//             y: (sceneHeight * 1.25) + 5,
//             width: sceneWidth * 2,
//             height: sceneHeight * 2
//         };
        
//         story.setScale(layout.scale)
//             .setCrop(
//                 cropConfig.x,
//                 cropConfig.y,
//                 cropConfig.width,
//                 cropConfig.height
//             );
//         return story;
//     }

//     createText(layout) {
//         const { gameWidth, gameHeight, centerY, sceneHeight, sceneWidth, isTouchDevice, fontSize } = layout;
//         const textX = ((gameWidth - sceneWidth) / 2) - 5;
//         const textY = isTouchDevice ? centerY + (sceneHeight/2) - 100 : gameHeight - 75;
//         const text = 'Once upon one time, in one crack seed stoa, ';
        
//         if (isTouchDevice) {
//             return this.make.text({
//                 x: textX,
//                 y: textY,
//                 text: text,
//                 origin: 0,
//                 style: {
//                     fontFamily: 'Open Sans',
//                     fontSize: fontSize,
//                     color: '#DECEB7',
//                     wordWrap: { 
//                         width: gameWidth * 0.75, 
//                         useAdvancedWrap: true 
//                     }
//                 }
//             });
//         } else {
//             return this.add.text(textX, textY, text, {
//                 fontFamily: 'Open Sans',
//                 fontSize: fontSize,
//                 color: '#DECEB7',
//                 align: 'left'
//             }).setOrigin(0);
//         }
//     }

//     setupInput(layout) {
//         this.input.addPointer(2);
//         this.pointer = this.input.activePointer;

//         const { gameHeight, sceneWidth, isTouchDevice, fontSize } = layout;
//         const buttonWidth = isTouchDevice ? 86 : 43;
//         const buttonY = isTouchDevice ? gameHeight - 150 : gameHeight - 75;
//         const nextX = isTouchDevice ? sceneWidth - (buttonWidth*0.45) : sceneWidth + (buttonWidth*2);
//         const next = this.add.image(nextX, buttonY + 25, 'next', 0, {
//             width: buttonWidth
//         });
//         next.setInteractive().setTint(0x128884);

//         next.on('pointerover', function () {
//             next.clearTint();
//         })
//         next.on('pointerout', function () {
//             next.setTint(0x128884);
//         })

//         // prev.once('pointerdown', () => {
//         //     this.scene.start('Game');
//         // });
        
//         next.once('pointerdown', () => {
//             this.scene.start('Intro2');
//             this.scene.transition({
//                 target: 'Intro2',
//                 duration: 1500,
//                 moveAbove: true,
//             })
//         });
        
//         if (isTouchDevice) {
//             return next.setScale(0.75);
//         } else {
//             return next.setScale(0.5);
//         }
//     }
// }