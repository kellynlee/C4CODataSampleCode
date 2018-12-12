<template>
    <div class="detailContent">
            <mu-list textline="two-line">
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Subject</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.Name}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Account</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.BuyerPartyName}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Contact/Individual Customer</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.BuyerMainContactPartyName}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Description</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.Name}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Priority</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.ServicePriorityCodeText}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Status</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.ServiceRequestUserLifeCycleStatusCodeText}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Processor</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.ProcessorPartyName}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Product Description</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.ProductDescription}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Product SerialID</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.SerialID}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>ServiceTechnician:</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.ServicePerformerPartyName}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Country: </mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.CountryText}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Street: </mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.Street}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>HouseNumber: {{detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.HouseNumber}}</mu-list-item-title>
                        <mu-list-item-sub-title></mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>City: </mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.City}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>State: </mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.State}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Postal: </mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.PostalCode}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Requested Start Time:</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.RequestedFulfillmentPeriodStartDateTime}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Requested End Time:</mu-list-item-title>
                        <mu-list-item-sub-title>{{detail.RequestedFulfillmentPeriodEndDateTime}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
            </mu-list>
            <mu-flex justify-content="center" align-item="center">
                <div class="btnBox">
                    <mu-button round color="primary" :disabled="!detail.isOrigin" @click="open" full-width>
                        Reply
                        <mu-icon right value="send"></mu-icon>
                    </mu-button>
                </div>
            </mu-flex>
            <mu-dialog title="Reply" width="360" transition="slide-bottom" fullscreen :open.sync="openDialog">
                <mu-text-field v-model="msg" multi-line :rows="8" :max-length="208" icon="comment"  placeholder="Input Reply Message" full-width style="padding-right: 20px"></mu-text-field><br/>
                <mu-button slot="actions" flat color="primary" @click="replyMsg" :disabled="isInputValue">Reply</mu-button>
                <mu-button slot="actions" flat color="primary" @click="cancel">Cancel</mu-button>
            </mu-dialog>
        </div>
</template>

<script>
    export default {
        data () {
            return {
                isEnable: true,
                openDialog: false,
                msg: ''
            }
        },
        props: {
            detail: {
                type: Object
            }
        },
        computed: {
            isInputValue () {
                if (this.msg.length > 0) {
                    return false;
                } else {
                    return true;
                }
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
                    this.$parent.WXUserInfo.then((userInfo) => {
                        this.$axios({
                            method:'post',
                            url: this.CONFIG.url.replyMsg,
                            data: {
                                openID: userInfo.openid,
                                nickname:userInfo.nickname,
                                msg: this.msg,
                                ID: this.detail.RootSocialMediaActivity.ID
                            }
                        }).then((res) => {
                            loading.close();
                            console.log(res.data)
                            if(res.status == 200) {
                                this.openDialog = false;
                                this.$toast.success('Reply successfully!');
                            } else {
                                this.openDialog = false;
                                this.$toast.error('Reply Failed!')
                            }
                        })
                    })
                }
                // this.openDialog = false;

            },
            cancel: function () {
                this.openDialog = false;
                this.msg = '';
            }
        }
    }
</script>

<style scoped>
.btnBox {
    width: 50%;
    margin-bottom: 20px;
}
</style>


