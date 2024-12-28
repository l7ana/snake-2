//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var Snake = new Phaser.Class({

  initialize:

  function Snake (scene, x, y)
  {
      this.headPosition = new Phaser.Geom.Point(x, y);
      
      if (!scene.sys.game.device.input.touch) {
          this.cellSize = 32;
          this.cellXMax = 40;
          this.cellYMax = 25;
      } else {
        this.cellSize = 64;
        this.cellXMax = 19;
        this.cellYMax = 13;
      }
      
      this.body = scene.add.group();

      this.head = this.body.create(x * this.cellSize, y * this.cellSize, 'snake1', 1);
      this.head.setOrigin(0);
      this.head.displayHeight = this.cellSize;
      this.head.displayWidth = this.cellSize;
      this.head.enableBody = true;

      this.alive = true;
      this.speed = 150;
      this.moveTime = 0;
      this.tailPosition = new Phaser.Geom.Point(x * this.cellSize, y * this.cellSize);

      this.heading = RIGHT;
      this.direction = RIGHT;
      
      scene.physics.add.existing(this.body);
  },

  update: function (time)
  {
      if (time >= this.moveTime)
      {
          return this.move(time);
      }
  },

  faceLeft: function ()
  {
      if (this.direction === UP || this.direction === DOWN)
      {
          this.head.angle = 180;
          this.heading = LEFT;
          this.body.children.each(function (segment) {
            segment.angle = 180;
          })
      }
  },

  faceRight: function ()
  {
      if (this.direction === UP || this.direction === DOWN)
      {
          this.head.angle = 0
          this.heading = RIGHT;
          this.body.children.each(function (segment) {
            segment.angle = 0;
          })
      }
  },

  faceUp: function ()
  {
      if (this.direction === LEFT || this.direction === RIGHT)
      {
          this.head.angle = 270;
          this.heading = UP;
          this.body.children.each(function (segment) {
            segment.angle = 270;
          })
      }
  },

  faceDown: function ()
  {
      if (this.direction === LEFT || this.direction === RIGHT)
      {
          this.head.angle = 90;
          this.heading = DOWN;

          this.body.children.each(function (segment) {
            segment.angle = 90;
          })
      }
  },

  move: function (time)
  {
      /**
      * Based on the heading property (which is the direction the pgroup pressed)
      * we update the headPosition value accordingly.
      * 
      * The Math.wrap call allow the snake to wrap around the screen, so when
      * it goes off any of the sides it re-appears on the other.
      */
      switch (this.heading)
      {
          case LEFT:
              this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, this.cellXMax);
              break;

          case RIGHT:
              this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, this.cellXMax);
              break;

          case UP:
              this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, this.cellYMax);
              break;

          case DOWN:
              this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, this.cellYMax);
              break;
      }

      this.direction = this.heading;

      //  Update the body segments and place the last coordinate into this.tail
      Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * this.cellSize, this.headPosition.y * this.cellSize, 1, this.tailPosition);

      //  Check to see if any of the body pieces have the same x/y as the head
      //  If they do, the head ran into the body

      var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

      if (hitBody)
      {
          this.alive = false;
          return false;
      }
      else
      {
          //  Update the timer ready for the next movement
          this.moveTime = time + this.speed;
          return true;
      }
  },

  grow: function ()
  {
      var newPart = this.body.create(this.tailPosition.x * this.cellSize, this.tailPosition.y * this.cellSize, 'snake1', 4);
      newPart.setOrigin(0);
      newPart.displayHeight = this.cellSize;
      newPart.displayWidth = this.cellSize;
      newPart.width = this.cellSize;
      newPart.height = this.cellSize;
      this.updateSprites();

  },
  updateSprites: function ()
  {
    //do we create a new instance of arcade sprite here?
    var bodyChildren = this.body.getChildren();
    var endTail = Phaser.Actions.GetLast(this.body.getChildren());
    endTail.setTexture('snake1', 3)
    console.log(bodyChildren);
    // bodyChildren.forEach(element => {
    //     element.setTexture('snake1', 4)
    //     //filter for only center children, not first and last.
    // });

  },

  collideWithFood: function (food)
  {
    let snakeX = this.head.x;
    let snakeY = this.head.y;

    switch (this.heading) {
        case DOWN:
            snakeY -= (this.cellSize*0.5);
            snakeX -= (this.cellSize*0.5);
            break;
        case LEFT:
            snakeX += (this.cellSize*0.5);
            snakeY -= (this.cellSize*0.5);
            break;
        // No adjustment needed for RIGHT and UP
    }

    const snakeGridX = Math.floor(snakeX / this.cellSize);
    const snakeGridY = Math.floor(snakeY / this.cellSize);
    
    // Get grid position for food
    const foodGridX = Math.floor(food.x / this.cellSize);
    const foodGridY = Math.floor(food.y / this.cellSize);
    
    // Debug logs
    // console.log('Head Position:', this.headPosition.x, this.headPosition.y);
    // console.log('Snake Grid:', snakeGridX, snakeGridY);
    // console.log('Food Grid:', foodGridX, foodGridY);

    if (snakeGridX === foodGridX && snakeGridY === foodGridY)
    {
        this.grow();
        food.eat();
        
        if (this.speed > 20 && food.total % 5 === 0)
        {
            this.speed -= 5;
        }
        return true;
    }
    
    return false;
  },

  updateGrid: function (grid)
  {
      //  Remove all body pieces from valid positions list
      this.body.children.each(function (segment) {

          var by = Math.floor(segment.y / this.cellSize);
          var bx = Math.floor(segment.x / this.cellSize);

          if (by >= 0 && by < grid.length && bx >= 0 && bx < grid[0].length) {
            grid[by][bx] = false;
        }

      }, this);
      return grid;
  }

});    

export default Snake;