<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <tr>
    <td>{{ variableName }}</td>
    <td>\({{ symbol }}\)</td>
    <td><calc-value :calcVar="calcVar" :width=120></calc-value></td>
    <td>
      <!--<calc-units :calcVar="calcVar"></calc-units>-->
    </td>
    <td>{{ notes }}</td>
  </tr>

</template>

<script>

//  import { CalcVarNumeric } from 'src/misc/CalculatorEngineV2/CalcVarNumeric'
//  import { UnitMulti } from 'src/misc/CalculatorEngineV2/UnitMulti'
//  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'table-row',
    components: {},
    props: {
      variableName: {
        type: String,
        required: true
      },
      symbol: {
        type: String,
        required: true
      },
      calcVar: {
        type: Object,
        required: true
      },
      notes: {
        type: String,
        required: true
      }
    },
    data: function () {
      return {
      }
    },
    mounted () {
      if (window.MathJax) window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
