<template>
  <el-container>
      <el-header height="50px">
        欢迎使用SCM后台管理系统
        <span>关于</span>
        <span>帮助</span>
      </el-header>
      <el-main height="">
        <div class="login">
          <p class="tit">登录</p>
          <el-input prefix-icon="el-icon-user" v-model="user.username" placeholder="请输入你的ID"></el-input>
          <el-input prefix-icon="el-icon-lock" v-model="user.password" type="password" placeholder="请输入密码"></el-input>
          <p class="restip">{{resp}}</p>
          <div>
            <template>
              <el-radio-group v-model="user.role">
                <el-radio label="member">工作人员</el-radio>
                <el-radio label="customer">客户</el-radio>
              </el-radio-group>
            </template>
          </div>
          <div>
            <el-checkbox v-model="rememberPass" label="记住密码"></el-checkbox>
            <span>忘记密码</span>
          </div>
            <el-button type="primary" @click="login">登录</el-button>
        </div>
      </el-main>
      <el-footer height="50px">
        版权所有 2019 鱼干拌饭
      </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      user: {
        username: '',
        password: '',
        role: 'member'
      },
      rememberPass: false,
      resp: ''
    }
  }, 
  methods: {
    login () {
      let time = new Date()
      this.$store.dispatch({
        type: 'login',
        user: this.user,
        time,
      }).then(
        data => {
          console.log(data)
          this.$router.push('/')
        }
      ).catch(
        err => {
          console.log(err)
          this.resp = err.message
        }
      )
    }
  }
}
</script>

<style lang="stylus", scoped>
.el-container
  background-color skyblue
  height 680px
.el-header
  background-color rgba(0, 0, 0, .3)
  width 100%
  line-height 50px
  color 454545
  span
    float right
    margin 0 5px
.el-main
  height 100%
  .login
    width 300px
    height 400px
    padding 20px
    text-align center
    margin auto
    background-color #FFF
    border-radius 10px
    box-shadow 0 0 15px 3px #fff
    .restip
      color red
      margin-top -10px 
      font-size 12px
    .tit
      font-size 30px
    span
      color #898989
      font-size 13px
    >>>.el-input__inner
      margin 10px 0
    >>>.el-checkbox__label
      margin-right 40px 
      margin-top 30px
    .el-button
      margin-top 20px
.el-footer
  width 100%
  position fixed
  bottom 0
  background-color #68AFD9
  line-height 50px
  color #676767
  text-align center
</style>