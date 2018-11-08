<template>
    <div class="mainContent">
        <mu-form :model="form">
            <mu-form-item label="*Title" prop="title" :rules="validateRules">
                <mu-text-field v-model="form.title"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="Problem Description" prop="description" >
                <mu-text-field v-model="form.description"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="SerialID" prop="serialID" >
                <mu-text-field v-model="form.serialID"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="Priority" prop="priority" >
                <mu-text-field v-model="form.priority"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="Request on-site Date" prop="date" >
                <mu-date-input v-model="form.date" type="dateTime"></mu-date-input>
            </mu-form-item>
            <mu-form-item>
                <mu-button class="button" color="primary" @click="submitTicket" v-loading="isSubmit">{{Submit}}</mu-button>
                <mu-button class="button" @click="cancelInput">Cancel</mu-button>
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
                priority:'',
                date:''
            },
            Submit: 'Submit',
            isSubmit: false,
            validateRules: [
                { validate: (val) => !!val, message: 'Please input Title' }
            ]
        }
    },
    methods: {
        submitTicket: function() {
            let thiz = this;
            let isPrd =  Object.is(process.env.NODE_ENV, 'production');
            if (!this.form.title) {
                this.$alert()
            } else {
                this.isSubmit = true;
                // this.Submit = "Submitting"
                // const loading = this.$loading();
                this.$axios({
                    url: this.CONFIG.url.createTicket,
                    data: {
                        Name: this.form.title,
                        Description: this.form.description,
                        SerialID: this.form.serialID,
                        ServicePriorityCode: this.form.priority,
                        OnSiteArrivalDateTime: this.form.date
                    },
                    method: 'post'
                }).then((res) => {
                    console.log(res);
                    // loading.close();
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
                })
            }
        },
        cancelInput: function () {
            this.form = {
                title: '',
                description:'',
                serialID:'',
                priority:'',
                date:''
            }
        }
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
                debug: true,
                appId: data.data.appId,
                timestamp: data.data.timestamp,
                nonceStr: data.data.nonceStr,
                signature: data.data.signature,
                jsApiList: ['closeWindow']
            })
        })
    }
}

</script>

<style scoped>
.mainContent {
    margin: 50px 20px;
}

</style>
