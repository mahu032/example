<template>
  <el-tabs class="main-tabs" type="border-card" :value="tabName" @tab-click='clickTab' @tab-remove="removeTab">
    <el-tab-pane class="main-tab-pane" v-for="(item, index) in tabList" :key="index" :label="item.title" :name="item.name" :closable="!!index">
      <slot :name='item.name'></slot>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  name: 'MyTabs',
  props: {
    tabList: { // tabs列表
      type: Array,
      required: true
    },
    tabName: { // 当前显示的tab名---必须唯一
      type: String,
      required: true,
      validator: function (value) { // 不能为空
        return !!value
      }
    },
    tabMax: { // tabs列表
      type: Number,
      default: 8,
      validator: function (value) { // 不能为0或者空
        return !!value
      }
    }
  },
  data() {
    return {
    }
  },
  created() {
    if (this.tabList[0]) { // 检测传入的tabList是否合格
      if (!this.tabList[0].title || !this.tabList[0].name || !this.tabList[0].content) {
        console.error('tabList的每一项必须为对象且必须包含title,name,content字段')
      }
    }
  },
  methods: {
    removeTab(name) { // 删除tab
      let index = this.tabList.findIndex(item => item.name === name)
      if (index > -1) { // 当index不为0时删除当前tabs
        if (name === this.tabName) {
          // 当前要删的tabs是激活的优先切换到下一个没有的话切换到上一个 触发切换tabs将name传给父组件
          this.$emit('cutTabs', this.tabList[index + 1] ? this.tabList[index + 1].name : this.tabList[index - 1].name)
        }
        this.tabList.splice(index, 1) // 删除当前tabs
      }
    },
    addTab(obj) { // 添加tab
      if (typeof obj !== 'object') {
        console.error('addTab的参数必须为对象')
        return
      }
      if (!obj.title || !obj.name || !obj.content) {
        console.error('对象必须包含title,name,content字段')
        return
      }
      if (this.tabList.find(item => item.name === obj.name)) { // 如果有同名tab切换到相同name的tab上
        let index = this.tabList.findIndex(item => item.name === obj.name)
        if (index > -1) {
          this.$emit('cutTabs', this.tabList[index].name)
        }
      } else if (this.tabList.length < this.tabMax) { // tab长度小于当前设置的长度
        obj.backName = this.tabName
        this.tabList.push(obj)
        this.$emit('cutTabs', obj.name)
      } else {
        // 如果tab已经满载 则切换到和添加的tab子项content相同的tab
        this.$message({
          message: '当前可编辑条目已达上限,请关闭其他条目后重试',
          type: 'warning'
        })
      }
    },
    clickTab(item) {
      // 点击切换tabs 触发切换tabs将name传给父组件
      this.$emit('cutTabs', item.name)
    }
  }
}
</script>
