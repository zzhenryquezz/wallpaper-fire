import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "home",
        redirect: "/library"
    },
    {
        path: "/settings",
        name: "settings",
        component: () => import("./../views/settings/index.vue")
    },
    {
        path: "/library",
        name: "library",
        component: () => import("./../views/library/Library.vue")
    },
    {
        path: "/playlist",
        name: "playlist",
        component: () => import("./../views/playlist/Playlist.vue")
    }
];

const router = new VueRouter({
    mode: "hash",
    base: process.env.BASE_URL,
    routes
});

export default router;
