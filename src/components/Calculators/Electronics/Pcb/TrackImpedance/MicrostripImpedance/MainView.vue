<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container" style="margin: auto;">

    <!-- SPACER -->
    <div style="height: 50px;"></div>

    <ui-collapsible title="Info" class="calc-info" style="max-width: 800px;">
      <p>This calculator can find the impedance of various microstrip and stripline style PCB tracks.</p>
    </ui-collapsible>

    <!-- SPACER -->
    <div style="height: 50px;"></div>

    <div class="diagram-container" style="position: relative; width: 600px; height: 450px;">

      <!-- Background image is centered in diagram container -->
      <canvas ref="canvas" style="width: 600px; height: 450px; left: 0px; top: 0px;"></canvas>

    </div>

  </div>
</template>

<script>

  import Calc from '../../../../../../misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeric, NumericValidators} from '../../../../../../misc/CalculatorEngineV2/CalcVarNumeric'
//  import {CalcVarComboBox} from 'src/misc/CalculatorEngineV2/CalcVarComboBox'
  import {UnitMulti} from '../../../../../../misc/CalculatorEngineV2/UnitMulti'
//  import {UnitFunc} from 'src/misc/CalculatorEngineV2/UnitFunc'
  import {CustomValidator} from '../../../../../../misc/CalculatorEngineV2/CustomValidator'
//  import {unitConversionConstants} from 'src/misc/UnitConversionConstants/UnitConversionConstants'
  import { canvasShapes } from '../../../../../../misc/CanvasShapes/CanvasShapes'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'microstrip-and-stripline-impedance-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // ============================================ //
      // ============ TRACK CURRENT (input) ========= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'trackCurrent',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'uA', multi: 1e-6}),
          new UnitMulti({name: 'mA', multi: 1e-3}),
          new UnitMulti({name: 'A', multi: 1e0})
        ],
        defaultUnitName: 'A',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              var trackCurrent = calc.getVar('trackCurrent').getRawVal()
              return (trackCurrent <= 35.0)
            },
            text: 'Current is above recommended maximum (35A). Equation will not be as accurate (extrapolation will occur).',
            level: 'warning'
          })
        ],
        helpText: 'The current you want the PCB track to be able to handle.'
      }))

      // Configure calculator to default state now that all
      // variables have been added.
      calc.init()

      return {
        calc: calc
      }
    },
    computed: {
    },
    watch: {
    },
    methods: {
      drawCanvas: function () {
        console.log('drawCanvas() called.')
        var canvas = this.$refs.canvas
        var context = canvas.getContext('2d')
        canvas.width = 600
        canvas.height = 450

        const copperThickness = 40
        const pcbThickness = 80
        const pcbWidth = 400

        const topLeftX = 100
        const topLeftY = 100

        // ============================================ //
        // ================ COPPER TRACK ============== //
        // ============================================ //
        const trackWidth = 80
        const trackStartY = topLeftY + pcbThickness
        const trackStopY = trackStartY + copperThickness

        context.beginPath()
        context.rect(topLeftX + pcbWidth / 2 - trackWidth / 2, trackStartY, trackWidth, copperThickness)
        context.fillStyle = '#d9a654'
        context.fill()
        context.lineWidth = 2
        context.strokeStyle = 'black'
        context.stroke()

        // ============================================ //
        // ==================== FR4  ================== //
        // ============================================ //
        const fr4StartY = trackStopY
        const fr4StopY = fr4StartY + pcbThickness

        context.beginPath()
        context.rect(topLeftX, fr4StartY, pcbWidth, pcbThickness)
        context.fillStyle = '#3d8f00'
        context.fill()
        context.lineWidth = 2
        context.strokeStyle = 'black'
        context.stroke()

        // ============================================ //
        // ============ BOTTOM COPPER PLANE  ========== //
        // ============================================ //
        const botCopperPlaneStartY = fr4StopY

        context.beginPath()
        context.rect(topLeftX, botCopperPlaneStartY, pcbWidth, copperThickness)
        context.fillStyle = '#d9a654'
        context.fill()
        context.lineWidth = 2
        context.strokeStyle = 'black'
        context.stroke()

        // ============================================ //
        // ============= TRACK WIDTH ARROW ============ //
        // ============================================ //
        const trackWidthArrowStartX = topLeftX + pcbWidth / 2 - (trackWidth / 2)
        const trackWidthArrowStopX = topLeftX + pcbWidth / 2 + (trackWidth / 2)
        canvasShapes.drawArrow(context, trackWidthArrowStartX, fr4StopY + 20, trackWidthArrowStopX, fr4StopY + 20)

        // ============================================ //
        // =========== TRACK THICKNESS ARROW ========== //
        // ============================================ //
        const trackThicknessAndPlaneProximityArrowX = topLeftX + pcbWidth + 20
        canvasShapes.drawArrow(context, trackThicknessAndPlaneProximityArrowX, trackStartY, trackThicknessAndPlaneProximityArrowX, trackStopY)
      }
    },
    mounted () {
//      var canvas = this.$refs.canvas
      this.drawCanvas()
//      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .diagram-container {
    position: relative;
  }

  .diagram-container > * {
    position: absolute;
  }

  .variable-container > * {
    display: flex;
    flex-direction: column;
  }

  input[type="radio"] {
    transform: scale(1.5)
  }

</style>
