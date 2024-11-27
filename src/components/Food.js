export default class Food extends Phaser.Physics.Arcade.Image
{
  constructor (scene, x, y) {
    super(scene, x, y);
    
    Phaser.Physics.Arcade.Image.call(this, scene)

    this.setTexture('food');
    this.setPosition(x * 16, y * 16);
    this.setOrigin(0);
    this.onCollide = true;
    this.onOverlap = true;
    this.enableBody = true;

    this.setScale(2);

    // this.width = 200;
    // this.height = 200;

    this.total = 0;

    scene.children.add(this);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  eat () {
    this.total++;

    var x = Phaser.Math.Between(0, 39);
    var y = Phaser.Math.Between(0, 29);

    this.setPosition(x * 16, y * 16);
  }
}