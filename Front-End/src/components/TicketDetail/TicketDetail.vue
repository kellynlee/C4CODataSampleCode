<template>
    <div class="mainContent">
        <!-- <mu-appbar style="width: 100%;" color="primary" class="header">
            <mu-button icon slot="left" @click="backToList">
                <mu-icon value="keyboard_backspace"></mu-icon>
            </mu-button>
            Detail
        </mu-appbar> -->
        <component :is="componentId" class="listContent" :detail="ticketDetail" :interaction="interactionHistory"></component>
        <mu-bottom-nav class="tabBar" :value.sync="componentId">
            <mu-bottom-nav-item title="Detail" icon="details" value="DetailComponent"></mu-bottom-nav-item>
            <mu-bottom-nav-item title="History" icon="history" value="InteractionComponent"></mu-bottom-nav-item>
        </mu-bottom-nav>
    </div>
</template>

<script>
    import DetailComponent from './DetailComponent';
    import InteractionComponent from './InteractionComponent';
    export default {
        data () {
            return {
                ticketDetail: {
                    ServiceRequestLocation: {}
                },
                interactionHistory:[
                    {
                        SocialMediaMessageAuthor: 'C4C',
                        Text: 'reply from c4c',
                        inBound: false
                    },
                    {
                        SocialMediaMessageAuthor: 'WeChat',
                        Text: 'reply in WeChat',
                        inBound: true
                    },
                    {
                        SocialMediaMessageAuthor: 'C4C',
                        Text: 'reply from c4c',
                        inBound: false
                    },
                    {
                        SocialMediaMessageAuthor: 'C4C',
                        Text: 'reply from c4c',
                        inBound: false
                    },
                    {
                        SocialMediaMessageAuthor: 'WeChat',
                        Text: 'reply in WeChat',
                        inBound: true
                    },
                ],
                componentId: 'DetailComponent',
            }
        },
        components: {
            DetailComponent: DetailComponent,
            InteractionComponent: InteractionComponent
        },
        computed: {
            ticketID () {
                return this.$route.params.id;
            },
            wxCode () {
                return this.$route.query.code;
            },
            interactionPath () {
                return '/TicketDetail/InteractionHistory/' + this.ticketDetail.SocialMediaActivityID;
            },
            detailPath () {
                return '/TicketDetail/' + this.ticketDetail.ID;
            }
        },
        methods: {
        },
        mounted () {
            // console.log(this.ticketID)
            let loading = this.$loading();
            this.openID = this.common.getOpenID(this.wxCode);
            this.$axios({
                method: 'post',
                url: this.CONFIG.url.getTicket,
                data: {
                    ID: this.ticketID
                }
            }).then((res) => {
                loading.close();
                console.log(res.data);
                if (res.status == 200) {
                    this.ticketDetail = res.data;
                }
            })
        }
    }
</script>

<style scoped>
.mainContent {
    position: absolute;
    height: auto;
    width: 100%;
    height: 100%;
    /* overflow: hidden; */
}
.clear {
    clear: both;
}
.listContent {
    width: 100%;
    height: calc(100% - 3.5rem);
    overflow: hidden;
    position: absolute;
    overflow-y: scroll;
    /* margin-bottom: 7rem; */
}
.header {
    position: fixed;
    top: 0;
    height: 3rem;
    /* float: top; */
}
.header div {
    height: 100%;
    line-height: 3rem;
}
.tabBar {
    position: fixed;
    /* float: bottom; */
    bottom: 0;
    width: 100%;
    height: 3.5rem
}
.btnBox {
    width: 50%;
    margin-bottom: 20px;
}

</style>

