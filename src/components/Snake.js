
//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

export default class Snake extends Phaser.Physics.Arcade.Sprite
{
  constructor (scene, x, y) {
    super(scene, x*16 , y*16, 'head', '0');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setCollideWorldBounds(true);

    this.headPosition = new Phaser.Geom.Point(x, y);
    this.body = scene.add.group();

    this.head = this.body.create(x*16 , y*16, 'head');
    this.head.setOrigin(0);

    this.alive = true;
    this.speed = .015;
    this.moveTime = 0;
    this.tail = new Phaser.Geom.Point(x, y);

    this.heading = RIGHT;
    this.direction = RIGHT;
    
    this.onCollide = true;
    this.onOverlap = true;
  
    this.play('head');
  }

  update(time) {
    if (time >= this.moveTime)
      {
        // console.log(time)
        return this.move(time); 
      }
  }

  faceLeft () {
    if (this.direction === UP || this.direction === DOWN)
      { 
        this.heading = LEFT;
      }
  }

  faceRight () {
    if (this.direction === UP || this.direction === DOWN)
      {
        this.heading = RIGHT;
      }
  }

  faceUp () {
    if (this.direction === LEFT || this.direction === RIGHT)
      {
          this.heading = UP;
      }
  }

  faceDown () {
    if (this.direction === LEFT || this.direction === RIGHT)
      {
          this.heading = DOWN;
      }
  }

  move (time) {
    // console.log(this.heading)
    switch (this.heading)
    {
      case LEFT:
          this.x = this.x - 1;
          break;

      case RIGHT:
          this.x = this.x + 1;
          break;

      case UP:
          this.y = this.y - 1;
          break;

      case DOWN:
          this.y = this.y + 1;
          break;
    }
    this.direction = this.heading;

    var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x * 16, y: this.head.y * 16 }, 1, this.tail);
    
    if (hitBody)
      {
          console.log('dead');
          this.alive = false;
          return false;
      }
      else
      {
          //  Update the timer ready for the next movement
          this.moveTime = time + this.speed;
          return true;
      }
  }

  grow () {
    var newPart = this.body.create(this.tail.x, this.tail.y, 'body');
    newPart.setOrigin(0);
    console.log('grow')
  }

  collideWithFood (food) {
    if (this.head.x === food.x && this.head.y === food.y)
      {
          this.grow();

          food.eat();

          return true;
      }
      else
      {
          return false;
      }
  }
}