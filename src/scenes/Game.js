import { Scene } from 'phaser';
import Snake from '../components/Snake.js';
import Food from '../components/Food.js';
import { isMobile, calculateLayout } from '../components/Helpers';

var snake;
var food;
var cellSize;
var cellXMax;
var cellYMax;

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.scene.setVisible(false);
        this.events.on('create',
            () => {
                this.cameras.main.fadeIn(1000,17, 39, 37);
                this.scene.setVisible(true);
            }, this)
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        const gameHalfWidth = gameWidth / 2;

        const mobile = isMobile(this);
        const layout = calculateLayout(mobile, this);

        // Screen dimensions
        cellSize = layout.cellSize;
        cellXMax = layout.cellXMax;
        cellYMax = layout.cellYMax;

        if (!mobile) {
            this.cursors = this.input.keyboard.createCursorKeys();
        } else {
            this.buildMobileControls(layout);
        }

        this.physics.world.drawDebug = false;
        this.toggleDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.goNext = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        
        this.sound.stopByKey('music1');
        this.sound.removeByKey('music1');
        this.sound.unlock();
        var music = this.sound.add('music2', {loop: true, volume: 0.6});
        music.play();
        
        this.add.rectangle(gameHalfWidth, layout.sceneHalfY, layout.sceneWidth, layout.sceneHeight, 0xFFFFFF)
        this.grid = this.add.grid(gameHalfWidth, layout.sceneHalfY, layout.sceneWidth, layout.sceneHeight, layout.cellSize, layout.cellSize, 0xE5E5DA, 1, 0xD8D8CA, 1).setAltFillStyle(0xD8D8CA).setOutlineStyle();
        food = new Food(this, 2, 4, layout);
        snake = new Snake(this, 8, 8);
        // Add debug logging
        // console.log('Food physics body:', food.body);
        // console.log('Snake head physics body:', snake.head.body);
        this.physics.add.overlap( snake.head, food, (head, food) => this.handleFoodCollision(head, food, layout), null, this );
        this.createBorder(layout);

        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const isSpecialDevice = isSafari || isChrome && isMacOS;

        const buttonScale = isSpecialDevice && mobile ? 1.5 :
            isSpecialDevice ? 1 : 
            mobile ? 0.75 : 0.5;

        const muteButton = this.add.image( isSpecialDevice ? layout.gameWidth*0.1 + 64 : mobile ? 64+45 : layout.gameWidth*0.1 + 64, mobile ? gameHeight-64 : 55 + 32, 'sound');
        muteButton.setInteractive().setScale(buttonScale).setAlpha(0.5);
        muteButton.on('pointerup', () => {
            if (this.sound.mute) {
                this.sound.mute = false;
                muteButton.setTexture('sound')
                muteButton.clearTint();
            } else {
                this.sound.mute = true;
                muteButton.setTexture('mute')
                muteButton.setTint(0x008884)
            }
        })
        
        const textX = ((gameWidth - layout.sceneWidth) / 2) - 5;
        const textY = mobile ? layout.centerY + (layout.sceneHeight/2) - 100 : gameHeight - 100;
        const fontSize = mobile ? 26 : 20;
        const helperText = mobile ? '' : 'Use the arrow keys to move and eat as much food as you can!';
        const wordWrapWidth = mobile ? gameWidth * 0.9: gameWidth * 0.4;
        this.add.text(textX, textY, helperText, {
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

        this.scoreText = this.add.text(layout.sceneWidth, textY - 100, 'SCORE: ' + food.total, {
            fontFamily: 'Price Check',
            fontSize: mobile ? 36 : 30,
            color: '#008884',
            align: 'RIGHT'
        }).setOrigin(mobile ? 1 : 0).setLetterSpacing(1);
        
    }

    createBorder({ gameWidth, sceneWidth, sceneHeight, }) {
        const graphics = this.add.graphics();
        const borderX = (gameWidth - sceneWidth) / 2;
      
        graphics.lineStyle(10, 0x345F5C)
        .strokeRect(borderX, 50, sceneWidth, sceneHeight);
            
        return graphics;
    }

    // Add new collision handler method
    handleFoodCollision(snakeHead, food, layout) {
        if (snake.speed > 20 && food.total % 5 === 0) {
            snake.speed -= layout.isTouchDevice ? 10 : 5;
            console.log(`snake speed is: ${snake.speed}`)
        }
        snake.grow();
        food.eat();
        food.change();
        this.repositionFood(layout);
        this.sound.play('gong2', {volume: 0.5})
    }

    update (time, delta) {
        this.scoreText.setText('SCORE: ' + food.total);

        if (Phaser.Input.Keyboard.JustDown(this.toggleDebug)) {
            if (this.physics.world.drawDebug) {
              this.physics.world.drawDebug = false;
              this.physics.world.debugGraphic.clear();
            } else {
              this.physics.world.drawDebug = true;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.goNext)) {
            this.sound.play('crash', {loop: false, volume: 0.5})
            this.scene.start('GameOver');
        }

          snake.update(time)

          if (!snake.alive) { 
              this.sound.play('crash', {loop: false})
              this.scene.start('GameOver');
            return;
          }
      
          if (this.cursors.left.isDown) {
              snake.faceLeft();
          }
          else if (this.cursors.right.isDown) {
              snake.faceRight();
          }
          else if (this.cursors.up.isDown) {
              snake.faceUp();
          }
          else if (this.cursors.down.isDown) {
              snake.faceDown();
          }

    }

    buildMobileControls (layout) {

        const { gameHeight, centerX, sceneHeight } = layout;

        this.input.addPointer(2);
        this.input.topOnly = true;

        this.cursors = {
            'up': {},
            'left': {},
            'right': {},
            'down': {},
        }

        const pointerDown = key => {
            // modifies this.cursors with the property that we check in update() method
            this.cursors[key].isDown = true
        }
        const pointerUp = key => {
            this.cursors[key].isDown = false
        }

        // button sizing
        const WIDTH = 172*0.75
        const HEIGHT = 172*0.75
        const GUTTER = 50
        
        // Create a button helper
        const createBtn = (key, x, y) => {
            this.add.image(x, y, key)
                .setOrigin(0,0)
                .setScrollFactor(0)
                .setInteractive()
                .setScale(0.75)
                .on('pointerdown', () => pointerDown(key))
                .on('pointerup', () => pointerUp(key))
            //key is same for button direction and calling image texture
        }
        
        // Y coordinate to place buttons
        const UP_Y = sceneHeight + HEIGHT/2 + GUTTER;
        const DOWN_Y = gameHeight - HEIGHT + 5;
        const BTN_Y = (UP_Y + DOWN_Y)/2;

        // create player control buttons
        createBtn('left', centerX - WIDTH*1.5 + (GUTTER/2), BTN_Y)
        createBtn('right', centerX + (WIDTH/2) - (GUTTER/2), BTN_Y)
        createBtn('up', centerX - WIDTH/2, UP_Y)
        createBtn('down', centerX - WIDTH/2, DOWN_Y)
    }

    /**
    * We can place the food anywhere in our 40x30 grid
    * *except* on-top of the snake, so we need
    * to filter those out of the possible food locations.
    * If there aren't any locations left, they've won!
    *
    * @method repositionFood
    * @return {boolean} true if the food was placed, otherwise false
    */
    repositionFood (layout) {
        //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];

    for (var y = 0; y < cellYMax; y++) {
        testGrid[y] = [];
        for (var x = 0; x < cellXMax; x++) {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < cellYMax; y++) {
        for (var x = 0; x < cellXMax; x++) {
            if (testGrid[y][x] === true) {
                //  Is this position valid for food? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }
    if (validLocations.length > 0) {
        var pos = Phaser.Math.RND.pick(validLocations);
        
        // Add the adjustments to match Food class positioning
        food.setPosition(
            (pos.x * cellSize) + ((layout.gameWidth - layout.sceneWidth) / 2), 
            (pos.y * cellSize) + layout.yPos
        );
        return true;
    } else {
        return false;
    }
    }
}
