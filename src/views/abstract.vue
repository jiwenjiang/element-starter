<template>
  <div>
    <RouterDrawer
      :visible.sync="visible"
      :path="{ name: 'embedded' }"
      size="50%"
      title="drawer comps"
    ></RouterDrawer>
    <el-button @click="visible = true">open drawer</el-button>
  </div>
</template>

<script>
import { routes } from "../router/index";
import RouterDrawer from "../components/router-drawer";
export default {
  name: "abstract",
  components: {
    RouterDrawer,
  },
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    console.log("abstract router", this.$router);
  },
};
</script>
