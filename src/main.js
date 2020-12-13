import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";

Vue.use(ElementUI);

new Vue({
  router,
  el: "#app",
  render: (h) => h(App),
});
