export default class Food extends Phaser.Physics.Arcade.Image
{
  constructor (scene, x, y) {
    super(scene, x*64 + 1, y*64 + 2);
    
    Phaser.Physics.Arcade.Image.call(this, scene)

    this.textures = ['food1','food2','food3','food4','food5','food6','food7','food8',];
    this.textureKey = 0

    this.setTexture(this.textures[this.textureKey]);
    this.setPosition(x*64 + 1, y*64 + 2);
    this.setOrigin(0);
    this.onCollide = true;
    this.onOverlap = true;
    this.enableBody = true;

    this.width = 64;
    this.height = 64;
    
    this.total = 0;

    scene.children.add(this);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  eat () {
    this.total++;

    var x = Phaser.Math.Between(0, 31);
    var y = Phaser.Math.Between(0, 23);

    this.setPosition(x * 32, y * 32);
  }
  change () {
    //cycle through the food textures
    //7 total items (8, but index 0 is 1)
    if (this.textureKey === 7){
      this.textureKey = 0;
    } else {
      this.textureKey++;
    }
    this.setTexture(this.textures[this.textureKey]);

  }
}
