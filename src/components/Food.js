export default class Food extends Phaser.Physics.Arcade.Image
{
  constructor (scene, x, y) {
    super(scene, x , y );

    if (!scene.sys.game.device.input.touch) {
      this.cellSize = 32;
      this.cellXMax = 32;
      this.cellYMax = 24;
    } else {
      this.cellSize = 64;
      this.cellXMax = 
      this.cellYMax = 12;
    }
    
    Phaser.Physics.Arcade.Image.call(this, scene)

    this.textures = ['food1','food2','food3','food4','food5','food6','food7','food8',];
    this.textureKey = 0
    // this.data ['candy']
    // //Enhancement: counter for each type of texture consumed

    //Randomize order of textures OR

    //Add new instances of Food with a fadeout if not eaten in xyz time (it melts or something)

    this.setTexture(this.textures[this.textureKey]);
    this.setPosition(x * this.cellSize , y * this.cellSize );
    this.setOrigin(0);
    this.enableBody = true;

    this.width = this.cellSize;
    this.height = this.cellSize;
    this.displayHeight = this.cellSize;
    this.displayWidth = this.cellSize;
    
    this.total = 0;

    scene.children.add(this);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  eat () {
    this.total++;

    var x = Phaser.Math.Between(0, this.cellXMax - 1);
    var y = Phaser.Math.Between(0, this.cellYMax - 1);

    this.setPosition(x * this.cellSize, y * this.cellSize);
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
