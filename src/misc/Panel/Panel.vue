<template>
    <div class="panel-container" style="">        
        <div class="panel-title" v-on:click="titleClicked">{{ title }}</div>
        <transition
            name="collapse"
            @after-enter="onEnter"
            @after-leave="onLeave">
            <div v-show="isOpen" class="panel-content">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
/* eslint-disable */    
    import Velocity from 'velocity-animate'

    
    export default {
        name: 'panel',
        props: {
            title: {type: String}        
        },
        data () {
            return {
                height: 0,
                isOpen: true
            }
        },
        components: {},
        computed: {},
        methods: {
            titleClicked () {
                this.isOpen = !this.isOpen
            },
        },
        watch: {},
        mounted () {
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    div.panel-container {
        border: 1px solid grey;
        border-radius: 3.2px;
    }

    div.panel-title {
        width: 100%;
        padding-top: 10px;
        padding-bottom: 10px;
        color: white;
        font-weight: bold;
        background-color: purple;        
    }

    div.panel-content {
        width: 100%;        
        max-height: 0;
        transition: max-height 0.15s ease-out;
        overflow: hidden;
    }

    div.panel-title:hover {
        max-height: 500px;
        transition: max-height 0.25s ease-in;
    }

    .panel-content .panel-subheading {
        font-weight: bold;
    }
</style>
