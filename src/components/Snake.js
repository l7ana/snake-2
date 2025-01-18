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
    this.middleSegment = scene.physics.add.sprite( this.tailPosition.x * this.cellSize, this.tailPosition.y * this.cellSize, 'sLineAB', 0 );
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
    if (this.direction === UP || this.direction === DOWN) {
      this.head.anims.play('left', true);
      this.middleSegment.setTexture('sLineAB', 2);
      this.tailSegment.setTexture('sTail', 2);
      this.heading = LEFT;
    }
  },

  faceRight: function () {
    if (this.direction === UP || this.direction === DOWN) {
      this.head.anims.play('right', true);
      this.middleSegment.setTexture('sLineAB', 0);
      this.tailSegment.setTexture('sTail', 0);
      this.heading = RIGHT;
    }
  },

  faceUp: function () {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.head.anims.play('up', true);
      this.middleSegment.setTexture('sLineAB', 1);
      this.tailSegment.setTexture('sTail', 1)
      this.heading = UP;
    }
  },

  faceDown: function () {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.head.anims.play('down', true);
      this.middleSegment.setTexture('sLineAB', 3);
      this.tailSegment.setTexture('sTail', 3);
      this.heading = DOWN;
    }
  },

  move: function (time) {
    switch (this.heading) {
      case LEFT:
        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, this.cellXMax + 1);
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
    var newPart = this.physics.add.sprite( this.tailPosition.x * this.cellSize, this.tailPosition.y * this.cellSize, 'sTail', 3 );
    newPart.setOrigin(0);
    newPart.displayHeight = this.cellSize;
    newPart.displayWidth = this.cellSize;
    newPart.width = this.cellSize;
    newPart.height = this.cellSize;
    this.body.add(newPart);
  },

  updateSprites: function () {
    const segments = this.body.getChildren();
    var half = Math.ceil(segments.length / 2)
    var frontHalf = segments.slice(1, half);
    var backHalf = segments.slice(half);
    //Maybe this func is where we assign the body segments the texture and the frame is assigned here for when the snake initially grows
    //maybe a different update sprites happens when moving, cycling through the body segments' frames

    // //Update textures of former Middle Segment and Tail Segment
    //middle will be Line A
    this.middleSegment.setTexture('sBodyA', 0);
    //tail will be Line B/ Need to figure out how to update this one's texture
    this.tailSegment.setTexture('sBodyB', 0);
    // console.log(this.tailSegment);
    this.body.runChildUpdate;

    segments[half].setTexture('sLineAB', 0);

    frontHalf.forEach((part) => {
      // console.log(part)
      part.setTexture('sBodyA', 0)
    })
    backHalf.forEach((part) => {
      // console.log(part)
      part.setTexture('sBodyB', 0)
    })

    // skip head which is index0
    // for (let i= 1; i < segments.length - 2; i++) {
    //   const current = segments[i];
    //   const previous = segments[i - 1];
    //   const next = segments[i + 1];

    //   const fromDir = this.getDirection(previous, current);
    //   const toDir = this.getDirection(current, next);

    //   // Update sprite based on directions
    //   if (fromDir !== toDir) {
    //     // This is a corner piece
    //     const cornerFrame = this.getCornerFrame(fromDir, toDir);
    //     current.setTexture('sBendAB', cornerFrame);
    //   } else {
    //     // This is a straight piece
    //     const straightFrame = this.getStraightFrame(fromDir);
    //     current.setTexture('sLineAB', straightFrame);
    //   }

    // }

    // Always update tail piece
    if (segments.length > 3) {
      const tail = segments[segments.length - 1];
      const beforeTail = segments[segments.length - 2];
      const tailDir = this.getDirection(beforeTail, tail);
      const tailFrame = this.getTailFrame(tailDir);
      tail.setTexture('sButt', tailFrame);
    }
    // var bodySegments = this.body.getChildren();
    // var half = Math.ceil(bodySegments.length / 2)
    // var frontHalf = bodySegments.slice(1, half);
    // var backHalf = bodySegments.slice(half);
    // //Update textures of form Middle Segment and Tail Segment
    // this.middleSegment.setTexture('snake1', 4);
    // this.tailSegment.setTexture('snake1', 4);
    // this.body.runChildUpdate;

    // for (let i = 0; i++; i >= this.body.length) {
    //   console.log(this.body[i])
    // }
    // frontHalf.forEach((part) => {
    //   // console.log(part)
    //   part.setTexture('snake1', 4)
    // })
    // backHalf.forEach((part) => {
    //   // console.log(part)
    //   part.setTexture('snake1', 8)
    // })

    // //Assign split texture to middle
    // if (bodySegments.length >= 4) {
    //   bodySegments[half].setTexture('snake1', 6);
    // }
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

  // Helper function to get corner piece frame number
  getCornerFrame: function(fromDir, toDir) {
    // Assuming your spritesheet has corner pieces
    // You'll need to adjust these frame numbers based on your spritesheet
    const cornerFrames = {
        [`${UP}-${RIGHT}`]: 0,    // Up to Right
        [`${RIGHT}-${UP}`]: 1,    // Right to Up
        [`${UP}-${LEFT}`]: 2,     // Up to Left
        [`${LEFT}-${UP}`]: 3,     // Left to Up
        [`${DOWN}-${RIGHT}`]: 4,  // Down to Right
        [`${RIGHT}-${DOWN}`]: 5,  // Right to Down
        [`${DOWN}-${LEFT}`]: 6,  // Down to Left
        [`${LEFT}-${DOWN}`]: 7   // Left to Down
    };
    
    return cornerFrames[`${fromDir}-${toDir}`] || 4; // Default to straight piece if not found
  },

  // Helper function to get straight piece frame number
  getStraightFrame: function(direction) {
    const striaghtFrames = {
      [UP]: 1,
      [DOWN]: 3,
      [LEFT]: 2,
      [RIGHT]: 0
    };
    // Adjust these frame numbers based on your spritesheet
    // return (direction === LEFT || direction === RIGHT) ? 4 : 8;
    return striaghtFrames[direction] || 0;
  },

  // Helper function to get tail piece frame number
  getTailFrame: function(direction) {
    // Adjust these frame numbers based on your spritesheet
    const tailFrames = {
        [UP]: 1,
        [DOWN]: 3,
        [LEFT]: 2,
        [RIGHT]: 0
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