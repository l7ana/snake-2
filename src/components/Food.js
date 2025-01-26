// import sharp from 'sharp'

export default class Food extends Phaser.Physics.Arcade.Image
{
  constructor (scene, x, y, layout) {
    super(scene, x , y, layout);

    this.cellSize = layout.cellSize;
    this.cellXMax = layout.cellXMax;
    this.cellYMax = layout.cellYMax;
    this.xAdjustment = ((layout.gameWidth - layout.sceneWidth) / 2);
    this.yAdjustment = layout.yPos - this.cellSize;
    
    Phaser.Physics.Arcade.Image.call(this, scene)

    this.textures = ['food1','food2','food3','food4','food5','food6','food7','food8',];
    this.textureKey = 0
    // this.data ['candy']
    // //Enhancement: counter for each type of texture consumed

    //Randomize order of textures OR

    //Add new instances of Food with a fadeout if not eaten in xyz time (it melts or something)

    this.setTexture(this.textures[this.textureKey]);
    // this.setPosition((x * this.cellSize) - ((layout.gameWidth - layout.sceneWidth) / 2) , (y * this.cellSize) + layout.yPos );
    this.setPosition((x * this.cellSize) + this.xAdjustment, (y * this.cellSize) + this.yAdjustment );
    this.setOrigin(0);
    this.enableBody = true;

    this.calculatedScale = this.cellSize / this.displayWidth;

    this.width = this.cellSize;
    this.height = this.cellSize;
    // console.log(this.calculatedScale)
    // console.log(this)
    // this.displayHeight = this.cellSize;
    // this.displayWidth = this.cellSize;
    
    this.total = 0;

    scene.children.add(this);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  eat () {
    this.total++;

    var x = Phaser.Math.Between(0, this.cellXMax);
    var y = Phaser.Math.Between(1, this.cellYMax);
    // console.log(x, y)

    this.setPosition((x * this.cellSize) + this.xAdjustment, (y * this.cellSize) + this.yAdjustment);
  }

  change () {
    //cycle through the food textures
    // console.log(this.x, this.y)
    if (this.textureKey === 7){
      this.textureKey = 0;
    } else {
      this.textureKey++;
    }
    this.setTexture(this.textures[this.textureKey]);

  }
}
