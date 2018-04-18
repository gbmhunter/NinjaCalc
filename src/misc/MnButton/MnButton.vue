<template>
    <button @click="onClick" v-bind:class="buttonClasses"><slot></slot></button>
</template>

<script>
    /* eslint-disable */
    export default {
        name: 'panel',
        props: {
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
        mounted () {
            console.log('mn-button mounted. this.buttonClasses = ')
            console.log(this.buttonClasses)
        }
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

    .mnbutton.danger {
        color: rgb(255, 255, 255);
        background-color: rgb(220, 53, 69);
    }

    .mnbutton.danger:hover {        
        background-color: rgb(212, 45, 61);
    }
</style>
