<!-- This template is designed to work with CalculatorEngineV2 -->
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <md-tooltip md-direction="top" v-html="toolTipMsg"></md-tooltip>
    <input type="checkbox"
      v-model="calcVar.val" v-on:keyup="calcVar.onValChange()"
           :class="[ calcVar.validationResult, calcVar.typeEqn() ]"
           :readonly="readonly"
           :style="{ width: width + 'px', height: height + 'px' }">
  </div>
</template>

<script>

  import '../style.css'

  export default {
    name: 'calc-var-checkbox',
    props: {
      calcVar: {
        type: Object,
        required: true
      },
      width: {
        type: Number,
        required: false,
        default: 100
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
      },
      toolTipMsg () {
        // This is raw HTML (so we can add line breaks)
        var toolTipMsg = ''
        toolTipMsg += this.calcVar.helpText
        toolTipMsg += '<br><br>'
        toolTipMsg += this.calcVar.validationMsg
        return toolTipMsg
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
