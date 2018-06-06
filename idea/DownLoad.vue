<template>
<button @click="output">导出-接口调用方式</button>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
    }
  },
  methods: {
    output() {
      this.downloading = true
      this.downloadSuccess = false
      axios({
        method: 'get',
        responseType: 'blob',
        // 下载文件地址
        url: '/erp/api/pickup/export'
      }).then(res => {
        if (res.status === 200) {
          // 拿到文件名
          let name = res.headers['content-disposition'].split('"')[1]
          // 解析
          var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          // 创建a
          var downloadElement = document.createElement('a')
          var fileName = decodeURI(name)
          if ('download' in downloadElement) {
            // 创建下载的链接
            var href = window.URL.createObjectURL(blob)
            // 设置 a 的href
            downloadElement.href = href
            // 设置下载的文件名
            downloadElement.download = fileName
            document.body.appendChild(downloadElement)
            // 点击下载
            downloadElement.click()
            document.body.removeChild(downloadElement)
            // 释放掉blob对象
            window.URL.revokeObjectURL(href)
          } else if (navigator.msSaveBlob) {
            // navigator.msSaveOrOpenBlob 该方法为用户提供了“保存”和“打开”选项
            // 照顾下ie
            navigator.msSaveBlob(blob, fileName)
          }
          // 导出成功后重新捡货单列表商品-获取最新导出配送信息
          this.getData()
          // 下载成功可以生成捡货单
          this.downloadSuccess = true
        }
      }).finally(() => {
        this.downloading = false
      })
    }
  }
}
</script>
