import { createRouter, createWebHistory } from "vue-router";
import Dex from "../views/Dex.vue";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/dex",
    name: "Dex",
    component: Dex,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
