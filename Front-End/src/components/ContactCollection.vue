<template>
  <div class="mainBody">
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
        <mu-button v-if="isSelected" color="primary" @click="createBP" v-loading="isClick" class="button">Create</mu-button>
        <mu-button v-if="isSelected" class="button" >Cancel</mu-button>
    </mu-paper>
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
            isQuery: true
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
                            thiz.isClick = true;
                            thiz.isQuery = true;
                            thiz.$axios({
                                method: 'post',
                                url: this.CONFIG.url.getContactCollection,
                                data: {
                                    phone: this.formData.phone
                                }
                            }).then((res => {
                                thiz.isClick = false;
                                thiz.isQuery = false;
                                console.log(res)
                                if(res.data.isCreated) {
                                    thiz.$toast.success('Success');
                                } else if (res.data.d.results.length > 0) {
                                    thiz.$toast.success('Success');
                                    thiz.contactList = res.data.d.results.concat();
                                } else {
                                    thiz.$toast.error('No Contact Found');
                                }
                            }))
                        }
                    })
                }
            })
        //   console.log(this.$refs.form);
        },
        createBP: function () {
            var thiz = this;
            var UUID = this.selectedContact.ObjectID.slice(0,8) +"-"+ this.selectedContact.ObjectID.slice(8,12) + "-"+this.selectedContact.ObjectID.slice(12,16) + "-" + this.selectedContact.ObjectID.slice(16,20) + "-" + this.selectedContact.ObjectID.slice(20,this.selectedContact.ObjectID.length);
            this.$axios({
                url: this.CONFIG.url.createBP,
                method: 'post',
                data: {
                    UUID: UUID
                }
            }).then((res) => {
                this.$toast.success('Create Successfully');
                thiz.isSelected = false;
            })
        },
        cancelInput: function () {
            this.formData.phone = '';
        },
    }
}
</script>

<style scoped>
/* @import '//fonts.useso.com/css?family=Roboto:300,400,500,700,400italic'; */
.mainBody {
    height:100%;
    margin: 50px 20px;
}

.radio {
    padding: 1.25rem;
    margin-bottom: 0.625rem;
}


</style>