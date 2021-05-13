<template>
    <div>
        <el-dialog :visible.sync="configurationDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left" width="55%">
            <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="140px" style="width:80%;margin-bottom:50px">
                <!-- <el-form-item label="包销房成本" prop="underwriting_room_cost">
                    <el-input v-model="editForm.underwriting_room_cost"></el-input>
                </el-form-item>
                <el-form-item label="包销房数量" prop="underwriting_room_num">
                    <el-input v-model="editForm.underwriting_room_num" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item>
                <el-form-item label="尾房成本" prop="weifang_room_cost">
                    <el-input v-model="editForm.weifang_room_cost"></el-input>
                </el-form-item>
                <el-form-item label="尾房数量" prop="weifang_room_num">
                    <el-input v-model="editForm.weifang_room_num" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item> -->
                <el-form-item label="截止申请退款时间" prop="cancel_time">
                    <el-time-picker v-model="editForm.cancel_time" placeholder="选择时间"  value-format="HH:mm" format='HH:mm'></el-time-picker>
                </el-form-item>
            </el-form>
            <div  slot="footer" class="dialog-footer">
                <el-button size="small" @click="configurationDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getHotelEdit} from '@/api/hotel-manage/hotel-list'
    export default {
        data() {
            return {
                configurationDialogVisible: false,
                dialogTitle:'',
                list:'',
                editForm:{
                    // underwriting_room_cost:'',
                    // underwriting_room_num:'',
                    // weifang_room_cost:'',
                    // weifang_room_num:'',
                    cancel_time:'18:00'
                },
                rules:{
                    // underwriting_room_cost:[{ required: true, message: '请输入内容', trigger: 'blur' },
                    // { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字,可保留两位小数' }],
                    // weifang_room_cost:[{ required: true, message: '请输入内容', trigger: 'blur' },
                    // { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字,可保留两位小数' }],
                    cancel_time:[{ required: true, message: '请选择', trigger: 'change' },]
                }
            }
        },
        methods: {
            init(row) {
                this.configurationDialogVisible = true
                this.list = row
                this.editForm.cancel_time = row.cancel_time
                this.dialogTitle = row.title+'-酒店配置'
            },
            submitHandle(){
                if(this.editForm.cancel_time == null || this.editForm.cancel_time == ''){
                    this.$message({
                        type: 'warning',
                        message: '请选择免费取消订单时间!'
                    })
                    return
                }
                let params =  Object.assign(this.editForm,{id:this.list.id}) 
                getHotelEdit(params).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '编辑成功!'
                        })
                        this.configurationDialogVisible = false
                        this.$emit('successConfiguration')
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>