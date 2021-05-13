<template>
    <div>
        <el-cascader v-model="destination"  :props="belongRegoinProps" clearable placeholder="所属地" ></el-cascader>
    </div>
</template>

<script>
import { allAddressList } from '@/api/common'
    export default {
        props:{
            // destination:{
            //     required: true,
            //     type: Array
            // },
        },
        data() {
            return {
                belongRegoinProps: {
                    checkStrictly: true,
                    value:'code',
                    label:'name',
                    lazy: true,
                    lazyLoad: (node, resolve) => {
                        this.$nextTick(()=>{
                            this.getAreaForLazyLoad(node, resolve)
                        })
                    }
                },//级联框prop
                destination:[],
            }
        },
        computed: {
            // destination: {
            //     get() {
            //         return this.destination
            //     },
            //     set(val) {
            //         this.$emit('setDestination', val)
            //     }
            // }
        },
        mounted () {
            setInterval(function() {
                document.querySelectorAll(".el-cascader-node__label").forEach(el => {
                    el.onclick = function() {
                    if (this.previousElementSibling) this.previousElementSibling.click();
                    };
                });
            }, 1000);
        },
        methods: {
            getAreaForLazyLoad(node, resolve) {
                // console.log(node)
                const  level  = node.level
                if(level >= 4){
                    resolve()
                    return
                }
                let params = {
                code: node.value
                }
                let childProjects = []
                allAddressList(params).then(res => {
                    if (res.code == 0) {
                        // console.log(res)
                        childProjects = res.data.data
                        childProjects.map(item => {
                            item.leaf = level >= 3; //判断是否为末尾节点
                        })
                        resolve(childProjects)
                    }
                }).catch(err => { console.log(err) })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>