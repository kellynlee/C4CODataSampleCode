<template>
    <div class="mainContent">
        <mu-form :model="form" ref="form">
            <mu-form-item label="*Subject" prop="title" :rules="SubjectValidate">
                <mu-text-field v-model="form.title"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="*Problem Description" prop="description" :rules="DescriptionValidate">
                <mu-text-field v-model="form.description"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="SerialID" prop="serialID" ref="serialID" :rules="SerialIDValidate">
                <mu-text-field v-model="form.serialID" style="width: 80%"></mu-text-field>
                <mu-button color="primary" v-loading="isClick" data-mu-loading-size="24" data-mu-loading-overlay-color="hsla(0,0%,98%,.9)" :ripple = "false" :flat = "true" small @click="registeredProductCompletion" style="min-width:20%; margin-right:0; margin-left:0">
                    <mu-icon value="search"></mu-icon>
                </mu-button>
            </mu-form-item>
            <mu-form-item label="ProductID" ref="productID" prop="productID" :rules="ProductValidate">
                <mu-text-field v-model="form.productID"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="Priority" prop="priority" >
                <mu-select v-model="form.priority" @change="ChangeSelect">
                    <mu-option v-for="option in codeOptions" :key="option.code" :label="option.text" :value="option.code"></mu-option>
                </mu-select>
            </mu-form-item>
            <mu-form-item label="Request on-site Date" prop="date" >
                <mu-date-input v-model="form.date" type="dateTime"></mu-date-input>
            </mu-form-item>
            <mu-form-item>
                <mu-button class="button" color="primary" @click="submitTicket">{{Submit}}</mu-button>
                <mu-button class="button" @click="cancelInput">Reset</mu-button>
            </mu-form-item>
        </mu-form>
    </div>
</template>

<script>
import wx from 'weixin-jsapi';
import { isPrimitive } from 'util';

export default {
    data () {
        return {
            form: {
                title: '',
                description:'',
                serialID:'',
                productID:'',
                priority:'',
                date:''
            },
            isClick: false,
            Submit: 'Submit',
            isSubmit: false,
            SubjectValidate: [
                { validate: (val) => !!val, message: 'Please Input Subject' }
            ],
            DescriptionValidate: [
                { validate: (val) => !!val, message: 'Please Input Description' }
            ],
            SerialIDValidate: [
                {validate: (val) => /^[0-9a-zA-Z]+$/.test(val) || val == "", message:'SerialID hould be letter and number'}
            ],
            codeOptions: [
                {code:"1",text:"Immediate"},
                {code:"2",text:"Urgent"},
                {code:"3",text:"Normal"},
                {code:"7",text:"Low"}
            ],
        }
    },
    computed: {
        wxCode () {
            return this.$route.query.code;
        },
        ProductValidate() {
            let validate = [{validate: (val) => !!val, message: 'Please Input ProductID'}];
            if (this.form.serialID.length > 0) {
                return validate
            } else {
                if (this.$refs.productID) {
                    this.$refs.productID.errorMessage = "";
                }
            }
        }
    },
    methods: {
        registeredProductCompletion: function() {
            if (!this.$refs.serialID.validate() || this.form.serialID.length == 0) {
                return false
            } else{
                this.WXUserInfo.then((userInfo) => {
                    this.isClick = true;
                    this.$axios({
                        url: this.CONFIG.url.getRegisteredProduct,
                        data: {
                            openID: userInfo.openid,
                            SerialID: this.form.serialID,
                        },
                        method: 'post'
                    }).then((res) => {
                        this.isClick = false;
                        if(res.status == 200) {
                            this.form.productID = res.data;
                        }
                    }).catch((err) => {
                        this.isClick = false
                        this.$alert(err.response.data);
                    })
                })
            }
        },
        submitTicket: function() {
            let thiz = this;
            let isPrd =  Object.is(process.env.NODE_ENV, 'production');
            this.$refs.form.validate().then((result) => {
                if (!result) {
                    return false
                } else {
                    thiz.$confirm('Confirm your information?', 'Confirm').then(({ result }) => {
                        if (result) {
                            var loading = this.$loading();
                            this.WXUserInfo.then((userInfo) => {
                                this.$axios({
                                    url: this.CONFIG.url.createTicket,
                                    data: {
                                        openID: userInfo.openid,
                                        nickName: userInfo.nickname,
                                        Name: this.form.title,
                                        Description: this.form.description,
                                        SerialID: this.form.serialID,
                                        ProductID: this.form.productID,
                                        ServicePriorityCode: this.form.priority,
                                        RequestedFulfillmentPeriodStartDateTime: this.form.date
                                    },
                                    method: 'post'
                                }).then((res) => {
                                    loading.close();
                                    if(res.status == 200) {
                                        // thiz.Submit = 'Submit';
                                        thiz.isSubmit = false;
                                        thiz.$toast.success('Create Successfully');
                                        if (isPrd) {
                                            wx.ready(() => {
                                                wx.closeWindow();
                                            })
                                        }
                                    }
                                }).catch((err) => {
                                    loading.close();
                                    thiz.$alert(err.response.data);
                                    // if (isPrd) {
                                    //     wx.ready(() => {
                                    //         wx.closeWindow();
                                    //     })
                                    // }
                                })
                            })
                        }
                    })
                }
            });
        },
        cancelInput: function () {
            this.$refs.form.clear();
            this.form = {
                title: '',
                description:'',
                serialID:'',
                productID:'',
                priority:'',
                date:''
            }
        },
        ChangeSelect: function () {}
    },
    mounted: function () {
        this.$axios({
            method: 'post',
            url: this.CONFIG.url.wxConfig,
            data: {
                url: location.href.split('#')[0]
            }
        }).then((data) => {
            console.log(data.data);
            wx.config({
                debug: false,
                appId: data.data.appId,
                timestamp: data.data.timestamp,
                nonceStr: data.data.nonceStr,
                signature: data.data.signature,
                jsApiList: ['closeWindow']
            })
        });
        this.WXUserInfo = this.common.getWXUserInfo(this.wxCode);
    }
}

</script>

<style scoped>
.mainContent {
    margin: 1.25rem;
}

</style>
