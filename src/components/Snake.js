//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var Snake = new Phaser.Class({

  initialize:

  function Snake (scene, x, y, layout)
  {
    this.cellSize = layout.cellSize;
    this.cellXMax = layout.cellXMax;
    this.cellYMax = layout.cellYMax;
    this.xAdjustment = ((layout.gameWidth - layout.sceneWidth) / 2);
    this.yAdjustment = layout.yPos - (this.cellSize*1.5);
    
    this.body = scene.add.group();
    this.x = (x * this.cellSize) + this.xAdjustment;
    this.y = (y * this.cellSize) + this.yAdjustment;
    this.headPosition = new Phaser.Geom.Point(x, y);

    // Create head with frame 1 and enable physics
    this.head = scene.physics.add.sprite(
      this.headPosition.x, 
      this.headPosition.y, 
      'sHead', 
      0
    );

    this.head.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('sHead', { start: 0, end: 2 }),
      frameRate: 12,
      repeat: -1
    });
    this.head.anims.create({
      key: 'up',
      frames: scene.anims.generateFrameNumbers('sHead', { start: 4, end: 6 }),
      frameRate: 12,
      repeat: -1
    });
    this.head.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('sHead', { start: 8, end: 10 }),
      frameRate: 12,
      repeat: -1
    });
    this.head.anims.create({
      key: 'down',
      frames: scene.anims.generateFrameNumbers('sHead', { start: 12, end: 14 }),
      frameRate: 12,
      repeat: -1
    });
    // this.head = scene.physics.add.sprite(
    //   (x * this.cellSize) + this.xAdjustment, 
    //   (y * this.cellSize) + this.yAdjustment, 
    //   'snake1', 
    //   1
    // );
    // Set up physics body size for the head
    this.head.setOrigin(0);
    this.head.displayHeight = this.cellSize;
    this.head.displayWidth = this.cellSize;
    // Set up physics body size and offset
    // this.head.body.setSize(this.cellSize, this.cellSize);
    // this.head.body.setOffset(0, 0);
    //   this.head.body.setSize(this.cellSize, this.cellSize);
    //   this.head.body.setOffset(0, 0);
    
    const middleSegment = scene.physics.add.sprite(
      ((x - 1) * this.cellSize) + this.xAdjustment,
      (y * this.cellSize) + this.yAdjustment,
      'snake1', 6
    )
      middleSegment.setOrigin(0);
      middleSegment.displayHeight = this.cellSize;
      middleSegment.displayWidth = this.cellSize;

    const tailSegment = scene.physics.add.sprite(
        ((x - 2) * this.cellSize) + this.xAdjustment,
        (y * this.cellSize) + this.yAdjustment,
        'snake1',
        3
    );
    tailSegment.setOrigin(0);
    tailSegment.displayHeight = this.cellSize;
    tailSegment.displayWidth = this.cellSize;
      
    // Add head to body group
    this.body.add(this.head, middleSegment, tailSegment);

      this.alive = true;
      this.speed = 150;
      this.moveTime = 0;
      this.tailPosition = new Phaser.Geom.Point(x * this.cellSize, y * this.cellSize);

      this.heading = RIGHT;
      this.direction = RIGHT;
      
      scene.add.existing(this);
      scene.physics.add.existing(this.body);
  },

  update: function (time) {
      if (time >= this.moveTime) {
          return this.move(time);
      }
  },

  faceLeft: function () {
      if (this.direction === UP || this.direction === DOWN) {
          console.log(this.head)
          this.head.anims.play('left', true);
          // this.head.setTexture
          this.heading = LEFT;
      }
  },

  faceRight: function () {
      if (this.direction === UP || this.direction === DOWN) {
          console.log(this.head)
          this.head.anims.play('right', true);
          this.heading = RIGHT;
      }
  },

  faceUp: function () {
      if (this.direction === LEFT || this.direction === RIGHT) {
        console.log(this.head)
        this.heading = UP;
        this.head.anims.play('up', true);
      }
  },

  faceDown: function () {
      if (this.direction === LEFT || this.direction === RIGHT) {
        console.log(this.head)
        this.head.anims.play('down', true);
        this.heading = DOWN;
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
              this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, this.cellXMax + 1);
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
      Phaser.Actions.ShiftPosition(
        this.body.getChildren(), 
        (this.headPosition.x * this.cellSize) + this.xAdjustment, 
        (this.headPosition.y * this.cellSize) + 50, 
        1, 
        this.tailPosition
        );

      //  Check to see if any of the body pieces have the same x/y as the head
      //  If they do, the head ran into the body

      var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

      if (hitBody) {
          this.alive = false;
          return false;
      }
      else {
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
      //Fallback if updateSprites() is too complex, is to use 1 sprite for every body segment with an increasing RGB filter

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