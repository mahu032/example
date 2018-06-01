// Vue对象 数据格式要求

// data中  tabName 当前选中tabName tabDefaultName 默认返回的tabName
// ref 中  tab   MyTabs对象引用
export default {
  methods: {
    // 切换tab
    myTabsSwitch(name) {
      // 设置当前显示的tab
      this.tabName = name
    },
    // 添加tab
    myTabsAdd(obj) {
      // 如果需要数据请添加data字段
      this.$refs.tab.addTab(obj)
    },
    // 移除tab
    myTabsRemove(name) {
      // 删除name tab
      if (name) {
        this.$refs.tab.removeTab(name)
      } else {
        this.$refs.tab.removeTab(this.tabName)
      }
    },
    // 返回默认tab
    myTabsBack(flag) {
      // 传true 则返回这个tab 是从那个tab打开生成的
      if (flag === true) {
        let subTab = this.tabList.find(item => item.name === this.tabName)
        if (subTab && subTab.backName) {
          this.tabName = subTab.backName
        }
        return
      }
      this.tabName = this.tabList[0].name
    },
    myTabsReload(reloadObj) {
      // reloadObj: {
      //   name: '',需要reload的tab
      //   methods: [需要执行的方法数组
      //     {
      //       method: '',方法名
      //       params: ''请求参数也可以是新数据
      //     }
      //   ]
      // }
      // 重新加载组件数据
      if (reloadObj && reloadObj.name) {
        var component = this.$refs[reloadObj.name] && this.$refs[reloadObj.name][0]
        reloadObj.methods.forEach(item => {
          if (component) {
            if (typeof component[item] === 'function') {
              component[item]()
            } else if (typeof component[item.method] === 'function') {
              component[item.method](item.params)
            }
          }
        })
        if (!component) {
          console.error('没有找到你要reload的tab')
        }
      } else {
        console.warn('reloadObj不合格,{name:您要reload的tabName, methods:您要触发的方法数组 }')
      }
    }
  }
}
