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
    this.hasntEaten = true;

    // Create head with frame 1 and enable physics
    this.head = scene.physics.add.sprite(
      this.headPosition.x, 
      this.headPosition.y, 
      'sHead', 
      0
    );

    this.head.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('sHead', { start: 0, end: 0 }),
      frameRate: 6, repeat: -1
    });
    this.head.anims.create({
      key: 'up',
      frames: scene.anims.generateFrameNumbers('sHead', { start: 1, end: 1 }),
      frameRate: 6, repeat: -1
    });
    this.head.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('sHead', { start: 2, end: 2 }),
      frameRate: 6,
      repeat: -1
    });
    this.head.anims.create({
      key: 'down',
      frames: scene.anims.generateFrameNumbers('sHead', { start: 3, end: 3 }),
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
    this.middleSegment = scene.physics.add.sprite( this.tailPosition.x * this.cellSize, this.tailPosition.y * this.cellSize, 'sBodyAB', 0 );
    this.middleSegment.setOrigin(0);
    this.middleSegment.displayHeight = this.cellSize;
    this.middleSegment.displayWidth = this.cellSize;
    this.body.add(this.middleSegment);

    // Create Tail
    this.tailSegment = scene.physics.add.sprite( this.tailPosition.x * this.cellSize, this.tailPosition.y * this.cellSize, 'sTail', 0 );
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
    if (this.direction === UP || this.direction === DOWN) { this.heading = LEFT; }
  },

  faceRight: function () {
    if (this.direction === UP || this.direction === DOWN) { this.heading = RIGHT; }
  },

  faceUp: function () {
    if (this.direction === LEFT || this.direction === RIGHT) { this.heading = UP; }
  },

  faceDown: function () {
    if (this.direction === LEFT || this.direction === RIGHT) { this.heading = DOWN; }
  },

  move: function (time) {
    switch (this.heading) {
      case LEFT:
        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, this.cellXMax + 1);
        this.head.anims.play('left', true);
        break;

      case RIGHT:
        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, this.cellXMax + 1);
        this.head.anims.play('right', true);
        break;

      case UP:
        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, this.cellYMax);
        this.head.anims.play('up', true);
        break;

      case DOWN:
        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, this.cellYMax);
        this.head.anims.play('down', true);
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

    this.rotateSegments();

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
    this.hasntEaten = false;
    this.body.runChildUpdate;
    this.updateSegmentTextures();
    this.rotateSegments();
    
    var newPart = this.physics.add.sprite( this.tailPosition.x * this.cellSize, this.tailPosition.y * this.cellSize, 'sTail', 3 );
    newPart.setOrigin(0);
    newPart.displayHeight = this.cellSize;
    newPart.displayWidth = this.cellSize;
    newPart.width = this.cellSize;
    newPart.height = this.cellSize;
    this.body.add(newPart);
  },

  updateSegmentTextures: function () {
    const segments = this.body.getChildren();
    var half = Math.ceil(segments.length / 2)
    var frontHalf = segments.slice(1, half);
    var backHalf = segments.slice(half+1);
    var middle = segments[half];
    middle.setTexture('sBodyAB', 0);

    frontHalf.forEach((part) => {
      part.setTexture('sBodyA', 0)
    })
    backHalf.forEach((part) => {
      part.setTexture('sBodyB', 0)
    })
  },

  rotateSegments: function() {
    const segments = this.body.getChildren();
    
    // Skip the head (index 0) and start from first body segment
    for (let i = 1; i < segments.length - 1; i++) {
      const current = segments[i];
      const previous = segments[i - 1];
      const next = segments[i + 1];

      const fromDir = this.getDirection(previous, current);
      const toDir = this.getDirection(current, next);

      // Check if this is the middle segment that bridges colors A and B
      const isMiddleSegment = i === Math.floor(segments.length / 2);
      
      if (fromDir !== toDir) {
        // This is a corner piece
        const cornerFrame = this.getCornerFrame(fromDir, toDir);
        if (isMiddleSegment) {
          current.setTexture('sBendAB', cornerFrame);
        } else if (i < Math.floor(segments.length / 2)) {
          current.setTexture('sBendA', cornerFrame);
        } else {
          current.setTexture('sBendB', cornerFrame);
        }
      } else {
        // This is a straight piece
        const straightFrame = this.getStraightFrame(fromDir);
        if (isMiddleSegment) {
          current.setTexture('sBodyAB', straightFrame);
        } else if (i < Math.floor(segments.length / 2)) {
          current.setTexture('sBodyA', straightFrame);
        } else {
          current.setTexture('sBodyB', straightFrame);
        }
      }
    }

    // Handle the tail separately
    const tail = segments[segments.length - 1];
    const beforeTail = segments[segments.length - 2];
    const tailDir = this.getDirection(beforeTail, tail);
    const tailFrame = this.getTailFrame(tailDir);
    tail.setTexture('sTail', tailFrame);
  },

  // Update corner frame calculations for more precise rotations
  getCornerFrame: function(fromDir, toDir) {
    const cornerMap = {
      [`${UP}-${RIGHT}`]: 7,    // Up to Right
      [`${RIGHT}-${UP}`]: 6,    // Right to Up
      [`${RIGHT}-${DOWN}`]: 2,  // Right to Down
      [`${DOWN}-${RIGHT}`]: 3,  // Down to Right
      [`${DOWN}-${LEFT}`]: 1,   // Down to Left
      [`${LEFT}-${DOWN}`]: 0,   // Left to Down
      [`${LEFT}-${UP}`]: 4,     // Left to Up
      [`${UP}-${LEFT}`]: 5      // Up to Left
    };
    
    const key = `${fromDir}-${toDir}`;
    return cornerMap[key] ?? 0; // Default to first frame if combination not found
  },

  getDirection: function(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    // Account for screen wrapping
    const wrappedDX = Math.abs(dx) > this.cellSize * (this.cellXMax / 2) 
        ? -Math.sign(dx) * (this.cellSize * this.cellXMax - Math.abs(dx))
        : dx;
    const wrappedDY = Math.abs(dy) > this.cellSize * (this.cellYMax / 2)
        ? -Math.sign(dy) * (this.cellSize * this.cellYMax - Math.abs(dy))
        : dy;
    
    if (Math.abs(wrappedDX) > Math.abs(wrappedDY)) {
        return wrappedDX > 0 ? RIGHT : LEFT;
    } else {
        return wrappedDY > 0 ? DOWN : UP;
    }
  },

  // Helper function to get straight piece frame number
  getStraightFrame: function(direction) {
    const striaghtFrames = {
      [UP]: 3,
      [DOWN]: 1,
      [LEFT]: 0,
      [RIGHT]: 2
    };
    return striaghtFrames[direction] || 0;
  },

  // Helper function to get tail piece frame number
  getTailFrame: function(direction) {
    const tailFrames = {
        [UP]: 3,
        [DOWN]: 1,
        [LEFT]: 0,
        [RIGHT]: 2
    };
    return tailFrames[direction] || 0; // Default to left-facing tail
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