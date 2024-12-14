import { Scene } from 'phaser';
import Snake from '../components/Snake.js';
import Food from '../components/Food.js';

var snake;
var food;
var joystick;

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.grid(1024/2, 768/2, 1024, 768, 32, 32, 0xffffff, .25, 0xffffff, 1).setAltFillStyle(0xe2f7c1).setOutlineStyle();
        
        //  Create our keyboard controls
        if (!this.sys.game.device.input.touch) {
            this.cursors = this.input.keyboard.createCursorKeys()
        } else {
            this.buildMobileControls()
        }

        this.physics.world.drawDebug = false;
        this.toggleDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        // this.pointer = this.input.pointer1;
       
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
      
          /**
          * Check which key is pressed, and then change the direction the snake
          * is heading based on that. The checks ensure you don't double-back
          * on yourself, for example if you're moving to the right and you press
          * the LEFT cursor, it ignores it, because the only valid directions you
          * can move in at that time is up and down.
          */
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

        // var joyStick = this.plugins.get('rexvirtualjoystickplugin').addPlayer(this, config);
        joystick = this.plugins.get('rexVirtualJoystick').add(this, {
            x: 1024 - 100,
            y: 768 - 100,
            radius: 100,
            dir: '4dir',
            base: this.add.circle(0, 0, 100, 0x888888),
            thumb: this.add.circle(0, 0, 50, 0xcccccc),
            enable: true
            // forceMin: 16,
            // fixed: true,
        })
        
        this.cursors = joystick.createCursorKeys();
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

    for (var y = 0; y < 24; y++)
        //update y < 40 condition to be the length of game area and how many times a segment of 16 can fit
    {
        testGrid[y] = [];

        for (var x = 0; x < 32; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    //  Purge out false positions
    // x & y is based on the base size 32, and how many times it can fit within the game area
    var validLocations = [];

    for (var y = 0; y < 24; y++)
    {
        for (var x = 0; x < 32; x++)
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
        food.setPosition(pos.x * 32, pos.y * 32);

        return true;
    }
    else
    {
        return false;
    }
    }
}
