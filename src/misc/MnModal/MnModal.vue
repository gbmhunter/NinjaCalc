<template>
  <transition name="modal">
    <div class="modal-mask">
        <div class="modal-container">
          <div class="modal-body">
            <slot name="body">
              default body
            </slot>
          </div>        
        </div>
    </div>
  </transition>
</template>

<script>
    /* eslint-disable */
    export default {
        name: 'mn-modal',
        props: {
        },
        data () {
            return {}
        },
        components: {},
        computed: {},
        methods: {},
        watch: {},
        mounted () {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    /* The mask covers the entire page */
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: flex;
        justify-content: center; /* Main axis */
        align-items: center; /* Across aixs */
        transition: opacity .3s ease;
    }

    .modal-container {
        width: 90%;
        height: 90%;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
    }


    .modal-body {
        margin: 20px 0;
    }

    .modal-default-button {
        float: right;
    }

    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>
