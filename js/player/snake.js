/*
 * @Author: qqilin1213
 * @Date: 2021-03-18 15:45:24
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-03-22 11:42:51
 */

import Control from './control';
import Food from '../npc/food'
import Music from '../runtime/music'
import GameInfo from '../runtime/gameinfo'

const RECT_SIZE = 15;

let music = new Music();


let context = canvas.getContext('2d');
const control = new Control();

const WIN_WIDTH = window.innerWidth
const WIN_HIGHT = window.innerHeight

const RECT_UNIT = WIN_WIDTH / RECT_SIZE;

// 列方格个数
const L_UNIT = Math.floor(WIN_HIGHT / RECT_UNIT)

let dirX = 0;
let dirY = 0;

let food = new Food();
console.log('snake.js', food)

let gameInfo = new GameInfo()
// console.log(foods)

let scores = []


export default class Snake {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        // 蛇身
        this.snakeBodys = [];
        // 蛇头
        for (let i = 3; i >= 1; i--) {
            this.snakeBodys.push({
                x: i,
                y: 2,
                w: RECT_UNIT,
                h: RECT_UNIT,
                color: "#8B0000",
                snakeMoveDirection: 'right'
            });
        }
        this.perSocre = 1
        this.score = 0
        this.eatCount = 0
        this.defaultSpeedLevel = 100;
        this.moveSpeedLevel = this.defaultSpeedLevel;
        this.isOver = false
        this.draw();

    }

    /**
     * 开始绘制
     */
    draw() {
        this.onBeforeDraw && this.onBeforeDraw();
        this.context.clearRect(0, 0, WIN_WIDTH, WIN_HIGHT);
        this.drawBodies();
        food.draw()

        context.drawImage(this.canvas, 0, 0);
    }

    /**
     * 画身体
     */
    drawBodies() {
        let snakeBodys = this.snakeBodys;
        let len = snakeBodys.length;
        // let i = len - 1;
        for (let i = 0; i <= len - 1; i++) {
            let x = snakeBodys[i].x
            let y = snakeBodys[i].y
            if (i === 0) {
                this.context.fillStyle = "#8B0000"
            } else {
                this.context.fillStyle = "#7FFFAA"
            }
            this.context.beginPath();
            this.context.fillRect(x * RECT_UNIT, y * RECT_UNIT, RECT_UNIT, RECT_UNIT)
            // this.context.arc(x, y, UNITBODY, 0, 2 * Math.PI, true);
            this.context.closePath();
        }
    }

    /**
     * 移动，改变位移
     */
    changeDir() {
        let snakeMoveDirection = control.initEvents()
        // console.log(snakeMoveDirection)
        // let snakeMoveDirection = dir
        let x = this.snakeBodys[0].x
        let y = this.snakeBodys[0].y
        // console.log(x, y)
        this.snakeBodys[0].snakeMoveDirection = snakeMoveDirection
        if (snakeMoveDirection == 'right' && x < WIN_WIDTH) {
            dirX = 1;
            dirY = 0;
        } else if (snakeMoveDirection == 'left' && x > 0) {
            dirX = -1;
            dirY = 0;
        } else if (snakeMoveDirection == 'bottom' && y < WIN_HIGHT) {
            dirX = 0;
            dirY = 1;
        } else if (snakeMoveDirection == 'top' && y > 0) {
            dirX = 0;
            dirY = -1;
        }
        // switch (snakeMoveDirection) {
        //     case "left":
        //         dirX = -1;
        //         dirY = 0;
        //         break;
        //     case "right":
        //         dirX = 1;
        //         dirY = 0;
        //         break;
        //     case "top":
        //         dirX = 0;
        //         dirY = -1;
        //         break;
        //     case "bottom":
        //         dirX = 0;
        //         dirY = 1;
        //         break;
        // }
    }
    move() {
        this.changeDir()
        let snakeBodys = this.snakeBodys;
        let foods = food.foods;
        // console.log(snakeMoveDirection)
        var oldHead = snakeBodys[0]
        var newHead = {
            x: oldHead.x + dirX,
            y: oldHead.y + dirY,
        }
        snakeBodys.unshift(newHead)
        for (let i = 0; i < foods.length; i++) {
            let food = foods[i]
            if (food.isEated) {
                var oldHead2 = snakeBodys[0]
                var newHead2 = {
                    x: oldHead2.x + dirX,
                    y: oldHead2.y + dirY,
                }
                snakeBodys.unshift(newHead2)
            }
        }
        snakeBodys.pop()
        // console.log(dirX,dirY)
    }
    /**
     * 碰撞检测
     */
    collisionCheck() {
        let isOver = this.isOver;
        let snakeBodys = this.snakeBodys;
        let head = snakeBodys[0];
        let foods = food.foods;

        // 是否碰到画布边缘
        if (head.x >= RECT_SIZE || head.x < 0 || head.y < 0 || head.y >= L_UNIT) {
            music.playDie()
            this.isOver = true
            isOver = true
        } else {
            // 与食物发生碰撞
            for (let j = 0; j < foods.length; j++) {
                let food = foods[j]
                if (this.eatFood(head, food)) {
                    if(this.food2()){
                        music.playEat();
                        this.score += 10;
                        this.eatCount += 1
                        gameInfo.foodScore();
                        food.isEated = true
                    }
                    // console.log('snake.js -- collisionCheck',food.x)
                    music.playEat();
                    this.score += 10;
                    this.eatCount += 1
                    // 每吃6个， 速度加快
                    if(this.eatCount % 6 == 0){
                        snakeBodys.moveSpeedLevel -= 20;
                    }
                    gameInfo.foodScore();
                    food.isEated = true
                    // console.log(this.score)
                } else {
                    food.isEated = false
                }
            }

            // 与身体发生碰撞
            if (this.score > 1) {
                for (let i = 1; i < snakeBodys.length; i++) {
                    if (head.x === snakeBodys[i].x && head.y === snakeBodys[i].y) {
                        music.playDie()
                        this.isOver = true
                        isOver = true
                    }
                }
            }
        }
        return isOver;
    }

    food2(){
        let falg = false; //默认不重复
        let foodsInfo = []
        let foods = food.foods;
        for(let i=0;i<foods.length;i++){
            foodsInfo.push({
                x : foods[i].x,
                y : foods[i].y
            })
            // console.log(foodsInfo)
        }
        for(var i = 0; i< foodsInfo.length-1;i++){
            for(var j =i+1 ;j<foodsInfo.length;j++){
                if(foodsInfo[i].x == foodsInfo[j].x ){
                    if(foodsInfo[i].y + 1 == foodsInfo[j].y ||foodsInfo[i].y -1 == foodsInfo[j].y ){
                        falg = true; //相邻
                        // console.log('相邻');
                        break;
                    }
                }
                else{
                    if(foodsInfo[i].y == foodsInfo[j].y ){
                        if(foodsInfo[i].x + 1 == foodsInfo[j].x ||foodsInfo[i].x -1 == foodsInfo[j].x ){
                            falg = true; //相邻
                            // console.log('相邻');
                            break;
                        }
                    }
                }
            }
        }                
        return falg;
    }
    eatFood(snakeHead, food) {
        // console.log('snake.js -- snake',snakeHead.x)
        // console.log('snake.js -- snake',snakeHead.y)
        // console.log('snake.js',food.x)
        // console.log('snake.js',food.y)
        // console.log(food.x)
        if (snakeHead.x === food.x && snakeHead.y === food.y) {
            return true;
        } else {
            return false;
        }
    }

}