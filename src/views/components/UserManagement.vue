<template>
  <div>
    <!-- 添加用户 -->
    <el-button 
      class="addUser"
      type="primary" 
      @click="prevAddUser" 
      size="small">
      创建用户
    </el-button>

    <!-- 用户列表 -->
    <el-table
      :data="userList"
      style="width: 95%"
      size="mini"
      border
      v-loading="loading"
      max-height="850">
      <el-table-column
        label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="account"
        label="用户账号"
        width="130">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="90">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建日期"
        width="140">
      </el-table-column>
      <el-table-column
        label="锁定状态"
        width="120">
        <template slot-scope="scope">
          {{scope.row.status ? '锁定' : '未锁定'}}
        </template>
      </el-table-column>
      <el-table-column
        label="用户权限列表"
        width="400">
        <template
          slot-scope="scope">
          {{scope.row.models.map(item => item.modelName).toString()}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        class="cmondBtn">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="showDialog(scope.$index, userList)"
            type="primary"
            size="mini">
            修改
          </el-button>
          <el-button
            @click.native.prevent="deleteUser(scope.row)"
            type="danger"
            size="mini">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改与添加框 -->
    <el-dialog :title="dialogMsg" :visible.sync="dialogFormVisible">
      <el-form size="mini" :model="user" :inline="true" class="demo-form-inline">
        <el-form-item label="用户账号" label-width="80px">
          <el-input v-model="user.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="80px">
          <el-input v-model="user.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="user.passWord" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item :label="creOrUpdMsg" label-width="80px">
          <el-input v-model="user.createDate" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="锁定状态" prop="resource">
          <el-radio-group v-model="user.status">
            <el-radio :label="0">不锁定</el-radio>
            <el-radio :label="1">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户权限" prop="type">
          <el-checkbox-group v-model="user.modelcodes">
            <el-checkbox :label="1" name="type">采购管理</el-checkbox>
            <el-checkbox :label="2" name="type">销售管理</el-checkbox>
            <el-checkbox :label="3" name="type">系统管理</el-checkbox>
            <el-checkbox :label="4" name="type">财务管理</el-checkbox>
            <el-checkbox :label="5" name="type">仓库管理</el-checkbox>
            <el-checkbox :label="6" name="type">业务管理</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>{{titMsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'querystring'
export default {
  data () {
    return {
      dialogFormVisible: false,
      centerDialogVisible: false,
      loading: true,
      titMsg: '',
      creOrUpdMsg: '',
      dialogMsg: '',
      updateURL: '',
      total: 0,
      user: {
        account: '',
        name: '',
        passWord: '',
        createDate: '',
        status: 0,
        modelcodes: []
      },
      page: 1
    }
  },
  computed: {
    ...mapState(['userList'])
  },
  mounted () {
    this.$store.dispatch({
      type: 'getUserList'
    }).then(
      data => {
        this.total = data.total
        this.loading = false
      }
    ).catch(
      resp => {
        const result = resp.data
        if (result.code !== 2) {
          this.centerDialogVisible = true
          this.titMsg = result.message+'， 3秒后跳转登录页面'
          setTimeout(() => {
            this.$router.push('/sys-manage/login')
          }, 3000);
        }
      }
    )
  },
  methods: {
    pageChange (page) {
      this.loading = true
      this.page = page
      this.$store.dispatch({
        type: 'getUserList',
        page
      }).then(
        data => {
          this.loading = false
        }
      )
    },
    setNowTime() {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth()+1
      let d = date.getDate()
      let h = date.getHours()
      let mm = date.getMinutes()
      let s = date.getSeconds()
      return `${y}-${m < 10 ? '0'+m : m}-${d < 10 ? '0'+d : d} ${h < 10 ? '0'+h : h}:${mm < 10 ? '0'+mm : mm}:${s < 10 ? '0'+s : s}`
    },
    showDialog (index, data) {
      this.dialogMsg = '修改用户信息'
      this.creOrUpdMsg = '修改时间'
      const respUser = data[index]
      this.user.modelcodes = respUser.models.reduce((prev, cur) => prev.concat(cur.modelCode), [])
      this.user.account = respUser.account
      this.user.name = respUser.name
      this.user.passWord = respUser.passWord
      this.user.status = respUser.status
      this.user.createDate = this.setNowTime()
      this.dialogFormVisible = true
      this.updateURL = 'api/main/system/user/update'
    },
    updateUser () {
      if (this.user.account == '' || this.user.name == '') {
        this.centerDialogVisible = true
        this.titMsg = '用户名和名字不能为空'
      } else if (this.user.modelcodes.length == 0) {
        this.centerDialogVisible = true
        this.titMsg = '用户权限不能为空'
      } else {
        if (this.user.passWord == '') {
          this.user.passWord = this.user.account
          this.centerDialogVisible = true
          this.titMsg = '您的密码没有填写，默认与用户名一致'
        }
        this.loading = true
        this.dialogFormVisible = false
        axios({
          url: this.updateURL,
          method: 'POST',
          data: qs.stringify(this.user)
        }).then(resp => {
          const result = resp.data
          if (result.code === 2) {
            this.centerDialogVisible = true
            this.titMsg = result.message
            this.$store.dispatch({
              type: 'getUserList',
              page: this.page
            }).then(
              data => {
                console.log(data)
                this.loading = false
              }
            )
            this.initData()
          } else {
            this.loading = false
            this.centerDialogVisible = true
            this.titMsg = result.message
          }
          
        })
      }
    },
    deleteUser ({account}) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        axios({
          method: 'POST',
          url: 'api/main/system/user/delete',
          data: qs.stringify({
            account,
          })
        }).then(resp => {
          const result = resp.data
          if (result.code === 2) {
            this.$message({
              type: 'success',
              message: result.message
            })
            this.$store.dispatch({
              type: 'getUserList'
            }).then(data => {
              this.loading = false
            })
          } else {
            this.loading = false
            this.$message({
              type: 'info',
              message: result.message
            })
          }
        }).catch(err => console.log(err))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    prevAddUser () {
      this.dialogMsg = '创建新用户'
      this.creOrUpdMsg = '创建时间'
      this.isAddOrUpdate = this.addUser
      this.dialogFormVisible = true
      this.user.createDate = this.setNowTime()
      this.updateURL = 'api/main/system/user/add'
    },
    // 初始化数据
    initData () {
      this.user.account= ''
      this.user.name= ''
      this.user.passWord= ''
      this.user.createDate= ''
      this.user.status= -1
      this.user.modelcodes= []
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-table
  margin-left 20px
.addUser
  margin-left: 20px
</style>