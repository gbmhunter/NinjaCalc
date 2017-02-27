<!-- This template is designed to work with CalculatorEngineV2 -->
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <input v-model="calcVar.dispVal" v-on:keyup="calcVar.onDispValChange()" v-tooltip="calcVar.validationMsg"
         class="variable-value" :class="[ calcVar.validationResult, calcVar.typeEqn() ]"
         :readonly="readonly"
         :style="{ width: width + 'px', height: height + 'px' }">
</template>

<script>

  import './style.css'

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
        default: 35
      }
    },
    components: {},
    computed: {
      readonly () {
        if (this.calcVar.typeEqn() === 'output') {
          return true
        } else {
          return false
        }
      }
    },
    methods: {},
    mounted () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
