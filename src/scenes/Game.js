import { Scene } from 'phaser';
import Snake from '../components/Snake.js';
import Food from '../components/Food.js';

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
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        const gameHalfWidth = gameWidth / 2;
        const gameHalfHeight = gameHeight / 2;
        const isTouchDevice = this.isMobile();

        // Screen dimensions
        const layout = this.calculateLayout();

        if (!isTouchDevice) {
            this.cursors = this.input.keyboard.createCursorKeys();
        } else {
            this.buildMobileControls(layout);
        }
        // console.log(layout.sceneWidth,layout.sceneHeight)
        // console.log(layout.cellSize)
        // console.log(layout.sceneWidth / layout.cellSize)
        // console.log(layout.sceneHeight / layout.cellSize)

        this.add.grid(gameHalfWidth, layout.sceneHalfY, layout.sceneWidth, layout.sceneHeight, layout.cellSize, layout.cellSize, 0xE0DDCE, 1, 0xAFAC98, 0.5).setAltFillStyle(0xAFAC98).setOutlineStyle();
        
        this.physics.world.drawDebug = false;
        this.toggleDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        // this.goNext = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        food = new Food(this, 2, 4, layout);
        snake = new Snake(this, 8, 8, layout);


        // Add debug logging
        // console.log('Food physics body:', food.body);
        // console.log('Snake head physics body:', snake.head.body);

        // this.collider = new Collider(this.physics.world, !overlapOnly, food, snake, food.eat(), this.repositionFood(), )
        // this.physics.add.overlap(snake.head, food, this.handleFoodCollision, null, this)
        this.physics.add.overlap( snake.head, food, (head, food) => this.handleFoodCollision(head, food), null, this );

        // snake = new Snake1(this.physics.world, this, layout);
        this.createBorder(layout);
    }

    isMobile() {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const deviceWidthSmall = screen.availHeight > screen.availWidth || window.innerHeight > window.innerWidth;
        const isTouchDevice = this.sys.game.device.input.touch;
    
        return isTouchDevice && regex.test(navigator.userAgent) || deviceWidthSmall ? true : false;
    }

    calculateLayout() {
        const isTouchDevice = this.isMobile();
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        const sceneWidth = isTouchDevice ? gameWidth * 0.9 : gameWidth * 0.75;
        const sceneHeight = isTouchDevice ? gameWidth * 0.9 : gameHeight * 0.75;
        
        return {
            gameWidth,
            gameHeight,
            centerX: gameWidth / 2,
            centerY: gameHeight / 2,
            sceneWidth: isTouchDevice ? gameWidth * 0.9 : gameWidth * 0.75,
            sceneHeight: isTouchDevice ? gameWidth * 0.9 : gameHeight * 0.75,
            sceneHalfY: (sceneHeight / 2) + 50,
            yPos: 50,
            isTouchDevice,
            cellSize: isTouchDevice ? sceneWidth / 10 : sceneWidth / 21,
            cellXMax: isTouchDevice ? 9 : 20,
            cellYMax: isTouchDevice ? 9: 14,
            scale: 1,
            fontSize: this.isMobile() ? 36 : 20
        };
    }

    createBorder({ gameWidth, gameHalfWidth, gameHalfHeight, sceneWidth, sceneHeight, cellSize }) {
        const graphics = this.add.graphics();
        const borderX = (gameWidth - sceneWidth) / 2;
        //Consolidate createBorder function here so that the grid and rectangle can both be added to graphics, borrowing the same properties from layout.
        
        graphics.lineStyle(10, 0x457E7B)
        .strokeRect(borderX, 50, sceneWidth, sceneHeight);
            
        return graphics;
    }

    // Add new collision handler method
    handleFoodCollision(snakeHead, food) {
        snake.grow();
        food.eat();
        food.change();
        this.repositionFood();
    }

    update (time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.toggleDebug)) {
            if (this.physics.world.drawDebug) {
              this.physics.world.drawDebug = false;
              this.physics.world.debugGraphic.clear();
              console.log(snake.head.x, snake.head.y)
              console.log(food.x, food.y)
              console.log(food)
            }
            else {
              this.physics.world.drawDebug = true;
            }
          }

        //   if (!snake.alive)
        //   { 
        //     this.scene.start('GameOver');
        //     return;
        //   }
      
          if (this.cursors.left.isDown)
          {
              snake.faceLeft();
          }
          else if (this.cursors.right.isDown)
          {
              snake.faceRight();
          }
          else if (this.cursors.up.isDown)
          {
              snake.faceUp();
          }
          else if (this.cursors.down.isDown)
          {
              snake.faceDown();
          }

          if (snake.update(time))
          {
              //  If the snake updated, we need to check for collision against food
              
          }

        //   if (Phaser.Input.Keyboard.JustDown(this.goNext)) {
        //     this.scene.start('GameOver');
        //     return;
        //   }
    }

    buildMobileControls (layout) {

        const { gameHeight, gameWidth, centerX, centerY, sceneWidth, sceneHeight, isTouchDevice } = layout;

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
    repositionFood () {
        //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];

    for (var y = 0; y < cellYMax; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < cellXMax; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < cellYMax; y++)
    {
        for (var x = 0; x < cellXMax; x++)
        {
            if (testGrid[y][x] === true)
            {
                //  Is this position valid for food? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }
    if (validLocations.length > 0)
        {
            var pos = Phaser.Math.RND.pick(validLocations);
    
            // Multiply by cellSize to get pixel position and add half cellSize to center
            food.setPosition(
                pos.x * cellSize, 
                pos.y * cellSize
            );
            return true;
        }
        else
        {
            return false;
        }
    }
}
