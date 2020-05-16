<template>
    <v-dialog
        max-width="300px"
        v-model="state.model">
        <v-card class="py-4">
            <v-card-text class="text-center">
                <v-icon
                    size="100"
                    color="red"
                >
                    mdi-alert
                </v-icon>
                <h3 class="title"> Are you sure ?</h3>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="success"
                    class="mr-1"
                    width="100"
                    @click="sendResponse('positive')"
                >
                    Yes
                </v-btn>
                <v-btn
                    color="error"
                    width="100"
                    @click="sendResponse('negative')"
                >
                    No
                </v-btn>
                <v-spacer />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "@vue/composition-api";

export default defineComponent({
    props: {
        value: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup (props, { emit }) {
        const state = reactive({
            model: computed<boolean>({
                get () {
                    return props.value;
                },
                set (value) {
                    emit("input", value);
                }
            })
        });

        const sendResponse = (event: string) => {
            emit(event);
            state.model = false;
        };

        return {
            state,
            sendResponse
        };
    }
});
</script>
