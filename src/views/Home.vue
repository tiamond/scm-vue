<template>
  <div class="home">

    <el-container>
      <el-header height="100px">
        <img class="sysname" src="@/../public/img/loginlogo.png" alt="">
        <span class="curtime"><i class="el-icon-user-solid"></i> 当前登录：{{loginUser}}<i class="el-icon-time"></i>系统时间：{{ nowTime | date }}登录时间：{{loginTime | date}}</span>
          
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu
            default-active="1-1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            router
          >
            <el-collapse v-model="activeName" accordion>
              <span class="tit">SCM管理系统</span>
              <el-collapse-item title="系统管理" name="1">
                <el-menu-item @click="showUserList" index="/user-management">用户管理</el-menu-item>
                <el-menu-item index="/login">重新登录</el-menu-item>
                <el-menu-item index="/login">退出系统</el-menu-item>
              </el-collapse-item>
              <el-collapse-item title="采购管理" name="2">
                <el-menu-item index="/supplier">供应商管理</el-menu-item>
                <el-menu-item index="/add-purchase-note">新添采购单</el-menu-item>
                <el-menu-item index="/done-purchase-note">采购单了结</el-menu-item>
                <el-menu-item index="2-4">采购单查询</el-menu-item>
              </el-collapse-item>
              <el-collapse-item title="仓库管理" name="3">
                <el-menu-item index="3-1">入库登记</el-menu-item>
                <el-menu-item index="3-2">出库登记</el-menu-item>
                <el-menu-item index="3-3">库存查询</el-menu-item>
                <el-menu-item index="3-4">库存盘点</el-menu-item>
              </el-collapse-item>
              <el-collapse-item title="财务收支" name="4">
                <el-menu-item index="4-1">收款登记</el-menu-item>
                <el-menu-item index="4-2">付款登记</el-menu-item>
                <el-menu-item index="4-3">收支查询</el-menu-item>
              </el-collapse-item>
              <el-collapse-item title="销售管理" name="5">
                <el-menu-item index="5-1">产品分类管理</el-menu-item>
                <el-menu-item index="5-2">产品管理</el-menu-item>
                <el-menu-item index="5-3">客户管理</el-menu-item>
                <el-menu-item index="5-4">新添销售单</el-menu-item>
                <el-menu-item index="5-5">销售单了结</el-menu-item>
                <el-menu-item index="5-6">销售单查询</el-menu-item>
              </el-collapse-item>
              <el-collapse-item title="业务表报" name="6">
                <el-menu-item index="6-1">月度采购报表</el-menu-item>
                <el-menu-item index="6-2">月度收支登记表</el-menu-item>
                <el-menu-item index="6-3">月度入库报表</el-menu-item>
                <el-menu-item index="6-4">月度出库报表</el-menu-item>
                <el-menu-item index="6-5">月度库存报表</el-menu-item>
                <el-menu-item index="6-6">月度销售报表</el-menu-item>
              </el-collapse-item>
              <el-collapse-item title="网上销售" name="7">
                <el-menu-item index="7-1">客户注册</el-menu-item>
                <el-menu-item index="7-2">商品展示</el-menu-item>
                <el-menu-item index="7-3">网上下单</el-menu-item>
              </el-collapse-item>
            </el-collapse>
          </el-menu>
        </el-aside>

        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item, index) in pathList" :key="index">
              {{ item }}
            </el-breadcrumb-item>
            
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import Cookie from 'js-cookie'
import {mapState} from 'vuex'
export default {
  name: 'home',
  data() {
    return {
      activeName: '1',
      nowTime: '',
      pathList: ['首页', '用户管理'],
      userList: []
    }
  },
  filters: {
    date (value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let m = date.getMonth()+1
      let d = date.getDate()
      let h = date.getHours()
      let mm = date.getMinutes()
      let s = date.getSeconds()
      return `${y}-${m < 10 ? '0'+m : m}-${d < 10 ? '0'+d : d} ${h < 10 ? '0'+h : h}:${mm < 10 ? '0'+mm : mm}:${s < 10 ? '0'+s : s}`
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    getTime () {
      setTimeout(this.getTime, 1000)
      this.nowTime = new Date()
    },
    showUserList () {
      this.pathList = ['首页', '用户管理']
      this.$store.dispatch({
        type: 'getUserList'
      }).then(
        data => this.userList = data
      ).catch(
        err => console.log(err)
      )
    }
  },
  computed: {
    ...mapState(['loginUser', 'loginTime'])
  },
  created () {
    this.getTime()
  }
}
</script>

<style lang="stylus" scoped>
.el-header
  background-color #056C9E
  .sysname
    margin-top 15px 
  .curtime
    float right
    padding 3px 10px
    height 30px
    line-height 30px
    margin-top 50px
    border-radius 5px
    background-color rgba(200, 200, 200, .6)
.tit
  width 100%
  display inline-block
  background-color #4098CA
  height 40px
  line-height 40px
  color #fff
  font-size 22px
  text-align center
  margin-top -2px
.el-aside
  height 600px
>>>.el-collapse-item__header
  background-color #D4E7F0
  height 40px
  color #333
  font-weight 700
  padding-left 15px 
>>>.el-collapse-item__content
  padding 0
.el-menu-item
  height 30px
  line-height 30px
  padding-left 30px !important 
.el-main
  padding 0
  .el-breadcrumb
    height 40px
    line-height 40px
    background-color #EDF6FA
</style>
