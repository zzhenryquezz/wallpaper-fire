import { MutationTree } from "vuex";
import { WallpaperState } from "./state";

const mutations: MutationTree<WallpaperState> = {
    SET_WALLPAPERS (state, wallpapers) {
        state.wallpapers = wallpapers;
    },
    SET_CURRENT_WALLPAPER_ID (state, wallpaperId: string | null) {
        state.currentWallpaperId = wallpaperId;
    }
};

export default mutations;
