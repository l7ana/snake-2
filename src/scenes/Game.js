import { Scene } from 'phaser';
import Snake from '../components/Snake.js';
import Food from '../components/Food.js';

var snake;
var food;
var cellSize;
var cellYMax;
var cellXMax;

var gameWidth;
var gameHeight;
var gameHalfWidth;
var gameHalfHeight;

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        gameWidth = this.cameras.main.width;
        gameHeight = this.cameras.main.height;
        gameHalfWidth = gameWidth / 2;
        gameHalfHeight = gameHeight / 2;
        
        if (!this.sys.game.device.input.touch) {
            this.cursors = this.input.keyboard.createCursorKeys()
            cellSize = 32;
            cellXMax = 32;
            cellYMax = 24;
            this.add.grid(gameHalfWidth, gameHalfHeight, gameWidth, gameHeight, cellSize, cellSize, 0xffffff, .25, 0xffffff, 1).setAltFillStyle(0xe2f7c1).setOutlineStyle();
        } else {
            cellSize = 64;
            cellXMax = 16;
            cellYMax = 12;
            this.add.grid(gameHalfWidth, gameHalfHeight, gameWidth, gameHeight, cellSize, cellSize, 0xffffff, .25, 0xffffff, 1).setAltFillStyle(0xe2f7c1).setOutlineStyle();
            this.buildMobileControls()
        }
        
        this.physics.world.drawDebug = false;
        this.toggleDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
          food = new Food(this, 3, 4);
          snake = new Snake(this, 8, 8, cellSize);
    
    }
    

    update (time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.toggleDebug)) {
            if (this.physics.world.drawDebug) {
              this.physics.world.drawDebug = false;
              this.physics.world.debugGraphic.clear();
              console.log(snake)
              console.log(food)
              console.log(snake.body)
            }
            else {
              this.physics.world.drawDebug = true;
            }
          }

          if (!snake.alive)
          { 
            this.scene.start('GameOver');
            return;
          }
      
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
      
              if (snake.collideWithFood(food))
              {
                  this.repositionFood();
                  food.change();
              }
          }
    }

    buildMobileControls () {
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
        const WIDTH = 100
        const HEIGHT = 100

        // gutter width between buttons
        const GUTTER = 12
        
        // Create a button helper
        const createBtn = (key, x, y) => {
            this.add.image(x, y, key)
                .setOrigin(0,0)
                .setScrollFactor(0)
                .setInteractive()
                .on('pointerdown', () => pointerDown(key))
                .on('pointerup', () => pointerUp(key))
            //key is same for button direction and calling image texture
        }
        
        // Y coordinate to place buttons
        const BTN_Y = gameHeight - HEIGHT - GUTTER

        // create player control buttons
        createBtn('left', gameWidth - 3*(WIDTH + GUTTER), BTN_Y - (HEIGHT / 1.5))
        createBtn('right', gameWidth - WIDTH - GUTTER, BTN_Y - (HEIGHT / 1.5))
        createBtn('up', gameWidth - 2*(WIDTH + GUTTER), BTN_Y - HEIGHT - GUTTER)
        createBtn('down', gameWidth - 2*(WIDTH + GUTTER), BTN_Y)
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
        //  Use the RNG to pick a random food position
        var pos = Phaser.Math.RND.pick(validLocations);

        //  And place it
        food.setPosition(pos.x * cellSize, pos.y * cellSize);
        return true;
    }
    else
    {
        return false;
    }
    }
}
