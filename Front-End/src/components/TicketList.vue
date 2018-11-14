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
                this.$router.push('/TicketDetail/' + id);
            },
            load: function () {
                if (this.ticketList.length < 10) {
                    return false;
                }
                this.loading = true;
                this.key += 10;
                this.$axios({
                    method: 'post',
                    url: this.CONFIG.url.getTicketList,
                    data: {
                        key: this.key
                    }
                }).then((res) => {
                    this.loading = false
                    if (res.data.length > 0) {
                        this.ticketList = this.ticketList.concat(res.data);
                    } else {
                        this.$toast.error('No more ticket!')
                    }
                })
            },
        },
        mounted() {
            let loading = this.$loading();
            this.openID = this.common.getOpenID(this.wxCode);
            this.openID.then((id) => {
                this.$axios({
                    method: 'post',
                    url: this.CONFIG.url.getTicketList,
                    data: {
                        key: this.key,
                        openID: id
                    }
                }).then((res) => {
                    loading.close();
                    if (res.data.length == 0) {
                        this.$toast.error('No ticket found!');
                        return false;
                    } else {
                        this.ticketList = this.ticketList.concat(res.data);
                    }
                })
            })
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

