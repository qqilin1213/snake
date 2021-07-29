```js
    |-game.js                                         // 游戏入口
    |-.DS_Store
    |-js\
    |    |-.DS_Store
    |    |-runtime\                                   
    |    |    |-background.js                         // 背景
    |    |    |-gameinfo.js                           // 用于展示分数和显示得分过程
    |    |    |-music.js                              // 背景音乐
    |    |-libs\
    |    |    |-symbol.js
    |    |    |-weapp-adapter.js                      // 小游戏适配器
    |    |-main.js                                    // 游戏入口主函数
    |    |-npc\
    |    |    |-food.js                               // 食物类
    |    |-player\
    |    |    |-control.js                            // 控制贪吃蛇类
    |    |    |-snake.js                              // 贪吃蛇类
    |-game.json
    |-project.config.json
    |-README.md
    |-audio\                                          // 背景音乐材料
    |    |-eat.mp3
    |    |-die.mp3
    |    |-bgm.mp3
```
# 改进

## 加入音乐

```js
export default class Music {
  constructor() {
    if (instance) return instance

    instance = this

    this.bgmAudio = new Audio()
    // 循环播放
    this.bgmAudio.loop = true
    this.bgmAudio.src = '/audio/bgm.mp3'

    // 吃食物
    this.eatAudio = new Audio()
    this.eatAudio.src = '/audio/eat.mp3'

    // 死亡
    this.dieAudio = new Audio()
    this.dieAudio.src = '/audio/die.mp3'

  }

  playBgm() {
    this.bgmAudio.play()
  }

  playEat() {
    this.eatAudio.currentTime = 0
    this.eatAudio.play()
  }

  playDie() {
    this.dieAudio.currentTime = 0
    this.dieAudio.play()
  }
}
```

## 速度加快

```js
                    if(this.eatCount % 6 == 0){
                        snakeBodys.moveSpeedLevel -= 20;
                    }
```

## 蛇撞击自身会死亡

```js
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
```



## 动态显示得分情况

```js
  renderGameScore(ctx, score) {
    ctx.fillStyle = '#000000'
    ctx.font = '30px Arial'

    ctx.fillText(
        score,
        10,
        30
    )
```

![截屏2021-03-25 下午12.40.36](/Users/qqilin1213/Typora/%E8%B4%AA%E5%90%83%E8%9B%87.assets/%E6%88%AA%E5%B1%8F2021-03-25%20%E4%B8%8B%E5%8D%8812.40.36.png)

## 简易排行榜

![截屏2021-03-25 下午12.40.36](/Users/qqilin1213/Desktop/%E6%88%AA%E5%B1%8F2021-03-25%20%E4%B8%8B%E5%8D%8812.40.36.png)

```js
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
            }, snake.moveSpeedLevel * 50);
        }
    }
```

# 错误

## 一. 无法生成食物

错误：

![截屏2021-03-24 下午2.21.59](/Users/qqilin1213/Desktop/%E6%88%AA%E5%B1%8F2021-03-24%20%E4%B8%8B%E5%8D%882.21.59.png)

解决：

```js
//错误            
for(let j=0;j<=foods.length;j++){  
            }
// 正确
for(let j=0;j<foods.length;j++){
            }
```

## 二. 食物生成位置不一致

错误：

![截屏2021-03-24 下午3.48.02](/Users/qqilin1213/Desktop/%E6%88%AA%E5%B1%8F2021-03-24%20%E4%B8%8B%E5%8D%883.48.02.png)

解决：在main 下又重新构建了一个food （食物对象），删掉mian下的food对象。

![截屏2021-03-24 下午4.02.14](/Users/qqilin1213/Desktop/%E6%88%AA%E5%B1%8F2021-03-24%20%E4%B8%8B%E5%8D%884.02.14.png)

## 三. 贪吃蛇吃食物问题（1）



![截屏2021-03-25 上午9.42.02](/Users/qqilin1213/Desktop/%E6%88%AA%E5%B1%8F2021-03-25%20%E4%B8%8A%E5%8D%889.42.02.png)

由于设置画布长宽为屏幕的大小，在分割成15列时，方格大小是个小数，在乘积的话，会存在小数，无法进行比较。

<video src="/Users/qqilin1213/Typora/%E8%B4%AA%E5%90%83%E8%9B%87.assets/%E5%90%83%E9%A3%9F%E7%89%A9%E9%97%AE%E9%A2%98%EF%BC%881%EF%BC%89.mov"></video>

