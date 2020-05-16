<template>
    <v-form
        ref="form"
        @submit.prevent="submit">
        <v-card>
            <v-card-title class="blue white--text font-weight-bold">
                <h2 class="title">{{state.labels.formTitle}}</h2>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            label="Title"
                            :rules="[state.rules.required]"
                            v-model="state.playlist.title" />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            label="Description"
                            v-model="state.playlist.description" />
                    </v-col>
                    <v-col cols="12">
                        <w-time-picker
                            v-model="state.playlist.config.delay"
                            return-miliseconds
                            :rules="[state.rules.required]"
                            label="Interval" />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="error"
                    large
                    @click="$emit('close')">
                    Cancel
                </v-btn>
                <v-btn
                    color="success"
                    large
                    type="submit">
                    {{state.labels.submitButton}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, watch } from "@vue/composition-api";
import { useStore } from "@/store/use-store";
import { PlayList } from "@/store";

export default defineComponent({
    props: {
        editedItem: {
            type: Object,
            required: false,
            default: null
        }
    },
    setup ({ editedItem }, { emit }) {

        const store = useStore();

        const state = reactive<any>({
            playlist: {
                title: null,
                description: null,
                config: {}
            },
            labels: computed(() => {
                const labels = {
                    formTitle: "Create playlist",
                    submitButton: "Create"
                };
                if (editedItem) {
                    labels.formTitle = "Edit playlist";
                    labels.submitButton = "Save";
                }

                return labels;
            }),
            rules: {
                required: (v: any) => !!v || "Required field",
                selectOne: (value: any[]) => {
                    let valid = true;
                    if (value && value.length === 0) {
                        valid = false;
                    }
                    return valid || "Choose at least one";
                }
            }
        });
        // ref form
        const form = ref<any>(null);

        watch(() => editedItem, (value) => {
            if (value) {
                state.playlist = JSON.parse(JSON.stringify(value));
            } else {
                state.playlist = {
                    wallpaperIds: [],
                    config: {
                        delay: null
                    }
                };
                if (form.value) {
                    form.value.resetValidation();
                }
            }
        });

        // function to create a playes
        const submit = async () => {
            if (!form.value.validate()) {
                return;
            }

            if (editedItem) {
                const data = {
                    id: editedItem.id,
                    playlist: state.playlist
                };

                store.dispatch("playlist/update", data);
            } else {
                store.dispatch("playlist/create", state.playlist);
            }
            emit("close");
        };

        return {
            state,
            form,
            submit
        };
    }
});
</script>
