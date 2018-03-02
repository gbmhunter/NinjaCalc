<!-- This template is designed to work with CalculatorEngineV2 -->
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <md-tooltip md-direction="top" v-html="toolTipMsg"></md-tooltip>
    <input
      v-model="value"
      :disabled="this.dir === 'out'"
      class="variable-value"
      :class="inputClasses">
  </div>
</template>

<script>

  import './style.css'

  export default {
    name: 'calc-input',
    props: {
      value: {
        type: [String, Number],
        required: true
      },
      dir: {
        type: [String],
        required: true,
        validator (value) {
          if (value === 'in') {
            return true
          } else if (value === 'out') {
            return true
          } else {
            return false
          }
        }
      },
      tooltip: {
        type: String,
        required: false,
        default: ''
      },
      validator: {
        type: Object,
        required: false,
        default: function () { return { state: 'ok', msg: '' } }
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
        toolTipMsg += this.validator.msg
        return toolTipMsg
      },
      inputClasses () {
        return [
          { 'dirIn': this.dir === 'in' },
          { 'dirOut': this.dir === 'out' },
          { 'error': this.validator.state === 'error' },
          { 'ok': this.validator.state === 'ok' }
        ]
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
