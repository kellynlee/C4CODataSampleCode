<template>
    <div class="chatBox">
        <mu-row gutter v-if="!isInBound" >
            <mu-col span="2">
                <mu-flex class="authorBox" direction="column" justify-content="center" align-items="center">
                    <mu-avatar color="indigo">
                        <mu-icon value="account_circle"></mu-icon>
                    </mu-avatar>
                    <div>{{ message.SocialMediaMessageAuthor }}</div>
                </mu-flex>
            </mu-col>
            <mu-col span="8" direction="column" justify-content="center">
                <div class="textBox outBound">{{ message.Text }}</div>
            </mu-col>
        </mu-row>
        <mu-row gutter v-if="isInBound" >
            <mu-col span="10"  justify-content="center" align-items="start">
                <div class="textBox inBound" >{{ message.Text }}</div>
            </mu-col>
            <mu-col span="2">
                <mu-flex class="authorBox" direction="column" justify-content="center" align-items="center">
                    <mu-avatar color="indigo">
                        <mu-icon value="account_circle"></mu-icon>
                    </mu-avatar>
                    <div>{{ message.SocialMediaMessageAuthor }}</div>
                </mu-flex>
            </mu-col>
        </mu-row>
    </div>
</template>

<script>
    export default {
        data () {
            return {}
        },
        props:{
            message: {
                type: Object
            }
        },
        computed: {
            isInBound () {
                return this.message.inBound
            }
        }
    }
</script>

<style scoped>
.chatBox {
    margin:0.75rem;
}
.authorBox {
    width: 100%;
}
.textBox {
    border-radius: 5px;
    padding: 1rem;
    position: absolute;
}
.outBound {
    background: #eceff1;
    text-align: left;
    display: inline-block;
    left: 0;
}
.inBound {
    background: #4caf50;
    text-align: right;
    display: inline-block;
    right: 0;
}
.inBound:before{
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    right: -9px;
    top: 20px;
    border-left: 10px solid #4caf50;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
}
.outBound:before{
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    left: -9px;
    top: 20px;
    border-right: 10px solid #eceff1;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
}
/* .textBox:after{
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    left: 200px;
    top: 23px;
    border-left: 7px solid #fff;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
} */
</style>

