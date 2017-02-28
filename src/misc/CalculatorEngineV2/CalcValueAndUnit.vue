<!-- This template is designed to work with CalculatorEngineV2 -->
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="value-unit-container">
    <div>
      <md-tooltip md-direction="top" v-html="toolTipMsg"></md-tooltip>
      <input v-model="calcVar.dispVal" v-on:keyup="calcVar.onDispValChange()"
             :readonly="readonly"
             class="variable-value" :class="[ calcVar.validationResult, calcVar.typeEqn() ]">
    </div>
    <select v-model="calcVar.selUnit" v-on:change="calcVar.onUnitChange()" class="variable-units">
      <option v-for="option in calcVar.units" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>

</template>

<script>

  import './style.css'

  export default {
    name: 'calc-value-and-unit',
    props: {
      calcVar: {
        type: Object,
        required: true
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
      console.log('CalcValue.mounted() called.')
      console.log('this.calcVar =')
      console.log(this.calcVar)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .value-unit-container {
    display: flex;
    align-items: center;
  }

  .variable-value {
    width: 150px;
    height: 40px;
  }

  .variable-units {
    height: 40px;
    margin-left: 5px;
  }

</style>
