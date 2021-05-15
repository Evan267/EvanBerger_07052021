import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: () => import("./components/LogIn")
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("./components/SignUp")
    },
    {
      path: "/publications",
      name: "publications",
      component: () => import("./components/PublicationsList")
    },
    {
        path: "/publication/:id",
        name: "publication-details",
        component: () => import("./components/PublicationsList")
    },
    {
        path: "/user/:id",
        name: "user-profil",
        component: () => import("./components/UserProfil")
    }
  ]
});