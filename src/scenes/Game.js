import { Scene } from 'phaser';
import Snake from '../components/Snake.js';
import Food from '../components/Food.js';

var snake;
var food;
var cursors;

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        // this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5);
        food = new Food(this, 16, 8);
        console.log(food);

        snake = new Snake(this, 8, 8);
        console.log(snake);
        console.log(this);

        this.physics.add.collider(snake, food);
        this.physics.add.collider(snake, food, this.collectFood, null, this);

        // this.physics.add.overlap(this.snake, this.food, (snake, food) => snake.collideWithFood(food));

        //  Create our keyboard controls
        cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-Q', this.log, this );

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
        snake.update(time);

        if (snake.update(time)) {
            snake.collideWithFood(food);
            // if (snake.collideWithFood(food))
            //     {
            //         repositionFood();
            //     }
        }

    }
}
