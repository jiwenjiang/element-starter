<template>
  <el-drawer
    :visible.sync="visible"
    v-bind="$attrs"
    :before-close="handleClose"
  >
    <router-view />
  </el-drawer>
</template>
<script>
import { routes } from "../router/index";
import VueRouter from "vue-router";

export default {
  name: "router-drawer",
  props: {
    path: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  router: new VueRouter({
    mode: "abstract",
    base: "/",
    routes,
  }),
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
  },
  mounted() {
    console.log("drawer router", this.$router);
    this.$router.push(this.path);
  },
};
</script>
