import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "user",
      component: () => import("./components/User"),
      children: [
        {
          name: "homePage",
          path: '',
          component: () => import("./components/PublicationsList")
        },
        {
          path: "/profil/:userId",
          name: "user-profil",
          component: () => import("./components/UserProfil"),
        },
        {
          path: "/publication/:userId",
          name: "user-publication",
          component: () => import("./components/UserPublication"),
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./components/LogIn")
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("./components/SignUp")
    },
    {
        path: "/publication/:id",
        name: "publication-details",
        component: () => import("./components/Publication")
    },
  ]
});