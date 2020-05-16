import { ActionTree } from "vuex";
import { RootState } from "@/store";
import { PlayList, PlayListState } from "./state";

const actions: ActionTree<PlayListState, RootState> = {

    async getById ({ rootGetters }, id: number) {
        // get the db
        const db = rootGetters["db/get"];
        // create the playlist
        const playlist = db.get("playlist.all").getById(id).value();

        return playlist;
    },

    async create ({ rootGetters, dispatch }, playlist: PlayList) {
        // get the db
        const db = rootGetters["db/get"];
        // create the playlist
        db.get("playlist.all").insert(playlist).write();

        dispatch("showSuccessNotification", `Playlist ${playlist.title} created`, { root: true });

        return playlist;
    },

    async update ({ rootGetters }, { id, playlist }) {
        const db = rootGetters["db/get"];
        db.get("playlist.all").updateById(id, playlist).write();
    },

    async delete ({ dispatch, rootGetters }, id) {
        // get the db
        const db = rootGetters["db/get"];
        // delete the playlist
        db.get("playlist.all").removeById(id).write();

        dispatch("showSuccessNotification", "Playlist deleted", { root: true });
    },

    async setCurrentPlaylistId ({ rootGetters, commit }, playlistId) {
        const db = rootGetters["db/get"];

        db.set("history.lastPlaylistId", playlistId).write();

        commit("SET_CURRENT_PLAYLIST_ID", playlistId);
    },

    async playPlaylist ({ rootGetters, dispatch, commit }, playlist: PlayList) {
        let IntervalTime = 300000;

        if (playlist.config.delay > IntervalTime) {
            IntervalTime = playlist.config.delay;
        }

        const db = rootGetters["db/get"];

        dispatch("setCurrentPlaylistId", playlist.id);

        let wallpaperId = playlist.wallpaperIds[0];

        let lastWallpaperId = db.get("history.lastWallpaperId").value();

        if (playlist.wallpaperIds.includes(lastWallpaperId)) {
            wallpaperId = lastWallpaperId;
        }

        let wallpaper = rootGetters["wallpaper/getById"](wallpaperId);

        dispatch("wallpaper/playWallpaper", wallpaper, { root: true });

        let count = 0;
        // function to handle the cicles of wallpapers changes
        const loopToSetItenvals = () => {
            if (lastWallpaperId) {
                count = playlist.wallpaperIds
                    .findIndex(id => id === lastWallpaperId);
                lastWallpaperId = null;
                return;
            }
            // increment count
            count++;
            // get the next wallpaper id
            wallpaperId = playlist.wallpaperIds[count];
            // if the id do not exits reset the count
            if (!wallpaperId) {
                count = 0;
                wallpaperId = playlist.wallpaperIds[0];
            }
            // get the wallpaper in db
            wallpaper = rootGetters["wallpaper/getById"](wallpaperId);
            // set the wallpaper in descktop
            dispatch("wallpaper/playWallpaper", wallpaper, { root: true });
        };

        // create a timer
        const timer = setInterval(loopToSetItenvals, IntervalTime);
        // add the timer in the store state to be able to stop him
        commit("SET_TIMER", timer);
    },
    async stopPlaylist ({ commit, rootGetters, dispatch }) {
        commit("CLEAR_TIMER");
        // get the db
        const db = rootGetters["db/get"];
        // set the ids to empty
        dispatch("setCurrentPlaylistId", null);

        db.set("history.lastWallpaperId", null).write();
    }
};

export default actions;
