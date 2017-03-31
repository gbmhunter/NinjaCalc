<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container" style="margin: auto;">

    <!-- SPACER -->
    <div style="height: 20px;"></div>

    <ui-collapsible title="Info" class="calc-info" style="max-width: 800px;">
      <p>This calculator can find the impedance of various microstrip and stripline style PCB tracks.</p>

      <p>The following equations are used to calculate the impedance of the microstrip.</p>

      <p>$$ W = w + \frac{t}{\pi} \left[ ln\left(\frac{2h}{t}\right) = 1 \right] $$</p>
      <p>$$ H = h - 2t $$</p>

      <p>If \( \frac{W}{H} < 1 \)</p>
      <p>$$ \epsilon_{eff} = \frac{\epsilon_r + 1}{2} + \frac{\epsilon_r - 1}{2}\left[\frac{1}{\sqrt{1 + 12\frac{H}{W}}} + 0.04\left(1 - \frac{W}{H}\right)^2\right] $$</p>
      <p>$$ Z = \frac{60}{\sqrt{\epsilon_{eff}}} ln\left(\frac{8H}{W} + \frac{W}{4H}\right) $$</p>

      <p>If \( \frac{W}{H} \geq 1 \)</p>
      <p>$$ \epsilon_{eff} = \frac{\epsilon_r + 1}{2} + \frac{\epsilon_r - 1}{2\sqrt{1 + 12\frac{H}{W}}} $$</p>
      <p>$$ Z = \frac{120\pi}{ \sqrt{\epsilon_{eff}} \left[ \frac{W}{H} + 1.393 + \frac{2}{3}ln(\frac{W}{H} + 1.444) \right] } $$</p>

      <p>Equations are from <a href="http://www.rfcafe.com/references/electrical/microstrip-eq.htm">http://www.rfcafe.com/references/electrical/microstrip-eq.htm</a>.</p>
    </ui-collapsible>

    <!-- Background image is centered in diagram container -->
    <canvas ref="canvas" style="width: 600px; height: 300px;"></canvas>

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
        variableName="Track Width"
        symbol="w"
        :calcVar="calc.getVar('trackWidth_M')"
        notes="The width of the track."></variable-row-verbose>
      <variable-row-verbose
        variableName="Track Thickness"
        symbol="t"
        :calcVar="calc.getVar('trackThickness_M')"
        notes="The thickness of the track."></variable-row-verbose>
      <variable-row-verbose
        variableName="Substrate Thickness"
        symbol="t"
        :calcVar="calc.getVar('substrateThickness_M')"
        notes="The thickness (height) of the substrate."></variable-row-verbose>
      <variable-row-verbose
        variableName="Substrate Dielectric"
        symbol="\epsilon_r"
        :calcVar="calc.getVar('substrateDielectric_NoUnit')"
        notes="The dielectric of the substrate."></variable-row-verbose>
      <variable-row-verbose
        variableName="Track Impedance"
        symbol="Z"
        :calcVar="calc.getVar('trackImpedance_Ohms')"
        notes="The impedance of the track."></variable-row-verbose>
    </table>

  </div>
</template>

<script>

  /* eslint-disable camelcase */
  /* eslint-disable space-infix-ops */
  /* eslint-disable space-in-parens */

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
      // ============= TRACK WIDTH (input) ========== //
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

      // ============================================ //
      // =========== TRACK THICKNESS (input) ======== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'trackThickness_M',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '32e-6',
        units: [
          new UnitMulti({name: 'um', multi: 1e-6}),
          new UnitMulti({name: 'mm', multi: 1e-3})
        ],
        defaultUnitName: 'um',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The thickness of the track.'
      }))

      // ============================================ //
      // ======== SUBSTRATE THICKNESS (input) ======= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'substrateThickness_M',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '1.6e-3',
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
        helpText: 'The thickness (height) of the substrate.'
      }))

      // ============================================ //
      // ======== SUBSTRATE DIELECTRIC (input) ====== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'substrateDielectric_NoUnit',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '4e0',
        units: [
          new UnitMulti({name: 'no unit', multi: 1e0})
        ],
        defaultUnitName: 'no unit',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The dielectric of the substrate.'
      }))

      // ============================================ //
      // =========== TRACK IMPEDANCE (input) ======== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'trackImpedance_Ohms',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependencies
          const w = calc.getVar('trackWidth_M').getRawVal()
          const t = calc.getVar('trackThickness_M').getRawVal()
          const h = calc.getVar('substrateThickness_M').getRawVal()
          const eR = calc.getVar('substrateDielectric_NoUnit').getRawVal()

          const W = w + (t / Math.PI) * (Math.log(2 * h / t) + 1)
          console.log('W = ' + W)
          const H = h - 2 * t
          console.log('H = ' + H)

          var eEff    // Effective substrate impedance
          var Z       // Track impedance
          if (W/H < 1) {
            eEff = (eR + 1)/2 + ((eR - 1)/2)*((1 / Math.sqrt(1 + 12*H/W)) + 0.04*Math.pow(1 - W/H, 2))
            Z = (60 / Math.sqrt(eEff)) * Math.log(8*H/W + W/4*H)
          } else {
            eEff = (eR + 1)/2 + (eR - 1)/(2*Math.sqrt(1 + 12*H/W))
            Z = (120*Math.PI) / (Math.sqrt(eEff)*(W/H + 1.393 + (2/3)*Math.log(W/H + 1.444)))
          }

          return Z
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'mΩ', multi: 1e-3}),
          new UnitMulti({name: 'Ω', multi: 1e0}),
          new UnitMulti({name: 'kΩ', multi: 1e3}),
          new UnitMulti({name: 'MΩ', multi: 1e6})
        ],
        defaultUnitName: 'Ω',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The impedance of the track.'
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
