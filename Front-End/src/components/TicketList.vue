<template>
    <div class="mainContent">
        <mu-sub-header>TaskList</mu-sub-header>
        <div v-for="ticket in ticketList" :key="ticket.ID">
            <ticket-list-item :ticket="ticket" @click.native ="openTicketDetail(ticket.ID)"></ticket-list-item>
        </div>
    </div>
</template>

<script>
import TicketListItem from './TicketListItem';
    export default {
        data () {
            return {
                ticketList: [
                    {
                        ID: '1423',
                        Subject: 'my computer cannot work',
                        Status: 'In Process',
                        Channel: 'WeChat'
                    },
                    {
                        ID: '1421',
                        Subject: 'my computer cannot work',
                        Status: 'In Process',
                        Channel: 'WeChat'
                    },
                    {
                        ID: '1422',
                        Subject: 'my computer cannot work',
                        Status: 'In Process',
                        Channel: 'WeChat'
                    },
                    {
                        ID: '1419',
                        Subject: 'my computer cannot work',
                        Status: 'In Process',
                        Channel: 'WeChat'
                    }
                ]
            }
        },
        components: {
            TicketListItem: TicketListItem
        },
        methods: {
            openTicketDetail: function (id) {
                console.log(id);
                this.$router.push('/TicketDetail/' + id);
            }
        },
        mounted() {
            // this.$axios({
            //     method: 'post',
            //     uri: ''
            // })
        },
    }
</script>

<style>
.header {
    height: 30px;
}
</style>

