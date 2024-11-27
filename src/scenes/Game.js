import { Scene, Grid } from 'phaser';
import Snake from '../components/Snake.js';
import Food from '../components/Food.js';

var snake;
var food;
var cursors;
// var map;
// var tileset;
// var layer;
var timeline2;

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.grid(1024/2, 768/2, 1024, 768, 32, 32, 0xffffff, .25, 0xffffff, 1)
        console.log(this)
        // this.add.image(512, 384, 'background').setAlpha(0.5);

        // Creating a blank tilemap with the specified dimensions
        // map = this.make.tilemap({ key: 'map'});
        // console.log(map)
        // tileset = map.addTilesetImage('tileset1', 'tiles', 32, 32);
        // layer = map.createLayer("Tile Layer 1", [tileset]);
        // populateBoardAndTrackEmptyTiles
        // this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5);
        // const timeline = this.add.timeline();
        // timeline.repeat().play();
        // timeline.add({
        //   in: 1000,
        //   run: () => {
        //     console.log('hi')   
        //   }
        // })

        const timeline2 = this.add.timeline();
        timeline2.repeat().play();
        timeline2.add({
          in: 1000,
          run: () => {
            console.log(snake.x, snake.y);
          }
        })

        food = new Food(this, 100, 100);
        snake = new Snake(this, 80, 80);
        console.log(food);

        snake.touchesArea = false;
        console.log(snake);
        this.txt = this.add.text(300, 10, 'DOES NOT TOUCH', { color: '#FF0000' });
        // console.log(this);

        this.physics.add.existing(snake);
        // this.physics.arcade.enable(snake);
        this.physics.add.existing(food);

        // this.physics.add.collider(snake, food);

        this.physics.add.overlap(snake, food, this.log, [], this);
        // this.physics.add.collider(snake, food, this.collectFood, null, this);
        
        this.physics.add.overlap(snake, food, function(b1, b2) {
        	snake.touchesArea = true;
        });

        //  Create our keyboard controls
        cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-Q', this.log, this );

        this.physics.world.drawDebug = false;
        this.toggleDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        // this.input.once('pointerdown', () => {

        //     this.scene.start('GameOver');

        // });
    }
    
    collectFood (snake, food) {
        food.disableBody(true, true);
        snake.grow();
        food.eat();
    }

    log () {
        console.log(`snake is ${snake.x}, ${snake.y} and food is ${food.x}, ${food.y}` );
    }

    update (time, delta) {
        this.txt.setText(snake.touchesArea ? 'TOUCHES':'DOES NOT TOUCH');
        snake.touchesArea = false;

        if (!snake.alive)
            { return; }

        if (cursors.left.isDown)
        { 
            snake.faceLeft();
         }
        else if (cursors.right.isDown)
        { 
            snake.faceRight();
        }
        else if (cursors.up.isDown)
        { 
            snake.faceUp();
        }
        else if (cursors.down.isDown)
        { 
            snake.faceDown();
            // this.setVelocityY(this.speed); 
        }
        // snake.update(time);
        // if (snake.update(time)) {
        //     snake.collideWithFood(food);
        // }

        if (Phaser.Input.Keyboard.JustDown(this.toggleDebug)) {
            if (this.physics.world.drawDebug) {
              this.physics.world.drawDebug = false;
              this.physics.world.debugGraphic.clear();
            }
            else {
              this.physics.world.drawDebug = true;
            }
          }

    }
}
