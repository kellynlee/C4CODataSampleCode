<template>
    <div class="mainContent">
        <mu-appbar style="width: 100%;" color="primary" class="header">
            <mu-button icon slot="left" @click="backToList">
                <mu-icon value="keyboard_backspace"></mu-icon>
            </mu-button>
            Detail
        </mu-appbar>
        <div class="listContent">
            <mu-list textline="two-line">
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Subject</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.Name}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Account</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.BuyerPartyName}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Contact/Individual Customer</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.BuyerMainContactPartyName}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Description</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.Name}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Priority</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.ServicePriorityCodeText}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Status</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.ServiceRequestUserLifeCycleStatusCodeText}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Prosser</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.ProcessorPartyName}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Product Description</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.ProductDescription}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Product SerialID</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.SerialID}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Warranty</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.WarrantyGoodwillCode}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>WarrantyDate: </mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.WarrantyStartdatetimeContent}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>ServiceTechnician:</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.ServicePerformerPartyName}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Country: </mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.ServiceRequestLocation.CountryText}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Street: </mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.ServiceRequestLocation.Street}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>HouseNumber: {{ticketDetail.ServiceRequestLocation.HouseNumber}}</mu-list-item-title>
                        <mu-list-item-sub-title></mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>City: </mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.ServiceRequestLocation.City}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>State: </mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.ServiceRequestLocation.State}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Postal: </mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.ServiceRequestLocation.PostalCode}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Requested Start Time:</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.RequestedFulfillmentPeriodStartDateTime}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Requested End Time:</mu-list-item-title>
                        <mu-list-item-sub-title>{{ticketDetail.RequestedFulfillmentPeriodEndDateTime}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
            </mu-list>
            <mu-flex justify-content="center" align-item="center">
                <div class="btnBox">
                    <mu-button round color="primary" :disabled="!ticketDetail.isOrigin" @click="open" full-width>
                        Reply
                        <mu-icon right value="send"></mu-icon>
                    </mu-button>
                </div>
            </mu-flex>
            <mu-dialog title="Dialog" width="360" transition="slide-bottom" fullscreen :open.sync="openDialog">
                <mu-text-field v-model="msg" multi-line :rows="4" icon="comment"  placeholder="Input Reply Message" full-width></mu-text-field><br/>
                <mu-button slot="actions" flat color="primary" @click="replyMsg">Reply</mu-button>
                <mu-button slot="actions" flat color="primary" @click="cancel">Cancel</mu-button>
            </mu-dialog>
        </div>
        <mu-bottom-nav class="tabBar">
            <mu-bottom-nav-item title="Detail" icon="details"></mu-bottom-nav-item>
            <mu-bottom-nav-item title="History" icon="history"></mu-bottom-nav-item>
        </mu-bottom-nav>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                ticketDetail:{
                    ServiceRequestLocation: {}
                },
                isEnable: true,
                openDialog: false,
                msg: ''
            }
        },
        computed: {
            ticketID () {
                return this.$route.params.id;
            }
        },
        methods: {
            backToList: function () {
                this.$router.push('/TicketList');
            },
            open: function () {
                this.openDialog = true;
            },
            replyMsg: function () {
                let loading = this.$loading();
                if (this.msg.length > 0) {
                    this.$axios({
                        method:'post',
                        url: this.CONFIG.url.replyMsg,
                        data: {
                            msg: this.msg,
                            ID: this.ticketDetail.SocialMediaActivityID
                        }
                    }).then((res) => {
                        loading.close();
                        if(res.status == 200) {
                            this.openDialog = false;
                            this.$toast.success('Reply successfully!');
                        } else {
                            this.openDialog = false;
                            this.$toast.error('Reply Failed!')
                        }
                    })
                }
                // this.openDialog = false;

            },
            cancel: function () {
                this.openDialog = false;
                this.msg = '';
            }
        },
        mounted () {
            // console.log(this.ticketID)
            let loading = this.$loading();
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
    /* overflow: hidden; */
}
.clear {
    clear: both;
}
.listContent {
    width: 100%;
    overflow: hidden;
    top: 3rem;
    position: absolute;
    margin-bottom: 3.5rem;
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

