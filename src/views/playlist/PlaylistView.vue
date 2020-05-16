<template>
    <v-card
        v-if="state.playlist"
        flat
        class="fill-height">
        <v-card-title>
            <v-btn
                text
                @click="$emit('close')"
            >
                <v-icon left>mdi-chevron-left</v-icon> Back
            </v-btn>
            <v-spacer />
            <v-btn
                v-if="!state.isActivePlaylist"
                color="red"
                class="white--text"
                @click="playPlaylist"
            >
                Play <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn
                v-else
                color="warning"
                @click="stopPlaylist"
            >
                Stop <v-icon>mdi-stop</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    xl="2"
                    v-for="wallpaper in state.wallpapers" :key="wallpaper.id"
                >
                    <v-card  outlined>
                        <v-img
                            height="200px"
                            @click="toggleWallpaperId(wallpaper.id)"
                            :src='wallpaper.thumb'>
                            <v-overlay
                                :value="state.selectedWallpaperIds.includes(wallpaper.id)"
                                absolute>
                                <v-icon color="white" x-large>mdi-check</v-icon>
                            </v-overlay>
                        </v-img>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "@vue/composition-api";
import { useStore } from "../../store/use-store";
import { PlayList } from "../../store/modules/playlist/state";

type State = {
    selectedWallpaperIds: string[];
    [props: string]: any;
};

type Props = {
    playlist: PlayList;
};

export default defineComponent<Props>({
    props: {
        playlist: {
            type: Object,
            required: false,
            default: null
        }
    },
    setup ({ playlist }) {
        // get store
        const store = useStore();

        const state = reactive<State>({
            wallpapers: [],
            selectedWallpaperIds: [],
            loading: true,
            menu: false,
            alertDialog: false,
            isActivePlaylist: computed<boolean>(() => {
                if (store.state.playlist.currentPlaylistId === playlist.id) {
                    return true;
                }
                return false;
            })
        });
        const load = async () => {
            state.loading = true;
            state.wallpapers = store.getters["wallpaper/getAll"];
            state.playlist = playlist;
            state.selectedWallpaperIds = playlist.wallpaperIds;
            setTimeout(() => {
                state.loading = false;
            }, 800);
        };

        const playPlaylist = () => {
            store.dispatch("playlist/playPlaylist", state.playlist);
        };

        const stopPlaylist = () => {
            store.dispatch("playlist/stopPlaylist");
        };

        const updatePlaylist = () => {
            store.commit("SET_LOADING", true);

            const data = {
                id: playlist.id,
                playlist: state.playlist,
                wallpaperIds: state.selectedWallpaperIds
            };

            store.dispatch("playlist/update", data);

            setTimeout(() => store.commit("SET_LOADING", false), 800);
        };

        load();

        const toggleWallpaperId = (wallpaperId: string) => {
            if (state.selectedWallpaperIds.includes(wallpaperId)) {
                const index = state.selectedWallpaperIds.indexOf(wallpaperId);
                state.selectedWallpaperIds.splice(index, 1);
            } else {
                state.selectedWallpaperIds.push(wallpaperId);
            }
            updatePlaylist();
        };

        return {
            state,
            playPlaylist,
            stopPlaylist,
            toggleWallpaperId
        };
    }
});
</script>