解决：设置贪吃蛇和食物的位置，以方格数保存，绘制画布时再与方格大小做乘法，保证贪吃蛇可以碰到食物。

<video src="/Users/qqilin1213/Typora/%E8%B4%AA%E5%90%83%E8%9B%87.assets/%E8%B4%AA%E5%90%83%E8%9B%87%E9%94%99%E8%AF%AF2%E4%BF%AE%E6%AD%A3.mov"></video>

```js
// snake.js
// 蛇
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
            // 绘制蛇身
            this.context.fillRect(x * RECT_UNIT, y * RECT_UNIT, RECT_UNIT, RECT_UNIT)
            this.context.closePath();
        }
    }
```

```js
// food.js
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
            // 绘制食物
            context.fillRect(x, y, RECT_UNIT, RECT_UNIT)
            // console.log('food.js', this.foods[i].x)
            // console.log('food.js', this.foods[i].y)
        }

    }
```

## 三. 贪吃蛇吃食物问题（2）

当食物随机生成在一起时，无法一起吃，得分也只是加第一个吃到食物的分值

<video src="/Users/qqilin1213/Typora/%E8%B4%AA%E5%90%83%E8%9B%87.assets/%E5%90%83%E9%A3%9F%E7%89%A9%E9%97%AE%E9%A2%98%E4%BA%8C.mov"></video>

解决：将食物的位置存储在一个数组中，通过判断食物是否相邻，若相邻返回true，得分后再加1分

<video src="/Users/qqilin1213/Typora/%E8%B4%AA%E5%90%83%E8%9B%87.assets/%E5%90%83%E9%A3%9F%E7%89%A9%E9%97%AE%E9%A2%982%E8%A7%A3%E5%86%B3.mov"></video>

```js
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
                        console.log('相邻');
                        break;
                    }
                }
                else{
                    if(foodsInfo[i].y == foodsInfo[j].y ){
                        if(foodsInfo[i].x + 1 == foodsInfo[j].x ||foodsInfo[i].x -1 == foodsInfo[j].x ){
                            falg = true; //相邻
                            console.log('相邻');
                            break;
                        }
                    }
                }
            }
        }                
        return falg;
    }
```

## 三.  贪吃蛇死亡问题

<video src="/Users/qqilin1213/Typora/%E8%B4%AA%E5%90%83%E8%9B%87.assets/%E8%B4%AA%E5%90%83%E8%9B%87%E9%94%99%E8%AF%AF1.mp4"></video>

解决： 设置蛇的初始长度为3，这样一开始是无法撞击身体，只有当分数>1时，也就是身体长度大于四才能发生撞击。



```js
// snake.js
        // 蛇
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
```

```js
// snake.js   
     /**
     * 碰撞检测
     */
    collisionCheck() {
        let isOver = this.isOver;
        let snakeBodys = this.snakeBodys;
        let head = snakeBodys[0];
        let foods = food.foods;

        // 是否碰到画布边缘
        if (head.x >=  RECT_SIZE|| head.x  < 0 || head.y  < 0 || head.y >= L_UNIT) {
            music.playDie()
            this.isOver = true
            isOver = true
        } else {
            // 与食物发生碰撞
            for(let j=0;j<foods.length;j++){
                let id = this.id
                let food = foods[j]
                if(this.eatFood(head,food)){
                    // console.log('snake.js -- collisionCheck',food.x)
                    music.playEat();
                    this.score += 1;
                    wx.setStorage({
                        key:"score",
                        data: this.score
                      })
                    gameInfo.foodScore();
                    food.isEated = true
                    // console.log(this.score)
                }
                else {
                    food.isEated = false
                  }
            }

            // 与身体发生碰撞
            if(this.score >1){
                for(let i=1;i<snakeBodys.length;i++){
                    if(head.x === snakeBodys[i].x && head.y === snakeBodys[i].y){
                        music.playDie()
                        this.isOver = true
                        isOver = true
                    }
                }
            }
        }
        // console.log('sanke',isOver)
        return isOver;
    }
```

```js
// main.js
   /**
     * 开始游戏
     */
    start() {
        let that = this
        // 蛇是否死亡和碰撞检测 一起判断
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
            }, snake.moveSpeedLevel * 50);
        }
    }
    ```
