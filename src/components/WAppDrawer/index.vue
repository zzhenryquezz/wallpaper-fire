<template>
    <v-navigation-drawer
        app
        permanent
        :mini-variant="state.mini"
        v-bind="$attrs"
    >
        <v-list class="pt-0">

            <v-list-item  @click="state.mini = !state.mini">
                <v-icon>
                    mdi-menu
                </v-icon>
            </v-list-item>

            <v-divider />

            <v-list-item
                v-for="item in state.menuItems"
                :key="item.title"
                :to="item.to"
            >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";

export default defineComponent({
    setup () {
        const state = reactive({
            mini: true,
            menuItems: [
                {
                    title: "Wallpapers",
                    icon: "mdi-image",
                    to: { name: "library" }
                },
                {
                    title: "Playlist",
                    icon: "mdi-image-multiple",
                    to: { name: "playlist" }
                },
                {
                    title: "Settings",
                    icon: "mdi-settings",
                    to: { name: "settings" }
                }
            ]
        });
        return {
            state
        };
    }
});
</script>

<style>

</style>
