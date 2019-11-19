<template>
  <div class="home">

    <el-container>
      <el-header height="90px">
        <img class="sysname" src="@/../public/img/loginlogo.png" alt="">
        <span class="curtime"><i class="el-icon-user-solid"></i> 当前登录：{{loginUser}}<i class="el-icon-time"></i>系统时间：{{ nowTime | date }}登录时间：{{loginTime | date}}</span>
      </el-header>

      <el-container>
        <el-aside width="200px">
            <!-- default-active="1-1" -->
          <el-menu
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            router
          >
            <el-collapse v-model="activeName" accordion>
              <span class="tit">管理系统</span>
              <el-collapse-item name="1">
                <template slot="title">
                  <i class="el-icon-monitor"></i>
                  <span>系统管理</span>
                </template>
                <el-menu-item @click="showUserList" index="/sys-manage/user-management">用户管理</el-menu-item>
                <el-menu-item @click="logout" index="/sys-manage/login">重新登录</el-menu-item>
                <el-menu-item @click="sysout" index="">退出系统</el-menu-item>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template slot="title">
                  <i class="el-icon-s-claim"></i>
                  <span>采购管理</span>
                </template>
                <el-menu-item index="/purchase/supplier">供应商管理</el-menu-item>
                <el-menu-item index="/purchase/add-purchase-note">新添采购单</el-menu-item>
                <el-menu-item index="/purchase/done-purchase-note">采购单了结</el-menu-item>
                <el-menu-item index="/purchase/purchase-query">采购单查询</el-menu-item>
              </el-collapse-item>
              <el-collapse-item name="3">
                <template slot="title">
                  <i class="el-icon-office-building"></i>
                  <span>仓库管理</span>
                </template>
                <el-menu-item index="/stock/in-stock">入库登记</el-menu-item>
                <el-menu-item index="/stock/out-stock">出库登记</el-menu-item>
                <el-menu-item index="/stock/stock-query">库存查询</el-menu-item>
                <el-menu-item index="/stock/check-stock">库存盘点</el-menu-item>
              </el-collapse-item>
              <el-collapse-item name="4">
                <template slot="title">
                  <i class="el-icon-s-check"></i>
                  <span>财务收支</span>
                </template>
                <el-menu-item index="/finance/receipt">收款登记</el-menu-item>
                <el-menu-item index="/finance/pay">付款登记</el-menu-item>
                <el-menu-item index="/finance/finance-query">收支查询</el-menu-item>
              </el-collapse-item>
              <el-collapse-item name="5">
                <template slot="title">
                  <i class="el-icon-s-order"></i>
                  <span>销售管理</span>
                </template>
                <el-menu-item index="/sell-manage/product-category-manage">产品分类管理</el-menu-item>
                <el-menu-item index="/sell-manage/product-manage">产品管理</el-menu-item>
                <el-menu-item index="/sell-manage/customer">客户管理</el-menu-item>
                <el-menu-item index="/sell-manage/add-somain">新添销售单</el-menu-item>
                <el-menu-item index="/sell-manage/somain-end">销售单了结</el-menu-item>
                <el-menu-item index="/sell-manage/somain-query">销售单查询</el-menu-item>
              </el-collapse-item>
              <el-collapse-item name="6">
                <template slot="title">
                  <i class="el-icon-s-marketing"></i>
                  <span>业务表报</span>
                </template>
                <el-menu-item index="/report/pomain-report">月度采购报表</el-menu-item>
                <el-menu-item index="/report/payment-report">月度收支登记表</el-menu-item>
                <el-menu-item index="/report/instock-report">月度入库报表</el-menu-item>
                <el-menu-item index="/report/outstock-report">月度出库报表</el-menu-item>
                <el-menu-item index="/report/stock-report">月度库存报表</el-menu-item>
                <el-menu-item index="/report/somain-report">月度销售报表</el-menu-item>
              </el-collapse-item>
              <!-- <el-collapse-item title="网上销售" name="7">
                <el-menu-item index="7-1">客户注册</el-menu-item>
                <el-menu-item index="7-2">商品展示</el-menu-item>
                <el-menu-item index="7-3">网上下单</el-menu-item>
              </el-collapse-item> -->
            </el-collapse>
          </el-menu>
        </el-aside>

        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: `/${part}/${tit}` }">{{ part | partFilter }}</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: `/${part}/${tit}` }">{{ tit | titFilter }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="thid" :to="{ path: `/${part}/${tit}/${thid}` }">{{ thid | thidFilter }}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- 退出系统对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="logoutDialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>确认退出系统，并关闭窗口吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSysOut">确 定</el-button>
      </span>
    </el-dialog>
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
      userList: [],
      logoutDialogVisible: false,
      part: '',
      tit: '',
      thid: ''
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
    },
    partFilter (val) {
      if (val == 'purchase') {
        return '采购管理'
      } else if (val == 'sys-manage') {
        return '系统管理'
      } else if (val == 'sell-manage') {
        return '销售管理'
      } else if (val == 'finance') {
        return '财务收支'
      } else if (val == 'stock') {
        return '仓库管理'
      } else if (val == 'report') {
        return '业务报表'
      }
    },
    titFilter (val) {
      if (val == 'user-management') {
        return '用户管理'
      } else if (val == 'supplier') {
        return '供应商管理'
      } else if (val == 'add-purchase-note') {
        return '新添采购单'
      } else if (val == 'product-category-manage') {
        return '产品分类管理'
      } else if (val == 'product-manage') {
        return '产品管理'
      } else if (val == 'done-purchase-note') {
        return '采购单了结'
      } else if (val == 'purchase-query') {
        return '采购单查询'
      } else if (val == 'in-stock') {
        return '入库登记'
      } else if (val == 'out-stock') {
        return '出库登记'
      } else if (val == 'pay') {
        return '支付登记'
      } else if (val == 'customer') {
        return '客户管理'
      } else if (val == 'add-somain') {
        return '新添销售单'
      } else if (val == 'receipt') {
        return '收款登记'
      } else if (val =='stock-query') {
        return '库存查询'
      } else if (val == 'check-stock') {
        return '库存盘点'
      } else if (val == 'finance-query') {
        return '收支查询'
      } else if (val == 'somain-query') {
        return '销售单查询'
      } else if (val == 'payment-report') {
        return '月度收支登记'
      } else if (val == 'instock-report') {
        return '月度入库报表'
      } else if (val == 'outstock-report') {
        return '月度出库报表'
      } else if (val == 'stock-report') {
        return '月度库存报表'
      } else if (val == 'somain-report') {
        return '月度销售报表'
      }
    },
    thidFilter (val) {
      if (val == 'add-note') {
        return '采购单明细'
      } else if (val == 'add-somain-note') {
        return '添加销售单明细'
      }
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
      this.$store.dispatch({
        type: 'getUserList'
      }).then(
        data => this.userList = data
      ).catch(
        err => console.log(err)
      )
    },
    logout () {
      axios({
        method: 'GET',
        url: '/api/sys/logout'
      }).then(
        resp => {
          console.log(resp)
        }
      )
    },
    sysout () {
      this.logoutDialogVisible = true
    },
    confirmSysOut () {
      this.logout()
      this.logoutDialogVisible = false
      window.opener = null
      location.href = 'about:blank'
      window.close()
    },
  },
  computed: {
    ...mapState(['loginUser', 'loginTime'])
  },
  created () {
    this.getTime()
  },
  watch: {
    $route: {
      handler () {
        this.part = this.$route.path.split('/')[1]
        this.tit = this.$route.path.split('/')[2]
        this.thid = this.$route.path.split('/')[3]
        console.log(this.part, this.tit);
        if (this.part == 'sys-manage') {
          this.activeName = '1'
        } else if (this.part == 'purchase') {
          this.activeName = '2'
        } else if (this.part == 'stock') {
          this.activeName = '3'
        } else if (this.part == 'finance') {
          this.activeName = '4'
        } else if (this.part == 'sell-manage') {
          this.activeName = '5'
        } else if (this.part == 'report') {
          this.activeName = '6'
        }
      },
      immediate: true
    }
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
