/*
 * @Author: qqilin1213
 * @Date: 2021-03-21 21:52:09
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-03-21 21:56:32
 */

let context = canvas.getContext('2d');

const RECT_SIZE = 15;
const WIN_WIDTH = window.innerWidth
const WIN_HIGHT = window.innerHeight

// 行方格大小
const RECT_UNIT = WIN_WIDTH / RECT_SIZE;
// 列方格个数
const L_UNIT = Math.floor(WIN_HIGHT / RECT_UNIT)


export default class Food {
    constructor() {
        this.foods = [];
        // 食物
        for (let i = 0; i <=5; i++) {
            this.foods.push({
                x : Math.floor(Math.random() * RECT_SIZE),
                y : Math.floor(Math.random() * L_UNIT),
                w: RECT_UNIT,
                h: RECT_UNIT,
                color: "rgb(" + this.randomAB(0, 255) + "," + this.randomAB(0, 255) + "," + this.randomAB(0, 255) + ")",
                isEated : false,
            });
        }
        // this.foods.push({
        //     x: Math.floor(Math.random() * RECT_SIZE),
        //     y: Math.floor(Math.random() * L_UNIT),
        //     w: RECT_UNIT,
        //     h: RECT_UNIT,
        //     color: "rgb(" + this.randomAB(0, 255) + "," + this.randomAB(0, 255) + "," + this.randomAB(0, 255) + ")",
        //     isEated: false,
        // });
        this.draw()
    }

    randomAB(A, B) {
        return parseInt(Math.random() * (B - A) + A);
    }

    draw() {
        for (let i = 0; i < this.foods.length; i++) {
            if (this.foods[i].isEated) {
                this.foods[i].x = Math.floor(Math.random() * RECT_SIZE)
                this.foods[i].y = Math.floor(Math.random() * L_UNIT)
                this.foods[i].color = "rgb(" + this.randomAB(0, 255) + "," + this.randomAB(0, 255) + "," + this.randomAB(0, 255) + ")"
            }
            // console.log(this.foods[i].x)
            // 绘制
            //let x = this.foods[i].x * RECT_SIZE
            // console.log('food.js--',i,this.foods[i].x)
            // console.log('food.js--',i,this.foods[i].y)
            let x = this.foods[i].x * RECT_UNIT
            // console.log(x)
            let y = this.foods[i].y * RECT_UNIT
            context.fillStyle = this.foods[i].color;
            context.fillRect(x, y, RECT_UNIT, RECT_UNIT)
            // console.log('food.js', this.foods[i].x)
            // console.log('food.js', this.foods[i].y)
        }

    }
}