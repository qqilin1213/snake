let instance

/**
 * 统一的音效管理器
 */
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
