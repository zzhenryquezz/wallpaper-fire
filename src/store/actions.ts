import { RootState } from "@/store";
import { ActionTree } from "vuex";

const actions: ActionTree<RootState, RootState> = {
    showNotification ({ commit }, notification: any) {
        notification = { ...notification, show: true };
        commit("ADD_NOTIFICATION", notification);
    },
    showErrorNotification ({ state, dispatch }, message: string) {
        const activeNotifications = state.notifications.filter(n => n.show).length;
        if (activeNotifications > 5) {
            return;
        }
        const notification = {
            color: "error",
            message
        };
        dispatch("showNotification", notification);
    },
    showSuccessNotification ({ state, dispatch }, message: string) {
        const activeNotifications = state.notifications.filter(n => n.show).length;
        if (activeNotifications > 5) {
            return;
        }

        const notification = {
            color: "success",
            message
        };
        dispatch("showNotification", notification);
    },
    setUserNotifications ({ rootGetters, commit }) {
        const db = rootGetters["db/get"];
        const userNotifications = db
            .get("user.notifications")
            .orderBy("timestamp", "desc")
            .value();

        commit("SET_USER_NOTIFICATIONS", userNotifications);
    },
    showImportantNotification ({ dispatch, rootGetters }, notification: any) {
        notification = {
            ...notification,
            readed: false,
            timestamp: Date.now()
        };
        const db = rootGetters["db/get"];

        db.get("user.notifications").insert(notification).write();

        dispatch("showNotification", notification);

        dispatch("setUserNotifications");
    },
    removeNotification ({ dispatch, rootGetters }, id: any) {
        const db = rootGetters["db/get"];

        db.get("user.notifications").removeById(id).write();

        dispatch("setUserNotifications");
    },
    clearAllNotification ({ dispatch, rootGetters }) {
        const db = rootGetters["db/get"];

        db.set("user.notifications", []).write();

        dispatch("setUserNotifications");
    },
    stopAllLiveWallpapers ({ dispatch }) {
        dispatch("kde/stopAll", {}, { root: true });
        dispatch("playlist/stopPlaylist", {}, { root: true });
        dispatch("wallpaper/stopWallpaper", null, { root: true });
    }
};

export default actions;
