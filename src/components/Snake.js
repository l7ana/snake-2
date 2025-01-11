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
    this.physics = scene.physics;

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
      frameRate: 6, repeat: -1
    });
    this.head.anims.create({
      key: 'up',
      frames: scene.anims.generateFrameNumbers('sHead', { start: 4, end: 6 }),
      frameRate: 6, repeat: -1
    });
    this.head.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('sHead', { start: 8, end: 10 }),
      frameRate: 6,
      repeat: -1
    });
    this.head.anims.create({
      key: 'down',
      frames: scene.anims.generateFrameNumbers('sHead', { start: 12, end: 14 }),
      frameRate: 6, repeat: -1
    });

    this.head.setOrigin(0);
    this.head.displayHeight = this.cellSize;
    this.head.displayWidth = this.cellSize;
    // Add head to body group
    this.body.add(this.head, this.middleSegment);
    this.heading = RIGHT;
    this.direction = RIGHT;
    
    this.alive = true;
    this.speed = 150;
    this.moveTime = 0;
    this.tailPosition = new Phaser.Geom.Point(x * this.cellSize, y * this.cellSize);

    scene.add.existing(this);
    scene.physics.add.existing(this.body);

    //Create Middle
    this.middleSegment = scene.physics.add.sprite( this.tailPosition.x * this.cellSize, this.tailPosition.y * this.cellSize, 'snake1', 6 );
    this.middleSegment.setOrigin(0);
    this.middleSegment.displayHeight = this.cellSize;
    this.middleSegment.displayWidth = this.cellSize;
    this.body.add(this.middleSegment);

    // Create Tail
    this.tailSegment = scene.physics.add.sprite( this.tailPosition.x * this.cellSize, this.tailPosition.y * this.cellSize, 'snake1', 3 );
    this.tailSegment.setOrigin(0);
    this.tailSegment.displayHeight = this.cellSize;
    this.tailSegment.displayWidth = this.cellSize;
    this.body.add(this.tailSegment);

  },

  update: function (time) {
    if (time >= this.moveTime) {
      return this.move(time);
    }
  },

  faceLeft: function () {
    if (this.direction === UP || this.direction === DOWN) {
      this.head.anims.play('left', true);
      this.heading = LEFT;
    }
  },

  faceRight: function () {
    if (this.direction === UP || this.direction === DOWN) {
      this.head.anims.play('right', true);
      this.heading = RIGHT;
    }
  },

  faceUp: function () {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.heading = UP;
      this.head.anims.play('up', true);
    }
  },

  faceDown: function () {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.head.anims.play('down', true);
      this.heading = DOWN;
    }
  },

  move: function (time) {
    switch (this.heading) {
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

    //  Check to see if any of the body pieces have the same x/y as the head. If they do, the head ran into the body
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

  grow: function () {
    this.updateSprites();
    var newPart = this.physics.add.sprite( this.tailPosition.x * this.cellSize, this.tailPosition.y * this.cellSize, 'snake1', 3 );
    newPart.setOrigin(0);
    newPart.displayHeight = this.cellSize;
    newPart.displayWidth = this.cellSize;
    newPart.width = this.cellSize;
    newPart.height = this.cellSize;
    this.body.add(newPart);
    
  },

  updateSprites: function () {
    var bodySegments = this.body.getChildren();
    var half = Math.ceil(bodySegments.length / 2)
    var frontHalf = bodySegments.slice(1, half);
    var backHalf = bodySegments.slice(half);
    //Update textures of form Middle Segment and Tail Segment
    this.middleSegment.setTexture('snake1', 4);
    this.tailSegment.setTexture('snake1', 4);
    this.body.runChildUpdate;

    for (let i = 0; i++; i >= this.body.length) {
      console.log(this.body[i])
    }
    frontHalf.forEach((part) => {
      // console.log(part)
      part.setTexture('snake1', 4)
    })
    backHalf.forEach((part) => {
      // console.log(part)
      part.setTexture('snake1', 8)
    })

    //Assign split texture to middle
    if (bodySegments.length >= 4) {
      bodySegments[half].setTexture('snake1', 6);
    }
  },

  updateGrid: function (grid) {
    // Get all body segments including head
    const bodySegments = this.body.getChildren();
    
    // Remove all body pieces from valid positions list
    bodySegments.forEach(segment => {
        // Convert pixel position back to grid coordinates
        // Subtract the adjustment values and divide by cellSize to get grid position
        const bx = Math.floor((segment.x - this.xAdjustment) / this.cellSize);
        const by = Math.floor((segment.y - this.yAdjustment) / this.cellSize);

        // Only mark as invalid if within grid bounds
        if (by >= 0 && by < grid.length && bx >= 0 && bx < grid[0].length) {
            grid[by][bx] = false;
        }
    });

    return grid;
  }


});    

export default Snake;