export default class Food extends Phaser.Physics.Arcade.Image
{
  constructor (scene, x, y) {
    super(scene, x*32 + 1, y*32 + 2);
    
    Phaser.Physics.Arcade.Image.call(this, scene)

    this.setTexture('food');
    this.setPosition(x*32 + 1, y*32 + 2);
    this.setOrigin(0);
    this.onCollide = true;
    this.onOverlap = true;
    this.enableBody = true;

    this.width = 32;
    this.height = 32;

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