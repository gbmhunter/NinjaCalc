<template>
    <div class="panel-container" style="">
        <div class="panel-title">{{ title }}</div>
        <div class="panel-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    export default {
        name: 'panel',
        props: {
            title: {type: String}        
        },
        data () {
            return {}
        },
        components: {},
        computed: {},
        methods: {},
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
        height: 100%;
        padding: 10px;
    }

    .panel-content .panel-subheading {
        font-weight: bold;
    }
</style>
