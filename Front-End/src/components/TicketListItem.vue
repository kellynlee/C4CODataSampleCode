<template>
    <div class="item">
        <mu-flex direction="column" class="item">
            <mu-flex fill align-items="center" class="itemBody">
                <mu-list>
                    <mu-list-item>
                        <mu-list-item-content>ID</mu-list-item-content>
                        <mu-list-item-content>{{ticket.ID}}</mu-list-item-content>
                    </mu-list-item>
                </mu-list>
            </mu-flex>
            <mu-flex fill align-items="center" class="itemBody">
                <mu-list>
                    <mu-list-item>
                        <mu-list-item-content>Subject</mu-list-item-content>
                        <mu-list-item-content>{{ticket.Name}}</mu-list-item-content>
                    </mu-list-item>
                </mu-list>
            </mu-flex>
            <mu-flex fill align-items="center" class="itemBody">
                <mu-list>
                    <mu-list-item>
                        <mu-list-item-content>
                            <mu-badge :content="ticket.ServiceRequestUserLifeCycleStatusCodeText" color="primary" class="ticketBadge"></mu-badge>
                            <!-- <mu-badge :content="ticket.Channel"></mu-badge> -->
                        </mu-list-item-content>
                    </mu-list-item>
                </mu-list>
            </mu-flex>
        </mu-flex>
    </div>
</template>

<script>
    export default {
        data () {
            return {

            }
        },
        props: {
            ticket:{
                type: Object
            }
        }
    }
</script>

<style scoped>
.item {
    height: 100px;
    width: 100%;
    padding: 5px 0;
    margin-bottom: 10px;
}
.itemBody {
    width: 100%;
}
.ticketBadge {
    margin-right: 10px;
}
</style>

