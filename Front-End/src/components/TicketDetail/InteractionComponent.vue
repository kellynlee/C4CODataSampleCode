<template>
    <div>
        <div v-for="item in interaction" :key="item.ID">
            <chat-module :message="item"></chat-module>
        </div>
    </div>
</template>

<script>
    import ChatModule from './ChatModule';
    export default {
        data () {
            return {

            }
        },
        props: {
            interaction: {
                type: Array
            }
        },
        components: {
            ChatModule: ChatModule
        }
    }
</script>
