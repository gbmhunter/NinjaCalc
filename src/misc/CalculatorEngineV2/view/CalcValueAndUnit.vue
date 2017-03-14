<!-- This template is designed to work with CalculatorEngineV2 -->
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div :id="calcVar.name" class="value-unit-container">
    <div>
      <md-tooltip md-direction="top" v-html="toolTipMsg"></md-tooltip>
      <input v-model="calcVar.dispVal" v-on:keyup="calcVar.onDispValChange()"
             :readonly="readonly"
             class="variable-value" :class="[ calcVar.validationResult, calcVar.typeEqn() ]" :style="{ width: width + 'px', height: height + 'px' }">
    </div>
    <select v-model="calcVar.selUnitName" v-on:change="calcVar.onUnitChange()" class="variable-units" :style="{ height: height + 'px' }">
      <option v-for="option in calcVar.units" v-bind:value="option.name">
        {{ option.name }}
      </option>
    </select>
  </div>

</template>

<script>

  import '../style.css'

  export default {
    name: 'calc-value-and-unit',
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
    mounted () {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .value-unit-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .variable-units {
    height: 40px;
    margin-left: 5px;
  }

</style>
