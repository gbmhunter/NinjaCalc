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
      <canvas ref="canvas" style="left: 0px; top: 0px; background-color: #5e7382;"></canvas>

    </div>

    <table class="calc-table" style="max-width: 900px; margin: auto;">
      <thead>
      <tr>
        <th>Variable Name</th>
        <th>Symbol</th>
        <th>Value</th>
        <th>Units</th>
        <th>Notes</th>
      </tr>
      </thead>
      <variable-row-verbose
        variableName="Track width"
        symbol="w"
        :calcVar="calc.getVar('trackWidth_M')"
        notes="The width of the track."></variable-row-verbose>
    </table>

  </div>
</template>

<script>

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeric, NumericValidators} from 'src/misc/CalculatorEngineV2/CalcVarNumeric'
//  import {CalcVarComboBox} from 'src/misc/CalculatorEngineV2/CalcVarComboBox'
  import {UnitMulti} from 'src/misc/CalculatorEngineV2/UnitMulti'
//  import {UnitFunc} from 'src/misc/CalculatorEngineV2/UnitFunc'
//  import {CustomValidator} from '../../../../../../misc/CalculatorEngineV2/CustomValidator'
//  import {unitConversionConstants} from 'src/misc/UnitConversionConstants/UnitConversionConstants'
  import { canvasShapes } from 'src/misc/CanvasShapes/CanvasShapes'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'microstrip-impedance-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // ============================================ //
      // ============ TRACK CURRENT (input) ========= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'trackWidth_M',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'um', multi: 1e-6}),
          new UnitMulti({name: 'mm', multi: 1e-3})
        ],
        defaultUnitName: 'mm',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The width of the track.'
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
        canvas.height = 300

        const copperThickness = 40
        const pcbThickness = 80
        const pcbWidth = 400
        const trackWidth = 80

        const topLeftX = 100
        const topLeftY = 0

        // ============================================ //
        // ============= TRACK WIDTH ARROW ============ //
        // ============================================ //
        const trackWidthArrowStartX = topLeftX + pcbWidth / 2 - (trackWidth / 2)
        const trackWidthArrowStopX = topLeftX + pcbWidth / 2 + (trackWidth / 2)
        const trackWidthArrowY = topLeftY + 50
        canvasShapes.drawArrow(context, trackWidthArrowStartX, trackWidthArrowY, trackWidthArrowStopX, trackWidthArrowY)

        context.font = '20px Arial'
        context.fillStyle = 'black'
        context.fillText('w', (trackWidthArrowStartX + trackWidthArrowStopX) / 2 - 5, trackWidthArrowY - 10)

        // ============================================ //
        // ================ COPPER TRACK ============== //
        // ============================================ //
        const trackStartY = trackWidthArrowY + 20
        const trackStopY = trackStartY + copperThickness

        context.beginPath()
        context.rect(topLeftX + pcbWidth / 2 - trackWidth / 2, trackStartY, trackWidth, copperThickness)
        context.fillStyle = canvasShapes.trackColor
        context.fill()
        context.lineWidth = 2
        context.strokeStyle = 'black'
        context.stroke()

        // ============================================ //
        // =========== TRACK THICKNESS ARROW ========== //
        // ============================================ //
        const trackThicknessAndPlaneProximityArrowX = topLeftX + pcbWidth + 20
        canvasShapes.drawArrow(context, trackThicknessAndPlaneProximityArrowX, trackStartY, trackThicknessAndPlaneProximityArrowX, trackStopY)

        context.fillStyle = 'black'
        context.fillText('t', trackThicknessAndPlaneProximityArrowX + 15, (trackStartY + trackStopY) / 2 + 5)

        // ============================================ //
        // ==================== FR4  ================== //
        // ============================================ //
        const fr4StartY = trackStopY
        const fr4StopY = fr4StartY + pcbThickness

        context.beginPath()
        context.rect(topLeftX, fr4StartY, pcbWidth, pcbThickness)
        context.fillStyle = canvasShapes.fr4Color
        context.fill()
        context.lineWidth = 2
        context.strokeStyle = 'black'
        context.stroke()

        // ============================================ //
        // ============== DIELECTRIC TEXT ============= //
        // ============================================ //

        context.fillStyle = 'black'
        context.fillText('εᵣ', topLeftX + 50, (fr4StartY + fr4StopY) / 2 + 5)

        // ============================================ //
        // ============ FR4 THICKNESS ARROW =========== //
        // ============================================ //
        const fr4ThicknessArrowX = topLeftX + pcbWidth + 20
        canvasShapes.drawArrow(context, fr4ThicknessArrowX, fr4StartY, fr4ThicknessArrowX, fr4StopY)

        context.fillStyle = 'black'
        context.fillText('h', fr4ThicknessArrowX + 15, (fr4StartY + fr4StopY) / 2 + 5)

        // ============================================ //
        // ============ BOTTOM COPPER PLANE  ========== //
        // ============================================ //
        const botCopperPlaneStartY = fr4StopY

        context.beginPath()
        context.rect(topLeftX, botCopperPlaneStartY, pcbWidth, copperThickness)
        context.fillStyle = canvasShapes.trackColor
        context.fill()
        context.lineWidth = 2
        context.strokeStyle = 'black'
        context.stroke()
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
