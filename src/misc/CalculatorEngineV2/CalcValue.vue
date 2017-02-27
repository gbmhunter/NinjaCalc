<!-- This template is designed to work with CalculatorEngineV2 -->
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <input v-model="calcVar.dispVal" v-on:keyup="calcVar.onDispValChange()" v-tooltip="calcVar.validationMsg"
         class="variable-value" :class="calcVar.validationResult"
         :style="{ width: width + 'px', height: height + 'px' }">

</template>

<script>

  export default {
    name: 'calc-value',
    props: {
      calcVar: {
        type: Object,
        required: true
      },
      width: {
        type: Number,
        required: false,
        default: 150
      },
      height: {
        type: Number,
        required: false,
        default: 40
      }
    },
    components: {},
    computed: {},
    methods: {},
    mounted () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .ok {
    background-color: rgba(45, 255, 0, 0.29);
  }

  .warning {
    background-color: rgba(255, 165, 0, 0.31);
  }

  .error {
    background-color: rgba(255, 0, 0, 0.24);
  }


</style>
