<template>
    <div>
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
export default{
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
            isSubmit: true,
            validateRules: [
                { validate: (val) => !!val, message: 'Please input Title' }
            ]
        }
    },
    methods: {
        submitTicket: function() {
            let thiz = this;
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
                        thiz.$toast.success('Create Successfully');
                        thiz.$alert('Create Successfully! TicketID:'+res.data.d.results.ID, 'Info', {
                            okLabel: 'OK'
                        })
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
    }
}

</script>

<style>
.button {
    margin: 1.25rem 2.5rem;
}
</style>
