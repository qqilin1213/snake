export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = '#000000'
    ctx.font = '30px Arial'

    ctx.fillText(
        score,
        10,
        30
    )
}

// 吃食物
foodScore() {
    wx.showToast({
        title: "+ 10 分",
        icon: 'succes',
        duration: 300
    })
}
}