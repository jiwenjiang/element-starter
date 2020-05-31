<template>
    <div id="app">
        <!--        <div style="height: 800px"></div>-->
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label-width="0" prop="rows">
                <el-table
                        :data="form.rows"
                        style="width: 100%;margin-bottom: 20px;"
                        row-key="customIndex"
                        border
                        default-expand-all
                        ref="table"
                        @expand-change="calcBottom"
                        :tree-props="{children: 'children'}">
                    <el-table-column
                            prop="customIndex"
                            label="序号"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="日期"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            sortable
                            width="180">
                        <template v-slot="{$index, row}">
                                                      {{`rows${getPathByKey(row.customIndex,"customIndex",form.rows)}.name`}}
                            <el-form-item label-width="0" :rules="rules.name"
                                          :prop="`${row.customIndex!=='tempIndex'?`rows${getPathByKey(row.customIndex,'customIndex',form.rows)}.name`:''}`">
                                <el-input v-model="row.name"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址">
                        <template v-slot="{$index, row}">
                            <!--                          {{`rows${getPathByKey(row.customIndex,"customIndex",form.rows)}.name`}}-->
                            <el-form-item label-width="0" :rules="rules.address"
                                          :prop="`${row.customIndex!=='tempIndex'?`rows${getPathByKey(row.customIndex,'customIndex',form.rows)}.address`:''}`">
                                <el-input v-model="row.address"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="删除">
                        <template slot-scope="scope">
                            <el-button @click="add(form.rows,scope.row.customIndex)">add</el-button>
                            <el-button @click="handleDelete(form.rows,scope.row.customIndex)">delete</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <el-button @click="print">print</el-button>
        <div style="height: 500px"></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    rows: []
                },
                testData: [
                    {
                        name: "a",
                        children: [
                            {name: "b", children: [{name: "e"}]},
                            {name: "c", children: [{name: "f"}]},
                            {name: "d", children: [{name: "g"}]}
                        ]
                    },
                    {
                        name: "a2",
                        children: [
                            {name: "b2", children: [{name: "e2"}]},
                            {name: "c2", children: [{name: "f2"}]},
                            {name: "d2", children: [{name: "g2"}]}
                        ]
                    }
                ],
                rules: {
                    name: [
                        {required: true, message: "请输入名称", trigger: "blur"}
                    ],
                    address: [
                        {required: true, message: "请输入地址", trigger: "blur"}
                    ]
                },
                positionType: true
            }
        },
        methods: {
            print() {
                // this.setIndex(this.form.rows)
                // this.findPar(this.form.rows, "2")
                // console.log(677, this.getPathByKey("3.2.2", "customIndex", this.form.rows))
                console.log(this.form.rows)
                this.$refs.form.validate((valid, err) => {
                    console.log("valid", valid, err)
                })
            },
            handleDelete(arr, r) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].customIndex == r) {
                        arr.splice(i, 1)
                        return
                    }
                    if (arr[i].children && arr[i].children.length > 0) {
                        this.handleDelete(arr[i].children, r)
                    }
                }
            },
            add(arr, r) {
                // console.log("r", arr, r)
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].customIndex == r) {
                        // console.log("arr", arr)
                        arr.splice(i + 1, 0, {name: "666", customIndex: "tempIndex"})
                        return
                    }
                    if (arr[i].children && arr[i].children.length > 0) {
                        this.add(arr[i].children, r)
                    }
                }
            },
            setIndex(data) {
                let queue = [...data];
                let loop = 0;
                while (queue.length > 0) {
                    loop++
                    [...queue].forEach((child, i) => {
                        queue.shift()
                        if (loop == 1) {
                            child.customIndex = i + 1 + "";
                            child.currentIndex = i;
                        }
                        if (child.children && child.children.length > 0) {
                            child.dataType = 1
                            for (let ci = 0; ci < child.children.length; ci++) {
                                child.children[ci].currentIndex = ci
                                child.children[ci].customIndex = child.customIndex + "." + (ci + 1)
                            }
                            queue.push(...child.children)
                        } else {
                            child.dataType = 2
                        }
                    })
                }
            },
            findPar(arr1, id) {
                var temp = []
                // var tempParent = {}
                var forFn = function (arr, id) {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i]
                        // debugger;
                        if (item.customIndex === id) {
                            temp.push(item)
                            // debugger;
                            forFn(arr1, item.pid)
                            break
                        } else {
                            if (item.children) {
                                // tempParent = item
                                forFn(item.children, id)
                            }
                        }
                    }
                }
                forFn(arr1, id)
                console.log("tt", temp)
                return temp
            },
            getPathByKey(value, key, arr) {
                let temppath = [];
                let realPath = ""
                try {
                    function getNodePath(node) {
                        temppath.push(node.currentIndex);
                        //找到符合条件的节点，通过throw终止掉递归
                        if (node[key] === value) {
                            temppath.forEach((v, i) => {
                                if (i == 0) {
                                    realPath += "." + v
                                } else {
                                    realPath += `.children.${v}`
                                }
                            })
                            // temppath = temppath.join(",")
                            throw ("GOT IT!");
                            // return;
                        }
                        if (node.children && node.children.length > 0) {
                            for (var i = 0; i < node.children.length; i++) {
                                getNodePath(node.children[i]);
                            }

                            //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
                            temppath.pop();
                        } else {

                            //找到叶子节点时，删除路径当中的该叶子节点
                            temppath.pop();
                        }
                    }

                    for (let i = 0; i < arr.length; i++) {
                        getNodePath(arr[i]);
                    }
                } catch (e) {
                    return realPath;
                }
            },
            calcBottom() {
                this.$nextTick(() => {
                    let obj = this.$refs.table.$el
                    var top = obj.getBoundingClientRect().top //元素顶知端到可见区域道顶端的距离专
                    var bottom = obj.getBoundingClientRect().bottom //元素顶知端到可见区域道顶端的距离专
                    var se = document.documentElement.clientHeight //浏览器可见区域高度。属
                    console.log("top", top)
                    console.log("cli", se)
                    console.log("bottom", bottom)
                    if ((top <= se - 50) && bottom >= se) {
                        this.positionType = false //fix
                    } else {
                        this.positionType = true
                    }
                })
            }
        },
        mounted() {
            this.form.rows = [
                {
                    id: "1",
                    date: "2016-05-02",
                    name: "王小虎1",
                    address: "上海市普陀区金沙江路 1518 弄",
                    customIndex: "1",
                    children: [
                        {
                            name: "233",
                            customIndex: "1.1",
                            children: [{name: "9", customIndex: "1.1.1"}]
                        },
                        {
                            name: "7771",
                            customIndex: "1.2",
                            children: [
                                {name: "9", customIndex: "1.2.1"}, {
                                    name: "9",
                                    customIndex: "1.2.2",
                                }]
                        }
                    ]
                },
                {
                    id: "2",
                    date: "2016-05-04",
                    name: "王小虎2",
                    address: "上海市普陀区金沙江路 1517 弄",
                    customIndex: "2",
                    children: []
                },
              ]
            // this.setIndex(this.form.rows)
            // console.log(444, this.form.rows)
            // console.log(233, this.$refs.table, window)
            // this.$nextTick(() => {
            //     this.calcBottom()
            //     window.onscroll = () => {
            //         console.log("trigger")
            //         this.calcBottom()
            //     }
            // })
        },
        watch: {
            "form.rows": {
                handler(v) {
                    this.setIndex(v)
                    this.$nextTick(() => {
                        // this.calcBottom()
                    })
                },
                deep: true
            }
        }
    }
</script>

<style>
    #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
    }

    .rea-type {
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 100%;
        margin-top: -20px;
        border: 1px solid red;
    }

    .fix-type {
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 100%;
        border: 1px solid red;
        position: fixed;
        bottom: 0;
    }
</style>
