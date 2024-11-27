
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
    this.enableBody = true;
  
    this.play('head');
  }

  update(time, layer) {
    if (time >= this.moveTime)
      {
        // console.log(time)
        return this.move(time, layer); 
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

  move (time, layer) {
    // console.log(this.heading)
    switch (this.heading)
    {
      case LEFT:
          this.x = this.x - 1;
          //need to change how this.x transforms in the increment
          this.angle = 180;
          // const tile = layer.getTileAtWorldXY(this.x - 32, this.y, true);
          // if (tile.index === 1){
          //   return
          // } else {
          //   this.x -= 32;
          //   this.angle = 180;
          // }
          break;

      case RIGHT:
          this.x = this.x + 1;
          this.angle = 0;
          break;

      case UP:
          this.y = this.y - 1;
          this.angle = 270;
          break;

      case DOWN:
          this.y = this.y + 1;
          this.angle = 90;
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