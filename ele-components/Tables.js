// Vue对象数据结构要求

// data  tables 表单对象
// {
//   loading: false,  //loading 状态
//   form: {  //表单对象
//     ...
//     orderBy: '', //查询key
//     sort: '',    //排序方式 ascending descending
//     offset: 0,   //偏移值
//     limit: 10    //每页条数
//   },
//   data: null,    //返回的数组对象
//   page: {        //分页对象
//     index: 1//当前页,
//     total: 1//总页数
//     sizes: [10, 20, 50],  //页数 数组
//   }
// }

import axios from 'axios'
import qs from 'qs'
import CODE_SUCCESS from '@/constants/response-code'
export default {
  data() {
    return {
      tables: {
        form: {
          keyword: '',
          offset: 0,
          limit: 10
        },
        data: [],
        loading: false,
        page: {
          total: 0,
          index: 1,
          sizes: [10, 20, 50]
        },
        auto: true
      }
    }
  },
  created() {
    // 默认请求数据
    if (this.tables.auto) {
      this.tablesFetchList()
    }
  },
  methods: {
    tableReset() {
      if (this.queryDate) {
        this.queryDate = ''
      }
      try {
        let form = this.tables.form
        let ignores = ['offset', 'limit']
        for (let key in form) {
          if (form.hasOwnProperty(key) && ignores.indexOf(key) === -1) {
            form[key] = ''
          }
        }
      } catch (e) {
        console.error(this.tables.form)
      }
    },
    // 表单submit 事件响应
    tableSearchHandler() {
      this.tables.form.offset = 0
      this.tables.page.index = 1
      this.tablesFetchList()
    },
    tablesSortChangeHandler({
      column,
      prop,
      order
    }) {
      // table 绑定  @sort-change
      // column 绑定 sortable="custom"
      // 不改变当前页
      // this.tables.page.index = 1
      // this.tables.form.offset = 0
      this.tables.form.orderBy = prop
      switch (order) {
        case 'ascending':
          this.tables.form.sort = 'ASC'
          break
        case 'descending':
          this.tables.form.sort = 'DESC'
          break
      }
      this.tablesFetchList()
    },
    // 获取列表
    tablesFetchList() {
      this.tables.loading = true
      return axios
        .get(this.tables.api, {
          params: this.tables.form
        })
        .then(res => {
          if (res.data.code === CODE_SUCCESS) {
            this.tables.page.total = res.data.data.total
            this.tables.data = res.data.data.rows
          }
        })
        .finally(() => {
          this.tables.loading = false
        })
    },
    // 序号
    tablesDefineIndex(index) {
      return index + 1 + (this.tables.page.index - 1) * this.tables.form.limit
    },
    // 切换当前页页数
    tablesHandleCurrentPage(val) {
      this.tables.page.index = val
      this.tables.form.offset = --val * this.tables.form.limit
      this.tablesFetchList()
    },
    // 切换分页数量
    tablesHandleSizeChange(val) {
      this.tables.form.limit = val
      // this.tables.form.offset = 0
      this.tables.form.offset = val * this.tables.page.index
      this.tablesFetchList()
    },
    tablesExportExcel(api, _qs = qs.stringify(this.tables.form)) {
      const downloadFrame = document.getElementById('downloadFrame')
      const timestamp = new Date().getTime()
      if (downloadFrame && downloadFrame.nodeName.toUpperCase() === 'IFRAME') {
        downloadFrame.src = `${api}?${_qs}&_=${timestamp}`
      } else {
        let iframe = document.createElement('iframe')
        iframe.id = 'downloadFrame'
        iframe.src = `${api}?${_qs}&_=${timestamp}`
        iframe.style.display = 'none'
        iframe.frameborder = 0
        document.body.appendChild(iframe)
      }
    }
  }
}
