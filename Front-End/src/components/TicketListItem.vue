<template>
    <mu-paper class="paperContainer" :z-depth="1" round="true">
        <mu-flex direction="column" class="item">
            <mu-flex fill align-items="center" class="itemBody">
                <mu-list>
                    <mu-list-item>
                        <mu-row class="txtContent">
                            <mu-col span="3">
                                <mu-list-item-content>ID</mu-list-item-content>
                            </mu-col>
                            <mu-col span="9">
                                <mu-list-item-content>{{ticket.ID}}</mu-list-item-content>
                            </mu-col>
                        </mu-row>
                    </mu-list-item>
                </mu-list>
            </mu-flex>
            <mu-flex fill align-items="center" class="itemBody">
                <mu-list>
                    <mu-list-item>
                        <mu-row class="txtContent">
                            <mu-col span="3">
                                <mu-list-item-content>Subject</mu-list-item-content>
                            </mu-col>
                            <mu-col span="9">
                                <mu-list-item-content>{{ticket.Name}}</mu-list-item-content>
                            </mu-col>
                        </mu-row>
                    </mu-list-item>
                </mu-list>
            </mu-flex>
            <mu-flex fill align-items="center" class="itemBody">
                <mu-list>
                    <mu-list-item>
                        <mu-list-item-content>
                            <mu-badge :content="ServiceRequestUserLifeCycleStatusCodeText" color="primary" class="ticketBadge"></mu-badge>
                            <mu-badge :content="ticket.Channel"></mu-badge>
                        </mu-list-item-content>
                    </mu-list-item>
                </mu-list>
            </mu-flex>
        </mu-flex>
    </mu-paper>
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
        },
        computed: {
            ServiceRequestUserLifeCycleStatusCodeText () {
                if (this.ticket.ServiceRequestUserLifeCycleStatusCodeText.indexOf("In Process") != -1) {
                    return "In Process"
                } else {
                    return this.ticket.ServiceRequestUserLifeCycleStatusCodeText
                }
            }
        }
    }
</script>

<style scoped>
.paperContainer {
    width: calc(100% - 10px);
    padding: 5px 0;
    margin: 10px 5px;
    /* border-radius: 5px; */
}
.item {
    /* width: calc(100% - 10px); */
    padding: 5px 0;
    /* margin: 10px 5px; */
    /* margin-bottom: 10px; */
}
.txtContent {
    width: 100%;
}
.itemBody {
    width: 100%;
    height: 25px;

}
.ticketBadge {
    margin-right: 10px;
}
</style>

