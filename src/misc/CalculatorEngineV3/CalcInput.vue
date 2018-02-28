<!-- This template is designed to work with CalculatorEngineV2 -->
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <md-tooltip md-direction="top" v-html="toolTipMsg"></md-tooltip>
    <input v-model="internalValue" :disabled="isDisabled" class="variable-value">
  </div>
</template>

<script>

  export default {
    name: 'calc-input',
    props: {
      value: {
        type: [String, Number],
        required: false,
        default: ''
      },
      dir: {
        type: [String],
        required: true
      },
      tooltip: {
        type: String,
        required: false,
        default: ''
      }
    },
    components: {},
    data () {
      return {
        internalValue: this.value
      }
    },
    computed: {
      isDisabled () {
        if (this.dir === 'input') {
          return false
        } else if (this.dir === 'output') {
          return true
        } else {
          throw Error('Direction not recognized.')
        }
      },
      toolTipMsg () {
        // This is raw HTML (so we can add line breaks)
        var toolTipMsg = ''
        toolTipMsg += this.tooltip
        toolTipMsg += '<br><br>'
        toolTipMsg += 'Testing!'
        return toolTipMsg
      }
    },
    methods: {},
    watch: {
      internalValue (val) {
        this.$emit('input', val)
      }
    },
    mounted () {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
