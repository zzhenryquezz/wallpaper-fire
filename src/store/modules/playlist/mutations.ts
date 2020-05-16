import { MutationTree } from "vuex";
import { PlayListState } from "./state";

const mutations: MutationTree<PlayListState> = {
    SET_TIMER (state, timer: any) {
        state.timer = timer;
    },
    CLEAR_TIMER (state) {
        clearInterval(state.timer);
        state.timer = null;
    },
    SET_CURRENT_PLAYLIST_ID (state, playlistId) {
        state.currentPlaylistId = playlistId;
    }
};
export default mutations;
