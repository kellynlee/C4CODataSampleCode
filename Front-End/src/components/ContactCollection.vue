<template>
    <div class="mainBody">
        <div v-if="!isLinked">
            <mu-form ref='form' :model="formData" :label-width="80">
                <mu-form-item prop="phone" label="Phone" :rules="inputValidator">
                    <mu-text-field v-model="formData.phone" prop="phone"></mu-text-field>
                </mu-form-item>
                <mu-form-item>
                    <mu-button color="primary" @click="submitData" data-mu-loading-size="24" class="button" :disabled="isClick" v-loading="isClick">Submit</mu-button>
                    <mu-button @click="cancelInput" class="button">Cancel</mu-button>
                </mu-form-item>
            </mu-form>
            <mu-paper class="paper" :z-depth="4">
                <mu-flex v-for="contact in contactList" :key="contact.id" class="radioContent">
                    <mu-radio :value="contact" :label="contact.FirstName" v-model="selectedContact" @change="onSelect" class="radio"></mu-radio>
                </mu-flex>
                <mu-button v-if="isSelected" color="primary" @click="createBP" class="button">Create</mu-button>
                <mu-button v-if="isSelected" class="button" >Cancel</mu-button>
            </mu-paper>
        </div>
        <div v-if="isLinked">
            <mu-list>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Your Contact:</mu-list-item-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Name:</mu-list-item-title>
                        <mu-list-item-sub-title>{{contactDetail.Name}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item>
                    <mu-list-item-content>
                        <mu-list-item-title>Phone:</mu-list-item-title>
                        <mu-list-item-sub-title>{{contactDetail.Phone}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
            </mu-list>
        </div>
    </div>
</template>

<script> 
import wx from 'weixin-jsapi';

export default {
    data () {
        return {
            inputValidator :[
            { validate: (val) => !!val, message: 'Please input phone number' }
            ],
            formData: {
            phone:''
            },
            contactList:[],
            selectedContact: '',
            isClick: false,
            isSelected: false,
            isQuery: true,
            contactDetail: {},
            isLinked: false
        }
    },
    computed: {
        wxCode () {
            return this.$route.query.code;
        }
    },
    methods: {
        onSelect: function () {
            this.isSelected = true;
        },

        submitData: function () {
            // console.log(Object.is(process.env.NODE_ENV, 'production'));
            var thiz = this;
            var urlList = this.CONFIG.Url;
            let numValidate = /^[0-9]*$/;
            this.$refs.form.validate().then((result) => {
                if (!result) {
                    thiz.$alert('Please input phone', 'Alert');
                } else if(!numValidate.test(thiz.formData.phone)) {
                    thiz.$alert('Please input number', 'Alert');
                } else if (thiz.formData.phone.length<11) {
                    thiz.$alert('Please input valid phone number')
                } else {
                    thiz.$confirm('Confirm your information?', 'Confirm').then(({ result }) => {
                        if (result) {
                            var loading = this.$loading();
                            thiz.isQuery = true;
                            this.WXUserInfo.then((userInfo) => {
                                thiz.$axios({
                                    method: 'post',
                                    url: this.CONFIG.url.getContactCollection,
                                    data: {
                                        openID: userInfo.openid,
                                        nickName: userInfo.nickname,
                                        headImageUrl: userInfo.headimgurl,
                                        phone: this.formData.phone
                                    }
                                }).then((res => {
                                    thiz.isQuery = false;
                                    console.log(res)
                                    if(res.data.isCreated) {
                                        thiz.$toast.success('Success');
                                        this.$axios({
                                            method:'post',
                                            url: this.CONFIG.url.getSMUP,
                                            data: {
                                                openID: userInfo.openid
                                            }
                                        }).then((res) => {
                                            loading.close();
                                            if (res.data) {
                                                this.contactDetail = res.data;
                                                this.isLinked = true
                                            }
                                        })
                                    } else if (res.data.length > 0) {
                                        loading.close();
                                        thiz.$toast.success('Success');
                                        thiz.contactList = res.data.concat();
                                    } else {
                                        loading.close();
                                        thiz.$alert('No Contact Found');
                                    }
                                })).catch((err) => {
                                    loading.close();
                                    thiz.$alert('Create Failed');
                                })
                            })
                        }
                    })
                }
            })
        },
        createBP: function () {
            var thiz = this;
            var UUID = this.selectedContact.ObjectID.slice(0,8) +"-"+ this.selectedContact.ObjectID.slice(8,12) + "-"+this.selectedContact.ObjectID.slice(12,16) + "-" + this.selectedContact.ObjectID.slice(16,20) + "-" + this.selectedContact.ObjectID.slice(20,this.selectedContact.ObjectID.length);
            var loading = this.$loading();
            this.WXUserInfo.then((userInfo) => {
                this.$axios({
                    url: this.CONFIG.url.createBP,
                    method: 'post',
                    data: {
                        UUID: UUID,
                        openID: userInfo.openid,
                        nickName: userInfo.nickname,
                        headImageUrl: userInfo.headimgurl,
                    }
                }).then((res) => {
                    loading.close();
                    if (res.data.isCreated) {
                        this.$toast.success('Create Successfully');
                        thiz.isSelected = false;
                    } else {
                        throw new Error;
                    }
                }).catch((err) => {
                    loading.close();
                    thiz.$alert('Create Failed');
                })
            })
        },
        cancelInput: function () {
            this.formData.phone = '';
        },
    },
    mounted () {
        // let code = this.$router.query.code;
        console.log(this.wxCode);
        let loading = this.$loading();
        this.WXUserInfo = this.common.getWXUserInfo(this.wxCode);
        this.WXUserInfo.then((userInfo) => {
            this.$axios({
                method:'post',
                url: this.CONFIG.url.getSMUP,
                data: {
                    openID: userInfo.openid
                }
            }).then((res) => {
                loading.close();
                if (res.data) {
                    this.contactDetail = res.data;
                    this.isLinked = true
                }
            })
        })
    }
}
</script>

<style scoped>
/* @import '//fonts.useso.com/css?family=Roboto:300,400,500,700,400italic'; */
.mainBody {
    height:100%;
    margin: 1.25rem;
}

.radio {
    padding: 1.25rem;
    margin-bottom: 0.625rem;
}


</style>