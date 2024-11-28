
//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

export default class Snake extends Phaser.Physics.Arcade.Sprite
{
  constructor (scene, x, y) {
    super(scene, x , y, 'head', '0');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setCollideWorldBounds(true);

    this.headPosition = new Phaser.Geom.Point(x, y);
    this.body = scene.add.group();

    this.head = this.body.create(x , y, 'head');
    this.head.setOrigin(0);

    this.alive = true;
    this.speed = .015;
    this.moveTime = 0;
    this.tail = new Phaser.Geom.Point(x, y);

    this.heading = RIGHT;
    this.direction = RIGHT;
    
    this.onCollide = true;
    this.onOverlap = true;
    this.enableBody = true;
  
    // this.play('head');
  }

  update(time) {
    if (time >= this.moveTime)
      {
        return this.move(time); 
      }
  }

  faceLeft () {
    if (this.direction === UP || this.direction === DOWN)
      { 
        this.heading = LEFT;
        this.angle = 180;
      }
  }

  faceRight () {
    if (this.direction === UP || this.direction === DOWN)
      {
        this.heading = RIGHT;
        this.angle = 0;
      }
  }

  faceUp () {
    if (this.direction === LEFT || this.direction === RIGHT)
      {
          this.heading = UP;
          this.angle = 270;
      }
  }

  faceDown () {
    if (this.direction === LEFT || this.direction === RIGHT)
      {
          this.heading = DOWN;
          this.angle = 90;
      }
  }

  move (time) {
    // console.log(this.heading)
    switch (this.heading)
    {
      case LEFT:
          this.x = this.x - 32;
          break;

      case RIGHT:
          this.x = this.x + 32;
          break;

      case UP:
          this.y = this.y - 32;
          break;

      case DOWN:
          this.y = this.y + 32;
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