<template>
    <div>
        <v-row align="start">
            <template
                v-for="wallpaper in state.wallpapers">
                <v-slide-x-transition :key="`transition-${wallpaper.id}`">
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                        xl="2"
                        :key="wallpaper.id">
                        <v-skeleton-loader
                            v-show="state.loading"
                            type="image"/>
                        <library-item
                            v-show="!state.loading"
                            :wallpaper="wallpaper"
                            @play-wallpaper="playWallpaper(wallpaper)"
                            @click="playWallpaper(wallpaper)"
                            @edit="editWallpaper"
                            @delete="handleDeleteWallpaper"
                        />
                    </v-col>
                </v-slide-x-transition>
            </template>

            <v-dialog v-model="state.dialog" max-width="1000">
                <library-form
                    v-if="state.dialog"
                    :edited-item="state.editedItem"
                    @close="state.dialog = false;"
                    @submit="setLoading"
                />
            </v-dialog>
            <w-alert
                v-model="state.alert"
                @positive="deleteWallpaper"
                @negative="state.editedItem = null"
            />
            <v-fab-transition>
                <v-btn
                    class="library-add-button"
                    v-show="!state.dialog"
                    dark
                    fixed
                    bottom
                    right
                    fab
                    color="success"
                    @click="state.dialog = true"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-fab-transition>
        </v-row>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from "@vue/composition-api";
import { useStore, Wallpaper } from "@/store";

export default defineComponent({
    name: "Library",
    components: {
        LibraryItem: () => import("./LibraryItem.vue"),
        LibraryForm: () => import("./LibraryForm.vue"),
        LibraryDrawer: () => import("./LibraryDrawer.vue")
    },
    setup () {
        const store = useStore();
        const state: any = reactive({
            loading: false,
            alert: false,
            dialog: false,
            drawer: false,
            selected: null,
            editedItem: null,
            wallpapers: computed<Wallpaper[]>(() => store.state.wallpaper.wallpapers)
        });

        watch(() => state.dialog, (value) => {
            if (!value) {
                state.editedItem = null;
            }
        });

        if (state.wallpapers.length === 0) {
            store.dispatch("wallpaper/setWallpapers");
        }
        const setLoading = () => {
            state.loading = true;
            store.commit("SET_LOADING", true);
            setTimeout(() => {
                state.loading = false;
                store.commit("SET_LOADING", false);
            }, 800);
        };
        setLoading();

        const playWallpaper = (wallpaper: Wallpaper) => {
            store.commit("playlist/SET_CURRENT_PLAYLIST_ID", null);
            store.dispatch("wallpaper/playWallpaper", wallpaper);
        };

        const editWallpaper = (wallpaper: Wallpaper) => {
            state.editedItem = wallpaper;
            state.dialog = true;
        };

        const handleDeleteWallpaper = (wallpaper: Wallpaper) => {
            state.editedItem = wallpaper;
            state.alert = true;
        };
        const deleteWallpaper = () => {
            store.dispatch("wallpaper/delete", state.editedItem.id);
            state.editedItem = null;
        };

        return {
            state,
            editWallpaper,
            deleteWallpaper,
            setLoading,
            handleDeleteWallpaper,
            playWallpaper
        };
    }
});
</script>
