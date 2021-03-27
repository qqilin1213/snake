/*
 * @Author: qqilin1213
 * @Date: 2021-03-19 16:13:48
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-03-22 10:43:39
 */
import Background from './runtime/background';
import Snake from './player/snake'
import Music from './runtime/music'
import GameInfo from './runtime/gameinfo'
// import Food from './npc/food';

const context = canvas.getContext('2d');

const WIN_WIDTH = window.innerWidth
const WIN_HIGHT = window.innerHeight

const snake = new Snake()
const music = new Music()
let gameInfo = new GameInfo()
const RECT_SIZE = 15;
const RECT_UNIT = WIN_WIDTH / RECT_SIZE;

let scores = [];
let id = snake.id;

let count = 0

// const food = new Food()


/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        this.init();
    }

    init() {
        let that = this
        Background.draw();
        wx.showModal({
            title: '请开始游戏',
            content: "每得" + snake.perSocre + "分,蛇身增长1 ",
            success: function (res) {
                if (res.confirm) {
                    return that.beginGame()
                } else {
                    return false
                }
            }
        });
    }

    beginGame() {
        Background.draw();
        this.initSnake();
        music.playBgm();
    }

    initGame() {
        snake.isOver = false
        snake.score = 0
        snake.eatCount = 0
        snake.moveSpeedLevel = 100
        // context.clearRect(0,0,WIN_WIDTH,WIN_HIGHT)
        snake.snakeBodys.length = 0;
        for (let i = 3; i >= 1; i--) {
            snake.snakeBodys.push({
                x: i,
                y: 3,
                w: RECT_UNIT,
                h: RECT_UNIT,
                color: "#8B0000",
                snakeMoveDirection: 'left'
            });
        }
        Background.draw();
        this.initSnake();
        music.playBgm();
    }

    initSnake() {
        snake.onBeforeDraw = () => {
            context.clearRect(0, 0, WIN_WIDTH, WIN_HIGHT);
            Background.draw();
        };
        this.start();
    }




    /**
     * 开始游戏
     */
    start() {
        let that = this
        if (snake.collisionCheck() && snake.isOver) {
            scores.push(snake.score)
            // console.log(scores)
            let maxScore = this.scoreSort(scores)
            let max = maxScore[0]
            // console.log('main.js --',maxScore)
            // console.log(max)
            wx.showModal({
                title: "总得分:" + snake.score + "分--------蛇身总长:" + snake.snakeBodys.length + "-------目前最高分 ----"+max + "分" +"",
                content: '游戏失败, 重新开始, 咱又是一条好🐍',
                success: function (res) {
                    console.log(res)
                    if (res.confirm) {
                        return that.initGame()
                    } else {
                        return false
                    }
                }
            })
        } else {
            setTimeout(() => {
                snake.move();
                snake.draw();
                gameInfo.renderGameScore(context, snake.score);
                this.start();
            }, snake.moveSpeedLevel * 5);
        }
    }

    // 排序
    scoreSort(arr) {
        var max = 0;
        //遍历数组，默认arr中的某一个元素为最大值，进行逐一比较
        for (let i = 0; i < arr.length; i++) {
            // console.log('main.js --', arr[i])
            //外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
            for (var j = i; j < arr.length; j++) {
                if (arr[i] < arr[j]) {
                    //如果arr[j]大就把此时的值赋值给最大值变量max
                    max = arr[j];
                    arr[j] = arr[i];
                    arr[i] = max;
                }
            }
        }
        return arr
    }
}