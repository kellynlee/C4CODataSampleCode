<template>
    <div>
        <div v-for="item in interaction" :key="item.ID" class="chatContainer">
            <chat-module :message="item"></chat-module>
        </div>
    </div>
</template>

<script>
    import ChatModule from './ChatModule';
    export default {
        data () {
            return {
                interaction: []
            }
        },
        props: {
            activity: {
                type: Object
            }
        },
        components: {
            ChatModule: ChatModule
        },
        mounted () {
            // let loading = this.$loading();
            // if(this.activity.ID) {
            //     this.$axios({
            //         method: 'post',
            //         url: this.CONFIG.url.getInteractionHistory,
            //         data: {
            //             ObjectID: this.activity.ObjectID
            //         }
            //     }).then((res) => {
            //         loading.close();
            //         console.log(res)
            //         this.interaction = res.data.concat();
            //     })
            // }
        }
    }
</script>

<style scoped>
.chatContainer {
    padding:0 10px;
}
</style>

