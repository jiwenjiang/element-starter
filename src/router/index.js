import VueRouter from "vue-router";
import Table from "../views/table.vue";

export const routes = [
  {
    path: "/",
    redirect: "table",
  },
  {
    path: "/table",
    name: "table",
    component: Table,
  },
  {
    path: "/embed-route",
    name: "embedded",
    component: () =>
      import(/* webpackChunkName: "embed" */ "../views/embed.vue"),
  },
  {
    path: "/abstract-route",
    name: "abstract",
    component: () =>
      import(/* webpackChunkName: "abstract" */ "../views/abstract.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
