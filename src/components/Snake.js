export default class Snake extends Phaser.Physics.Arcade.Sprite
{
  constructor (scene, x, y, animation, speed) {
    super(scene, x , y, './sprites/HeadSprite.png');
    this.play(animation);
    this.speed = speed;
  }
}