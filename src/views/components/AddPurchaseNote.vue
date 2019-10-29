<template>
  <div>
    <!-- 添加采购单 -->
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-button 
          class="addUser"
          type="primary" 
          @click="addPurchase" 
          style="margin: 0 20px"
          size="small">
          添加采购单
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 采购单列表 -->
    <!-- <el-table
      :data="PuraseList"
      style="width: 93%"
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
        v-for="col in PurchaseColumns" :key="col.id"
        :prop="col.id"
        :label="col.label"
        :width="col.width">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        class="cmondBtn">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="showDialog(scope.$index, SupplierListData)"
            type="primary"
            size="mini">
            修改
          </el-button>
          <el-button
            @click.native.prevent="deleteSupplier(scope.$index, SupplierListData)"
            type="danger"
            size="mini">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table> -->
  
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total">
    </el-pagination>

    <!-- 新添采购单 -->
    <!-- <el-dialog :title="dialogMsg" :visible.sync="dialogFormVisible" class="add-supplier">
      <el-form size="mini" :model="supplierForm" :rules="supplierRules" :inline="true" class="demo-form-inline">
        <el-form-item label="供应商编号" label-width="95px" prop="venderCode">
          <el-input v-model="supplierForm.venderCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" label-width="95px" prop="name">
          <el-input v-model="supplierForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="95px">
          <el-input v-model="supplierForm.passWord" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="联系人" label-width="95px" prop="contactor">
          <el-input v-model="supplierForm.contactor" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="地址" label-width="95px" prop="address">
          <el-input v-model="supplierForm.address" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" label-width="95px">
          <el-input v-model="supplierForm.postCode" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item :label="creOrUpdMsg" label-width="95px">
          <el-input v-model="supplierForm.createDate" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="95px" prop="tel">
          <el-input v-model="supplierForm.tel" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="传真" label-width="95px">
          <el-input v-model="supplierForm.fax" autocomplete="off" type="text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSupplier">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'querystring'
export default {
  data () {
    return {
      dialogMsg: '新添采购单',
      dialogFormVisible: false,
      total: 0,
      loading: true,
      PuraseList: [],
      PurchaseColumns: [
        { id: 'venderCode', label: '采购单编号', width: 85 },
        { id: 'name', label: '创建时间', width: 90 },
        { id: 'contactor', label: '供应商名称', width: 90 },
        { id: 'address', label: '创建用户', width: 85 },
        { id: 'postCode', label: '附加费用', width: 85 },
        { id: 'createDate', label: '采购产品总价', width: 100 },
        { id: 'tel', label: '采购单总价格', width: 120 },
        { id: 'fax', label: '付款方式', width: 90 },
        { id: 'faxx', label: '最低预付款金额', width: 110 }
      ],
      puraseForm: {
        poId: -1,
        venderCode: '',
        account: '',
        createTime: '',
        tipFee: -1,
        productTotal: -1,
        poTotalpayType: -1,
        prePayFee: -1,
        status: -1,
        remark: '',
        poitems: [
          {
            productCode: '',
            unitPrice: -1,
            num: -1,
            unitName: '',
            itemPrice: -1
          }
        ]
      }
    }
  },
  methods: {
    // 新添采购单
    addPurchase () {
      console.log('新添采购单')
      
    },
    // 获取采购单
    getPuraseList (type = 1) {
      axios({
        method: 'GET',
        url: '/api/main/purchase/pomain/show',
        params: {
          type,
        }
      }).then(
        resp => {
          console.log(resp.data)
          if (resp.data.list) {
            this.puraseList = resp.data.list
            this.loading = false
            this.total = resp.data.total
          }
        }
      )
    },
    // 分页
    pageChange (page) {
      console.log('当前页码', page)
      
    }
  },
  created () {
    this.getPuraseList ()
  }
}
</script>

<style lang="stylus" scoped>
.el-table
  margin-left 20px
</style>