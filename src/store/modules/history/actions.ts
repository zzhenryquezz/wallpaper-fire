import { ActionTree } from "vuex";
import { RootState } from "@/store/types";

const actions: ActionTree<RootState, RootState> = {
    setup ({ rootGetters, dispatch, commit }) {
        const db = rootGetters["db/get"];

        const history = db.get("history").value();

        if (history.lastPlaylistId) {
            const playlist = rootGetters["playlist/getById"](history.lastPlaylistId);

            dispatch("playlist/playPlaylist", playlist, { root: true });
        } else if (history.lastWallpaperId) {
            const wallpaper = rootGetters["wallpaper/getById"](history.lastWallpaperId);

            dispatch("wallpaper/playWallpaper", wallpaper, { root: true });
        }
    }
};

export default actions;
