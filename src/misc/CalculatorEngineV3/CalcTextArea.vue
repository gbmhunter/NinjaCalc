<!-- This template is designed to work with CalculatorEngineV2 -->
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
  <md-tooltip md-direction="top" v-html="toolTipMsg"/>
  <textarea
    ref="varValue"
    :value="value.value"
    class="calc-textarea"
    :class="inputClasses"
    @input="updateValue()"
    style="width: 100%; height: 100%;">
  </textarea>
  </div>
</template>

<script>

import './style.css'

export default {
  name: 'calc-textarea',
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
    inputClasses () {
      return [
        { 'dirIn': this.value.dir === 'in' },
        { 'dirOut': this.value.dir === 'out' },
        { 'error': this.value.validator.state === 'error' },
        { 'ok': this.value.validator.state === 'ok' }
      ]
    },
    toolTipMsg () {
      // This is raw HTML (so we can add line breaks)
      var toolTipMsg = ''
      toolTipMsg += this.value.help
      toolTipMsg += '<br><br>'
      toolTipMsg += this.value.validator.msg
      return toolTipMsg
    }
  },
  methods: {
    updateValue () {
      // Clone object, update the object with the new text in the textarea,
      // and then emit cloned object
      var value = JSON.parse(JSON.stringify(this.value))
      value.value = this.$refs.varValue.value
      this.$emit('input', value)
    }
  },
  watch: {},
  mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
