<template>
  <div class="view-box">
    <div class="view-box_con">
      <el-row>
        <el-col :md="12">
          <el-card class="card-box">
            <el-form :model="postData" :rules="editRule" ref="editForm" label-position="right" label-width="100px">
              <el-form-item label="来源平台" prop="platformCode" size="mini">
                <el-select v-model="postData.platformCode" placeholder="请选择来源平台" style="width:100%">
                  <el-option v-for="item in allPlatform" :label="item.name" :value="item.code" :key="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="积分计划" prop="planCode" size="mini">
                <el-select v-model="postData.planCode" placeholder="请选择积分计划" style="width:100%">
                  <el-option v-for="item in allPlan" :label="item.name" :value="item.code" :key="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="申请说明" size="mini" prop="note">
                <el-input type="textarea" :rows="2" placeholder="请输入申请说明" v-model="postData.note" />
              </el-form-item>
              <el-form-item label="批次号" prop="batch" size="mini">
                <el-input placeholder="请输入批次号" />
              </el-form-item>
              <el-form-item label="上传文件" size="mini" prop="fileName">
                <el-button type="primary" @click="upload">上传
                  <i class="el-icon-upload el-icon--right"></i>
                </el-button>
                {{postData.fileName}}
                <span class="el-icon-circle-close" v-show="postData.fileName" @click="postData.fileName=''"></span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="download">模板
                  <i class="el-icon-download"></i>
                </el-button>
                <el-button type="primary" @click="saveEdit">保存</el-button>
                <el-button @click="closeEdit">关闭</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      allPlan: [],
      allPlatform: [],
      postData: {
        fileName: ''
      },
      editRule: {
        platCode: [
          { required: true, message: '请选择来源平台', trigger: 'blur' }
        ],
        planCode: [
          { required: true, message: '请选择积分计划', trigger: 'blur' }
        ],
        note: [
          { required: true, message: '请输入申请说明', trigger: 'blur' }
        ],
        fileName: [
          { required: true, message: '请上传xls或xlsx格式的Excel文件' }
        ]
      }
    }
  },
  beforeMount() {
    this.input = document.createElement('input')
    this.input.type = 'file'
    this.getAllPlan()
    this.getAllPlatform()
  },
  methods: {
    getAllPlan() {
      axios.get('/api/adm/cent/plan', { params: { status: 'OPEN' } }).then(res => {
        if (res.data.code === '1') { // 筛选申请时间在计划有效期内的计划
          this.allPlan = res.data.data.rows.filter(item => new Date() <= new Date(item.planEndDate) && new Date() >= new Date(item.planStartDate)
          )
        }
      })
    },
    getAllPlatform() {
      axios.get('/api/adm/dict/platform', { params: { status: 'OPEN' } }).then(res => {
        if (res.data.code === '1') {
          this.allPlatform = res.data.data.rows
        }
      })
    },
    upload() {
      var that = this
      this.input.click()
      this.input.onchange = function change() {
        if (this.files && this.files.length) {
          const files = this.files
          if (/\.xlsx?$/.test(files[0].name)) {
            that.postData.fileName = files[0].name
            that.file = files[0]
          } else {
            that.$message.error('文件格式不合法,请选上传xls或xlsx格式的Excel文件')
          }
        }
      }
    },
    saveEdit() { // 保存编辑
      this.$refs.editForm.validate((valid) => {
        if (valid && !this.saving) {
          this.saving = true
          let formData = new FormData()
          formData.append('platformCode', this.postData.platformCode)
          formData.append('planCode', this.postData.planCode)
          formData.append('batch', this.postData.batch)
          formData.append('note', this.postData.note)
          formData.append('file', this.file)
          axios.post('/api/adm/cent/import/apply', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            if (res.data.code === '1') {
              this.$notify.success('保存成功')
              this.$emit('reload', { // 列表页请求新数据
                name: 'List',
                methods: ['tablesFetchList']
              })
              this.$emit('removeTab') // 关闭当前tab
            }
          }).finally(() => {
            this.saving = false
          })
        }
      })
    },
    closeEdit() {
      this.$emit('removeTab')
    },
    download() {
      location.href = '/template/cent_import_template.xls'
    }
  }
}
</script>
