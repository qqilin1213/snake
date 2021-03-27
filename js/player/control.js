/*
 * @Author: qqilin1213
 * @Date: 2021-03-21 13:18:35
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-03-23 13:14:43
 */


// 手指开始位置
var startX = 0;
var startY = 0;

// 手指移动路径 
var moveX = 0;
var moveY = 0;

// 差值
var diffX = 0;
var diffY = 0;

let snakeMoveDirection = 'right'


export default class Control {
  constructor() {
    this.initEvents();
  }
  initEvents() {
    wx.onTouchStart(function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    })
    wx.onTouchMove(function (e) {
      moveX = e.touches[0].clientX;
      moveY = e.touches[0].clientY;
    
      diffX = moveX - startX;
      diffY = moveY - startY;
      if (Math.abs(diffX) > Math.abs(diffY) && diffX > 0 && !(snakeMoveDirection == 'left')) {
        //  向右
        snakeMoveDirection = 'right';
        // console.log("向右"); 
      } else if (Math.abs(diffX) > Math.abs(diffY) && diffX < 0 && !(snakeMoveDirection == 'right')) {
        //  向左
        snakeMoveDirection = 'left';
        // console.log("向左");
      } else if (Math.abs(diffX) < Math.abs(diffY) && diffY > 0 && !(snakeMoveDirection == 'top')) {
        //  向下
        snakeMoveDirection = 'bottom';
        // console.log("向下");
      } else if (Math.abs(diffX) < Math.abs(diffY) && diffY < 0 && !(snakeMoveDirection == 'bottom')) {
        //  向上
        snakeMoveDirection = 'top';
        // console.log("向上");
      }
    })
    // console.log(snakeMoveDirection)
    return snakeMoveDirection
  }
}