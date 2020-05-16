<template>
    <div v-if="wallpaper">
        <v-card
            link
            v-ripple='false'
            class="library-item-card">
            <v-hover v-if='wallpaper.thumb' v-slot:default="{ hover }">
                <v-img
                    class="white--text align-end library-item-thumb"
                    height="200px"
                    :src="wallpaper.thumb"
                    @click="$emit('click')"
                    @contextmenu="showMenu"
                >
                    <v-expand-transition>
                        <div
                            v-if="hover"
                            @click.stop="useWallpaper"
                            class="transition-fast-in-fast-out text-center py-3 subtitle-2 font-weight-bold text-uppercase"
                            style="height: 30%;background-color:rgba(0, 0, 0, 0.43)"
                        >
                            use wallpaper
                        </div>
                    </v-expand-transition>
                </v-img>
            </v-hover>
            <v-img
                v-else
                class="white--text align-end library-item-thumb-default"
                height="200px"
                contain
                :src="state.defaultImage"
            >
            </v-img>
            <v-menu
                v-model="state.menu.show"
                absolute
                offset-y
                :position-x="state.menu.x"
                :position-y="state.menu.y"
                min-width="300px"
                max-width="700px"
            >
                <v-list class="py-0">
                    <v-list-item
                        v-for="(option, index) in state.options"
                        :key="index"
                        @click="option.function"
                        :class="[option.color ? option.color : '', option.class]"
                        :dark="option.dark"
                    >
                        <v-list-item-content>
                            {{option.text}}
                        </v-list-item-content>

                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card>
    </div>
    <v-card v-else>
        <v-card-text class="text-center yellow--text text--darken-1">
            <v-icon color="yellow darken-1" size="170">mdi-alert</v-icon>
            <h2>Error</h2>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";

export default defineComponent({
    props: {
        wallpaper: {
            type: Object,
            required: true,
            default: null
        }
    },
    setup (props, { emit, root: { $nextTick } }) {
        const editWallpaper = () => {
            emit("edit", props.wallpaper);
        };
        const deleteWallpaper = () => {
            emit("delete", props.wallpaper);
        };
        const useWallpaper = () => {
            emit("use-wallpaper", props.wallpaper);
        };
        const state = reactive({
            defaultImage: require("@/assets/512x512.png"),
            menu: {
                show: false,
                x: null,
                y: null
            },
            options: [
                {
                    text: "Use Wallpapper",
                    class: "library-item-use-button",
                    function: () => useWallpaper()
                },
                {
                    text: "Edit Wallpapper",
                    class: "library-item-edit-button",
                    function: () => editWallpaper()
                },
                {
                    text: "Delete Wallpapper",
                    color: "error",
                    class: "library-item-delete-button",
                    dark: true,
                    function: () => deleteWallpaper()
                }
            ]
        });
        const showMenu = (e: any) => {
            e.preventDefault();
            if (state.menu.show) {
                state.menu.show = false;
                return;
            }
            state.menu.x = e.clientX;
            state.menu.y = e.clientY;
            $nextTick(() => {
                state.menu.show = true;
            });
        };
        return {
            state,
            showMenu,
            editWallpaper,
            deleteWallpaper,
            useWallpaper
        };
    }
});
</script>
