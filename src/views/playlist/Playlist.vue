<template>
    <v-row class="fill-height">
        <v-col cols="12">
            <v-card height="100%" min-height="90vh">
                <v-window v-model="state.window">
                    <v-window-item :key='0'>
                        <v-card-title>
                            <v-btn
                                color="info"
                                @click="state.dialog = true"
                            >
                                Create Playlist
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-data-table
                                :headers="state.headers"
                                :items='state.playlists'
                                hide-default-footer
                                @click:row="viewPlaylist"
                            >
                                <template v-slot:item.options='{ item }'>
                                    <v-btn
                                        icon
                                        class="mr-4"
                                        @click.stop="viewPlaylist(item)"
                                    >
                                        <v-icon small>mdi-eye</v-icon>
                                    </v-btn>
                                    <v-btn
                                        icon
                                        class="mr-4"
                                        @click.stop="handleEdit(item)"
                                    >
                                        <v-icon small>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn
                                        icon
                                        class="mr-4"
                                        @click.stop="handleDelete(item)"
                                    >
                                        <v-icon small>mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-window-item>
                    <v-window-item :key='1'>
                        <v-card-text>
                            <playlist-view
                                v-if="state.selectedPlaylist"
                                :playlist="state.selectedPlaylist"
                                @close="state.window = 0"
                            />
                        </v-card-text>
                    </v-window-item>
                </v-window>
            </v-card>
            <w-alert v-model="state.alert" @positive="deletePlaylist" />
            <v-dialog
                v-model="state.dialog"
                max-width="1200"
            >
                <playlist-form
                    :edited-item='state.editedItem'
                    @close="state.dialog = false"
                />
            </v-dialog>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "@vue/composition-api";
import { PlayList, useStore } from "@/store";

type State = {
    selectedPlaylist: null | PlayList;
    [prop: string]: any;
};

export default defineComponent({
    components: {
        PlaylistForm: () => import("./PlaylistForm.vue"),
        PlaylistView: () => import("./PlaylistView.vue")
    },
    setup () {
        const store = useStore();
        const state = reactive<State>({
            window: 0,
            alert: false,
            dialog: false,
            selectedPlaylist: null,
            editedItem: null,
            playlists: [],
            headers: [
                { text: "Title", value: "title" },
                { text: "Description", value: "description" },
                { text: "Options", value: "options", width: 200 }
            ]
        });

        watch(() => state.dialog, (value) => {
            if (!value) {
                state.editedItem = null;
            }
        });

        const load = () => {
            store.commit("SET_LOADING", true);

            state.playlists = store.getters["playlist/getAll"];

            setTimeout(() => store.commit("SET_LOADING", false), 800);
        };

        const reset = () => {
            state.selectedPlaylist = null;
            state.dialog = false;
            state.playlists = [];
            load();
        };

        const viewPlaylist = (item: PlayList) => {
            state.selectedPlaylist = item;
            state.window = 1;
        };

        const handleEdit = (item: PlayList) => {
            state.editedItem = item;
            state.dialog = true;
        };

        const editPlaylist = () => {
            state.editedItem = state.selected.id;
            state.dialog = true;
        };

        const handleDelete = (playlist: PlayList) => {
            state.selectedPlaylist = playlist;
            state.alert = true;
        };

        const deletePlaylist = () => {
            store.dispatch("playlist/delete", state.selectedPlaylist?.id);
            state.selectedPlaylist = null;
            load();
        };

        load();

        return {
            state,
            reset,
            viewPlaylist,
            handleEdit,
            editPlaylist,
            handleDelete,
            deletePlaylist
        };
    }
});
</script>

<style>

</style>
