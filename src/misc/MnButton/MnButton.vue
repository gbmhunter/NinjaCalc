<template>
    <button @click="onClick" v-bind:class="buttonClasses" :disabled="disabledB"><slot></slot></button>
</template>

<script>
    /* eslint-disable */
    export default {
        name: 'panel',
        props: {
            disabledB: {
                type: Boolean,
                default: false
            },
            onClick: {
                type: Function,
                required: true
            },
            variant: {type: String}        
        },
        data () {
            return {}
        },
        components: {},
        computed: {
            buttonClasses () {
                return {
                    mnbutton: true,
                    primary: this.variant === 'primary',
                    success: this.variant === 'success',
                    danger: this.variant === 'danger'
                }
            }
        },
        methods: {},
        watch: {},
        mounted () {},
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .mnbutton {
        border: purple;
        border-radius: 3px;
    }

    

    .mnbutton.primary {
        color: rgb(255, 255, 255);
        background-color: rgb(0, 123, 255);
    }

    .mnbutton.primary:hover {        
        background-color: rgb(0, 98, 204);
    }

    .mnbutton.success {
        color: rgb(255, 255, 255);
        background-color: rgb(40, 167, 69);
    }

    .mnbutton.success:hover {        
        background-color: rgb(33, 136, 56);
    }

    .mnbutton.success:disabled {
        background-color: gray;        
    }

    .mnbutton.danger {
        color: rgb(255, 255, 255);
        background-color: rgb(220, 53, 69);
    }

    .mnbutton.danger:hover {        
        background-color: rgb(212, 45, 61);
    }

    .mnbutton.danger:disabled {
        background-color: gray;        
    }
</style>
