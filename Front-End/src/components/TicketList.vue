<template>
    <div class="mainContent">
        <!-- <mu-appbar style="width: 100%;" title="Ticket List" color="primary" class="header"></mu-appbar> -->
        <div class="listContent">
            <mu-load-more :loading="loading" @load="load">
                <div v-for="ticket in ticketList" :key="ticket.ID">
                    <ticket-list-item :ticket="ticket" @click.native ="openTicketDetail(ticket.ID)"></ticket-list-item>
                </div>
            </mu-load-more>
        </div>
    </div>
</template>

<script>
import TicketListItem from './TicketListItem';
    export default {
        data () {
            return {
                isFirstEnter: false,
                isNav: false,
                key:0,
                userInfo:{},
                ticketList: [
                    // {
                    //     ID: '1423',
                    //     Subject: 'my computer cannot work',
                    //     Status: 'In Process',
                    //     Channel: 'WeChat'
                    // },
                    // {
                    //     ID: '1421',
                    //     Subject: 'my computer cannot work',
                    //     Status: 'In Process',
                    //     Channel: 'WeChat'
                    // },
                    // {
                    //     ID: '1422',
                    //     Subject: 'my computer cannot work',
                    //     Status: 'In Process',
                    //     Channel: 'WeChat'
                    // },
                    // {
                    //     ID: '1419',
                    //     Subject: 'my computer cannot work',
                    //     Status: 'In Process',
                    //     Channel: 'WeChat'
                    // }
                ],
                loading: false,
                key: 0
            }
        },
        computed: {
            wxCode () {
                return this.$route.query.code;
            }
        },
        components: {
            TicketListItem: TicketListItem
        },
        methods: {
            openTicketDetail: function (id) {
                console.log(id);
                this.isNav = true;
                this.$router.push({
                    name:'TicketDetail',
                    params: {
                        openID: this.userInfo.openid,
                        nickName: this.userInfo.nickname,
                        id: id
                    }
                });
            },
            load: function () {
                if (!this.isNav) {
                    if (this.ticketList.length < 10) {
                        return false;
                    }
                    this.loading = true;
                    this.key += 10;
                    this.WXUserInfo.then((userInfo) => {
                        this.$axios({
                            method: 'post',
                            url: this.CONFIG.url.getTicketList,
                            data: {
                                key: this.key,
                                openID: userInfo.openid
                            }
                        }).then((res) => {
                            this.loading = false
                            if (res.data.length > 0) {
                                this.ticketList = this.ticketList.concat(res.data);
                            } else {
                                this.$alert('No more ticket!');
                            }
                        })
                    })
                } else {
                    return false;
                }
            },
        },
        beforeRouteEnter(to, from, next) {
            if (from.name == "TicketDetail") {
                to.meta.isBack = true;
            }
            next();
        },
        created() {
            this.isFirstEnter = true;
        },
        activated() {
            if (!this.$route.meta.isBack || this.isFirstEnter) {
                var loading = this.$loading();
                this.WXUserInfo = this.common.getWXUserInfo(this.wxCode);
                this.WXUserInfo.then((userInfo) => {
                    this.userInfo = userInfo;
                    this.$axios({
                        method: 'post',
                        url: this.CONFIG.url.getTicketList,
                        data: {
                            key: this.key,
                            openID: userInfo.openid
                        }
                    }).then((res) => {
                        loading.close();
                        if (res.status == 200) {
                            if (res.data.length == 0) {
                                this.$alert('No ticket found!');
                                return false;
                            } else {
                                this.ticketList = this.ticketList.concat(res.data);
                            }
                        }
                    }).catch((err) => {
                        loading.close();
                        this.$alert('Please bind Contact first!');
                    });
                })
            }
            this.$route.meta.isBack = false;
            this.isFirstEnter = false;
            this.isNav = false;
            this.$children[0].$children[0].$el.style.scrollTop = 0;
            // document.documentElement.scrollTop = 0;
        }
    }
</script>

<style scoped>
.mainContent {
    position: relative;
}
.listContent {
    position: absolute;
    width: 100%;
}
</style>

