import { Scene } from 'phaser';
import Snake from '../components/Snake.js';
import Food from '../components/Food.js';

var snake;
var food;
var cursors;

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);
        // this.add.grid(1024/2, 768/2, 1024, 768, 32, 32, 0xffffff, .25, 0xffffff, 1);
        
        //  Create our keyboard controls
        cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.drawDebug = false;
        this.toggleDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
       
          food = new Food(this, 3, 4);
          snake = new Snake(this, 8, 8);
    
    }
    

    update (time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.toggleDebug)) {
            if (this.physics.world.drawDebug) {
              this.physics.world.drawDebug = false;
              this.physics.world.debugGraphic.clear();
              console.log(snake.head.x, snake.head.y)
              console.log(food)
            //   console.log(this.physics)
            }
            else {
              this.physics.world.drawDebug = true;
            }
          }

          if (!snake.alive)
          {
            return;
          }
      
          /**
          * Check which key is pressed, and then change the direction the snake
          * is heading based on that. The checks ensure you don't double-back
          * on yourself, for example if you're moving to the right and you press
          * the LEFT cursor, it ignores it, because the only valid directions you
          * can move in at that time is up and down.
          */
          if (cursors.left.isDown)
          {
              snake.faceLeft();
          }
          else if (cursors.right.isDown)
          {
              snake.faceRight();
          }
          else if (cursors.up.isDown)
          {
              snake.faceUp();
          }
          else if (cursors.down.isDown)
          {
              snake.faceDown();
          }

          if (snake.update(time))
          {
              //  If the snake updated, we need to check for collision against food
      
              if (snake.collideWithFood(food))
              {
                  this.repositionFood();
              }
          }
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

    for (var y = 0; y < 30; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < 40; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 30; y++)
    {
        for (var x = 0; x < 40; x++)
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
        food.setPosition(pos.x * 16, pos.y * 16);

        return true;
    }
    else
    {
        return false;
    }
    }
}
