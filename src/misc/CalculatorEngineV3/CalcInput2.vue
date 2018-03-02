<!-- This template is designed to work with CalculatorEngineV2 -->
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <md-tooltip md-direction="top" v-html="toolTipMsg"></md-tooltip>
    <input
      ref="varValue"
      :value="value.value"
      :disabled="value.dir === 'out'"
      class="variable-value"
      :class="inputClasses"
      @input="updateValue()">
  </div>
</template>

<script>

  import './style.css'

  export default {
    name: 'calc-input-2',
    props: {
      value: {
        type: [Object],
        required: true
      }
    },
    components: {},
    data () {
      return {}
    },
    computed: {
      isDisabled () {
        if (this.value.dir === 'input') {
          return false
        } else if (this.value.dir === 'output') {
          return true
        } else {
          throw Error('Direction not recognized.')
        }
      },
      toolTipMsg () {
        // This is raw HTML (so we can add line breaks)
        var toolTipMsg = ''
        toolTipMsg += this.value.tooltip
        toolTipMsg += '<br><br>'
        toolTipMsg += this.value.validator.msg
        return toolTipMsg
      },
      inputClasses () {
        return [
          { 'dirIn': this.value.dir === 'in' },
          { 'dirOut': this.value.dir === 'out' },
          { 'error': this.value.validator.state === 'error' },
          { 'ok': this.value.validator.state === 'ok' }
        ]
      }
    },
    methods: {
      updateValue () {
        console.log('updateValue() called. this.$refs.varValue.value = ')
        console.log(this.$refs.varValue.value)
        this.$emit('input', {
          value: this.$refs.varValue.value,
          dir: this.value.dir,
          tooltip: this.value.tooltip,
          validator: this.value.validator
        })
      }
    },
    watch: {},
    mounted () {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
