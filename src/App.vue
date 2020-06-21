<template>
  <div id="app">
    <!-- :expand-row-keys="currentExpend" -->
    <!--        <div style="height: 800px"></div>-->
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label-width="0" prop="rows">
        <el-table
          :data="virtualRows"
          id="table"
          style="width: 100%;margin-bottom: 20px;"
          border
          row-key="customIndex"
          default-expand-all
          ref="table"
          max-height="500px"
          class="vtable"
          @expand-change="calcBottom"
          :tree-props="{children: 'children'}"
        >
          <el-table-column
            prop="customIndex"
            fixed
            label="序号"
            sortable
            width="180"
            v-slot="{$index, row}"
          >{{row.customIndex}}</el-table-column>
          <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" sortable width="180">
            <template v-slot="{$index, row}">
              <!-- {{`rows${getPathByKey(row.customIndex,"customIndex",form.rows)}.name`}} -->
              <el-form-item
                label-width="0"
                :rules="rules.name"
                :prop="`${row.customIndex!=='tempIndex'?`rows.${row.path}.name`:''}`"
              >
                <el-input v-model="row.name"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址">
            <template v-slot="{$index, row}">
              <!-- {{`rows${getPathByKey(row.customIndex,"customIndex",form.rows)}.name`}} -->
              <el-form-item
                label-width="0"
                :rules="rules.address"
                :prop="`${row.customIndex!=='tempIndex'?`rows.${row.path}.address`:''}`"
              >
                <el-input v-model="row.address"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址">
            <template v-slot="{$index, row}">
              <!-- {{`rows${getPathByKey(row.customIndex,"customIndex",form.rows)}.name`}} -->
              <el-form-item
                label-width="0"
                :rules="rules.address"
                :prop="`${row.customIndex!=='tempIndex'?`rows.${row.path}.address`:''}`"
              >
                <el-input v-model="row.address"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址">
            <template v-slot="{$index, row}">
              <!-- {{`rows${getPathByKey(row.customIndex,"customIndex",form.rows)}.name`}} -->
              <el-form-item
                label-width="0"
                :rules="rules.address"
                :prop="`${row.customIndex!=='tempIndex'?`rows.${row.path}.address`:''}`"
              >
                <el-input v-model="row.address" type="text"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="删除" width="200px" fixed="right">
            <template slot-scope="scope">
              <el-button @click="add(form.rows,scope.row.customIndex)">add</el-button>
              <el-button @click="handleDelete(form.rows,scope.row.customIndex)">delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <el-button @click="print">print</el-button>
    <el-button class="outLogin" icon="el-icon-switch-button" circle type="info"></el-button>
    <div style="height: 500px"></div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      form: {
        rows: []
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }]
      },
      positionType: true,
      startIndex: 0,
      viewRows: [],
      virtualRows: [],
      scrollTop: 0,
      currentExpend: ["1"]
    };
  },
  methods: {
    print() {
      // console.log(this.form.rows);
      // this.$refs.form.validate((valid, err) => {
      //   console.log("valid", valid, err);
      // });
      console.log(this.$refs);
    },
    handleDelete(arr, r) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].customIndex == r) {
          arr.splice(i, 1);
          return;
        }
        if (arr[i].children && arr[i].children.length > 0) {
          this.handleDelete(arr[i].children, r);
        }
      }
    },
    add(arr, r) {
      // console.log("r", arr, r)
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].customIndex == r) {
          // console.log("arr", arr)
          arr.splice(i + 1, 0, { name: "666", customIndex: "tempIndex" });
          return;
        }
        if (arr[i].children && arr[i].children.length > 0) {
          this.add(arr[i].children, r);
        }
      }
    },
    setIndex(data) {
      let queue = [...data];
      let loop = 0;
      this.num = 0;
      while (queue.length > 0) {
        loop++;
        [...queue].forEach((child, i) => {
          queue.shift();
          this.num++;
          if (loop == 1) {
            child.customIndex = i + 1 + "";
            child.currentIndex = i;
            child.path = i;
          }
          if (child.children && child.children.length > 0) {
            child.dataType = 1;
            for (let ci = 0; ci < child.children.length; ci++) {
              child.children[ci].currentIndex = ci;
              child.children[ci].customIndex =
                child.customIndex + "." + (ci + 1);
              child.children[ci].path = child.path + ".children." + ci;
            }
            queue.push(...child.children);
          } else {
            child.dataType = 2;
          }
          child.expend = child.expend || true;
        });
      }
      this.$nextTick(() => {
        this.calcList();
      });
    },
    getPathByKey(value, key, arr) {
      let temppath = [];
      let realPath = "";
      try {
        function getNodePath(node) {
          temppath.push(node.currentIndex);
          //找到符合条件的节点，通过throw终止掉递归
          if (node[key] === value) {
            temppath.forEach((v, i) => {
              if (i == 0) {
                realPath += "." + v;
              } else {
                realPath += `.children.${v}`;
              }
            });
            // temppath = temppath.join(",")
            throw "GOT IT!";
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
    calcBottom(e) {
      console.log(e, this.currentExpend);

      return;
      this.$nextTick(() => {
        let obj = this.$refs.table.$el;
        var top = obj.getBoundingClientRect().top; //元素顶知端到可见区域道顶端的距离专
        var bottom = obj.getBoundingClientRect().bottom; //元素顶知端到可见区域道顶端的距离专
        var se = document.documentElement.clientHeight; //浏览器可见区域高度。属
        if (top <= se - 50 && bottom >= se) {
          this.positionType = false; //fix
        } else {
          this.positionType = true;
        }
      });
    },
    calcList(scrollTop = this.scrollTop) {
      console.time("js 运行时间：");

      this.startIndex = Math.floor(scrollTop / 65);
      this.virtualRows = this.form.rows.slice(
        this.startIndex,
        this.startIndex + 10
      );
      let height = this.num * 65;
      let mainTable = this.$refs.table.$el.getElementsByClassName(
        "el-table__body"
      );

      Array.from(mainTable).forEach(v => {
        v.style.height = height + "px";
        if (this.startIndex + 10 >= this.num) {
          v.style.paddingTop = scrollTop - 65 + "px";
          v.style.paddingBottom = 0;
        } else {
          v.style.paddingTop = scrollTop + "px";
          v.style.paddingBottom = height - 10 * 65 - scrollTop + "px";
        }
      });
      this.$nextTick(() => {
        console.timeEnd("js 运行时间：");
      });
    }
  },
  mounted() {
    console.time("render300条时间：");
    this.form.rows = new Array(300).fill(0).map((v, i) => ({
      name: i
    }));
    this.form.rows = [
      ...[
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
              children: [{ name: "9", customIndex: "1.1.1" }]
            },
            {
              name: "7771",
              customIndex: "1.2",
              children: [
                { name: "9", customIndex: "1.2.1" },
                {
                  name: "9",
                  customIndex: "1.2.2"
                }
              ]
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
        }
      ],
      ...this.form.rows
    ];
    // this.calcList(this.form.rows);
    this.setIndex(this.form.rows);
    this.$nextTick(() => {
      this.debounceFn = _.debounce(() => {
        this.scrollTop = this.$refs.table.bodyWrapper.scrollTop;
        // this.calcList(this.scrollTop);
        // console.log(88888888888, this.scrollTop);
      }, 100);
      this.$refs.table.bodyWrapper.addEventListener("scroll", this.debounceFn);
    });
    this.$nextTick(() => {
      console.timeEnd("render300条时间：");
    });
  },
  watch: {
    scrollTop(top) {
      // return;
      this.calcList(top);
    }
    // "form.rows": {
    //   handler(v) {
    //     this.setIndex(v);
    //     this.$nextTick(() => {
    //       // this.calcBottom()
    //     });
    //   },
    //   deep: true
    // }
  }
};
</script>

<style scoped>
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
.outLogin {
  width: 36px;
  height: 36px;
  float: right;
  margin-top: 15px;
  margin-left: 10px;
}
</style>

<style>
.vtable .el-table__body tbody {
}
</style>
