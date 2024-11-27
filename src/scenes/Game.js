import { Scene } from 'phaser';
import Snake from '../components/Snake.js';
import Food from '../components/Food.js';

var snake;
var food;
var cursors;
var map;
var tileset;
var layer;

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        // this.add.image(512, 384, 'background').setAlpha(0.5);

        // Creating a blank tilemap with the specified dimensions
        map = this.make.tilemap({ key: 'map'});
        console.log(map)
        tileset = map.addTilesetImage('tileset1', 'tiles', 32, 32);
        layer = map.createLayer("Tile Layer 1", [tileset]);
        // populateBoardAndTrackEmptyTiles

        // this.area = this.add.tileSprite(150, 150, 300, 300, "area").setOrigin(0, 0);

        // this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5);
        food = new Food(this, 16, 8);
        snake = new Snake(this, 8, 8);
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

        // this.physics.add.overlap(this.snake, this.food, (snake, food) => snake.collideWithFood(food));

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
            // snake.setVelocityX(-1*this.speed);
         }
        else if (cursors.right.isDown)
        { 
            snake.faceRight();
            // snake.setVelocityX(this.speed);
        }
        else if (cursors.up.isDown)
        { 
            snake.faceUp();
            // this.setVelocityY(-1*this.speed);
        }
        else if (cursors.down.isDown)
        { 
            snake.faceDown();
            // this.setVelocityY(this.speed); 
        }
        snake.update(time, layer);

        if (snake.update(time, layer)) {
            snake.collideWithFood(food);
            // if (snake.collideWithFood(food))
            //     {
            //         repositionFood();
            //     }
        }

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
