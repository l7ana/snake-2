import { Scene } from 'phaser';
import Snake from '../components/Snake.js';
import Food from '../components/Food.js';

var snake;
var food;
var cellSize;
var cellYMax;
var cellXMax;

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        if (!this.sys.game.device.input.touch) {
            this.cursors = this.input.keyboard.createCursorKeys()
            //grid cell is 32 x 32 on desktop
            cellSize = 32;
            cellXMax = 32;
            cellYMax = 24;
        } else {
            this.buildMobileControls()
            //grid cell is 64 x 64 on mobile
            cellSize = 64;
            cellXMax = 16;
            cellYMax = 12;
        }
        
        this.add.grid(1024/2, 768/2, 1024, 768, cellSize, cellSize, 0xffffff, .25, 0xffffff, 1).setAltFillStyle(0xe2f7c1).setOutlineStyle();

        this.physics.world.drawDebug = false;
        this.toggleDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        // this.pointer = this.input.pointer1;
       
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
        const WIDTH = 64
        const HEIGHT = 64
        const GAME_HEIGHT = 768
        const GAME_WIDTH = 1024

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
        const BTN_Y = GAME_HEIGHT - HEIGHT - GUTTER

        // create player control buttons
        createBtn('left', GAME_WIDTH - 3*(WIDTH + GUTTER), BTN_Y - (HEIGHT / 1.5))
        createBtn('right', GAME_WIDTH - WIDTH - GUTTER, BTN_Y - (HEIGHT / 1.5))
        createBtn('up', GAME_WIDTH - 2*(WIDTH + GUTTER), BTN_Y - HEIGHT - GUTTER)
        createBtn('down', GAME_WIDTH - 2*(WIDTH + GUTTER), BTN_Y)
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

    for (var y = 0; y < cellYMax - 1; y++)
        //update y < 40 condition to be the length of game area and how many times a segment of 16 can fit
    {
        testGrid[y] = [];

        for (var x = 0; x < cellXMax - 1; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    //  Purge out false positions
    // x & y is based on the base size 32, and how many times it can fit within the game area
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
