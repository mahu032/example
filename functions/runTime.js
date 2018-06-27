// 限时优惠商品-1111
export default {
  data() {
    return {
      runTime: {
        fullH: '00', // 天数计算在内的小时
        h: '00', // 时
        m: '00', // 分
        s: '00', // 秒
        d: '00' // 天
      },
      endTime: '',
      isOver: false
    }
  },
  methods: {
    $_formatTime(t) {
      t /= 1000
      return {
        fullH: this.$_toTwo(Math.floor(t / 3600)),
        d: this.$_toTwo(Math.floor(t / 86400)),
        h: this.$_toTwo(Math.floor(t % 86400 / 3600)),
        m: this.$_toTwo(Math.floor(t % 86400 % 3600 / 60)),
        s: this.$_toTwo(Math.floor(t % 60))
      }
    },
    $_toTwo(t) {
      return t > 9 ? t : '0' + t
    },
    $_showRunTime(target = this) {
      if (target.endTime) {
        let _ms = target.endTime - new Date()
        // 倒计时结束
        if (_ms <= 0) {
          target.isOver = true
          target.runTime = {
            d: '00',
            h: '00',
            m: '00',
            s: '00',
            fullH: '00'
          }
        } else {
          // 倒计时运行
          target.runTime = this.$_formatTime(_ms)
          target.runTimer = setInterval(() => {
            if (target.endTime) {
              let ms = target.endTime - new Date()
              // 倒计时结束
              if (ms <= 0) {
                target.isOver = true
                clearInterval(target.runTimer)
                target.runTime = {
                  d: '00',
                  h: '00',
                  m: '00',
                  s: '00',
                  fullH: '00'
                }
              } else {
                // 倒计时运行
                target.runTime = this.$_formatTime(ms)
              }
            }
          }, 1000)
        }
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.runTimer)
  }
}

