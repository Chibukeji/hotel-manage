<template>
    <div>
        <el-dialog :visible.sync="codeDialogVisible" title="安全码" width="500px">
            <el-form :model="delForm" :rules="delRules" ref="delForm" label-width="100px">
                <el-form-item label="安全码：" prop="safe_password">
                <el-input v-model="delForm.safe_password" style="width:300px" placeholder="请输入安全码"></el-input>
                </el-form-item>
            </el-form>
            <div class="pop-btn-box">
                <el-button type="primary" size="small " @click="delSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { setSafePwd } from '@/api/security-code'
import { isDefaultSafePassword} from '@/api/common'

    export default {
        data() {
            return {
                delForm:{
                    safe_password:''
                },
                delRules:{
                    safe_password: [
                        { required: true, message: '请输入安全码', trigger: 'blur' },
                    ],
                },
                flag:'',
                codeDialogVisible:false,
                detailItem:'',
            }
        },
        methods: {
            init(item){
                this.codeDialogVisible = true
                this.detailItem = item
                this.delForm.safe_password = ''
            },
            delSubmit() {
                this.$refs.delForm.validate((valid) => {
                    if (valid) {
                        let params={
                            safe_password:this.delForm.safe_password,
                            hotel_id:this.detailItem.id
                        }
                        setSafePwd(params).then(res=>{
                            if(res != undefined && res.code == 0){
                                this.$message({
                                    type: 'success',
                                    message: '提交成功'
                                })
                                this.codeDialogVisible = false
                                isDefaultSafePassword().then(res=>{
                                    this.$store.commit('user/SET_TOPMARKED',res.data)
                                })
                            }
                            
                        })
                    } else {
                        return false;
                    }
                });
               
            }
        },
    }
</script>
<style lang="scss" scoped>
.pop-btn-box{
    margin-left: 200px;
    margin-top: 30px;
}
</style>