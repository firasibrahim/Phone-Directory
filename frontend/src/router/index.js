import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Admin from "../pages/Admin.vue";
import Login from "../pages/Login.vue";

const routes = [
  { path: "/", component: Home },
  {
    path: "/admin",
    component: Admin,
    meta: { requiresAuth: true }, // ✅ حماية الصفحة
  },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ حماية المسارات التي تتطلب تسجيل دخول

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("adminToken");
  const expiry = localStorage.getItem("tokenExpiry");

  const isAuthenticated = token && expiry && Date.now() < expiry;

  if (to.meta.requiresAuth && !isAuthenticated) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("tokenExpiry");
    next("/login");
  } else {
    next();
  }
});

export default router;
