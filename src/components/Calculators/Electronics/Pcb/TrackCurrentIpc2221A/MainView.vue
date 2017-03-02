<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container" style="margin: auto;">

    <!-- SPACER -->
    <div style="height: 50px;"></div>

    <ui-collapsible title="Info" style="max-width: 800px;">
      <p>This calculator can find the minimum PCB track width (external or internal layer) given the track current, the
        allowed temperature rise, and copper layer thickness.</p>

      <p>Calculated in accordance with the equations in IPC-2221A Section 6.2 (formerly IPC-D-275, the equation has not
        changed between these two standards amd you can get similar values by curve-fitting to the graphs provided in
        IPC-D-275, drawn in 1954, woah!</p>

      <p>$$ I = k\Delta T^b A^c $$</p>

      <p style="text-align: center;">where:<br>
        \( k \) = 0.048 for external traces, 0.024 for internal tracks<br>
        \( \Delta T \) = the change in temperature (temperature rise) in \( ^{\circ}C \)<br>
        \( b \) = 0.44<br>
        \( A \) = cross-sectional area in \( mils^2 \)<br>
        \( c \) = 0.725<br>
      </p>

      <p>The standard only covers values where the current is 0-35A, track width is 0-10.16mm, temperature rise is from
        10-100C, and the copper from 0.5-3oz. Values outside this range are extrapolated (and there more error-prone) and
        will turn orange.</p>

      <p>This also assumes the track is sufficiently long enough the the end-points do not have a significant effect on the
        heatsinking. For example, this calcultor should not be used for calculating the width of thermal-relief style
        connections from a copper pour to a via, in where the track is very short (0.2-1.0mm). It also assumes there are no
        vias along the length of the track.</p>

      <p>The current in assumed to be constant (DC). However, you can use the RMS value for a pulsed current as long as the
        pulses are fast enough.</p>

      <p>The temperature of the PCB material should NEVER exceed the relative thermal index (RTI) of the material. This is
        defined in UL746B as the temperature at which 50% of the materials properties are retained after 100,000 hours.</p>

      <p>Remember this calculator does not take into account other nearby heat sources.</p>
    </ui-collapsible>

    <!-- SPACER -->
    <div style="height: 50px;"></div>

    <div class="diagram-container" style="position: relative; width: 600px; height: 450px;">

      <!-- Background image is centered in diagram container -->
      <!--<img :src="require('./diagram.png')" style="left: 50px; top: 50px; width: 500px; height: 500px; z-index: 0">-->
      <canvas ref="canvas" style="width: 600px; height: 450px; left: 0px; top: 0px;"></canvas>

      <!-- ========================================= -->
      <!-- ========== TRACK CURRENT (input) ======== -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 0px; top: 0px;">
        <span class="variable-name">Track Current</span>
        <calc-value-and-unit :calcVar="calc.getVar('trackCurrent')"></calc-value-and-unit>
      </div>

      <!-- ========================================= -->
      <!-- =========== TEMP. RISE (input) ========== -->
      <!-- ========================================= -->
      <img :src="require('./temperature-icon.jpg')" style="max-width: 90px; left: 410px; top: -10px;">
      <div class="variable-container" style="left: 500px; top: -10px;">
        <span class="variable-name">Temp. Rise</span>
        <calc-value-and-unit :calcVar="calc.getVar('tempRise')"></calc-value-and-unit>
      </div>

      <!-- ========================================= -->
      <!-- ======== TRACK THICKNESS (input) ======== -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 550px; top: 170px;">
        <span class="variable-name">Track Thickness</span>
        <calc-value-and-unit :calcVar="calc.getVar('trackThickness')"></calc-value-and-unit>
      </div>

      <!-- ========================================= -->
      <!-- ========= TRACK LAYER (combobox) ======== -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: -30px; top: 150px;">
        <span class="variable-name">Track Layer</span>
        <select v-model="calc.getVar('trackLayer').val" v-on:change="calc.getVar('trackLayer').onValChange()"
                style="width: 100px; height: 30px; font-size: 20px;">
          <option v-for="option in calc.getVar('trackLayer').options" v-bind:value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <!-- ========================================= -->
      <!-- ======= MIN. TRACK WIDTH (output) ======= -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 220px; top: 340px;">
        <span class="variable-name">Min. Track Width</span>
        <calc-value-and-unit :calcVar="calc.getVar('minTrackWidth')"></calc-value-and-unit>
      </div>

    </div>

  </div>
</template>

<script>

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeral} from 'src/misc/CalculatorEngineV2/CalcVarNumeral'
  import {CalcVarComboBox} from 'src/misc/CalculatorEngineV2/CalcVarComboBox'
  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'
  import {CustomValidator} from 'src/misc/CalculatorEngineV2/CustomValidator'

  // ============================================================================================= //
  // ============================================ CONSTANTS ====================================== //
  // ============================================================================================= //
  const COPPER_THICKNESS_M_PER_OZ = 0.0000350012
  const METERS_PER_INCH = 25.4 / 1000
  const METERS_PER_MILS = METERS_PER_INCH / 1000.0

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'track-current-ipc-2221a-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // ============================================ //
      // ============ TRACK CURRENT (input) ========= //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'trackCurrent',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          {text: 'uA', value: 1e-6},
          {text: 'mA', value: 1e-3},
          {text: 'A', value: 1}
        ],
        selUnit: 1e0,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_THAN_ZERO,
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

      // ============================================ //
      // ============= TEMP. RISE (input) =========== //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'tempRise',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          {text: '°C', value: 1e0}
        ],
        selUnit: 1e0,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              var tempRise = calc.getVar('tempRise').getRawVal()
              return (tempRise >= 10.0)
            },
            text: 'Temperature rise is below the recommended minimum (10°c). Equation will not be as accurate (extrapolation will occur).',
            level: 'warning'
          }),
          new CustomValidator({
            func: () => {
              // Read dependency variables
              var tempRise = calc.getVar('tempRise').getRawVal()
              return (tempRise <= 100.0)
            },
            text: 'Temperature rise is above the recommended maximum (100°c). Equation will not be as accurate (extrapolation will occur).',
            level: 'warning'
          })
        ],
        helpText: 'The maximum desired temperature rise due to the current flowing through the track. 20-40°C is a common value for this.'
      }))

      // ============================================ //
      // ========== TRACK THICKNESS (input) ========= //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'trackThickness',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          {text: 'um', value: 1e-6},
          {text: 'mm', value: 1e-3},
          {text: 'oz', value: COPPER_THICKNESS_M_PER_OZ},
          {text: 'mils', value: METERS_PER_MILS}
        ],
        selUnit: 1e-6,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const trackThickness = calc.getVar('trackThickness').getRawVal()
              return (trackThickness >= 17.5e-6)
            },
            text: 'Track thickness is below the recommended minimum (17.5um or 0.5oz). Equation will not be as accurate (extrapolation will occur).',
            level: 'warning'
          }),
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const trackThickness = calc.getVar('trackThickness').getRawVal()
              return (trackThickness <= 105.0036e-6)
            },
            text: 'Track thickness is above the recommended maximum (105um or 3oz). Equation will not be as accurate (extrapolation will occur).',
            level: 'warning'
          })
        ],
        helpText: 'The thickness (height) of the track. This is equal to the thickness of the copper layer the track is on. This is also called the copper weight. Common values are 16um (0.5oz) or 32um (1oz).'
      }))

      // ============================================================================================= //
      // ====================================== TRACK LAYER (combobox) =============================== //
      // ============================================================================================= //
      calc.addVar(new CalcVarComboBox({
        name: 'trackLayer',
        options: [
          'Internal',
          'External'
        ],
        defaultVal: 'External',
        validators: [],
        helpText: 'The type of layer that the current-carrying track is on. If the track is on the top or bottom copper layer of the PCB, set this to "External". If the track is on a buried layer, set this to "Internal".'
      }))

      // ============================================================================================= //
      // ===================================== MIN. TRACK WIDTH (output) ============================= //
      // ============================================================================================= //
      calc.addVar(new CalcVarNumeral({
        name: 'minTrackWidth',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          const traceCurrent = calc.getVar('trackCurrent').getRawVal()
          const tempRise = calc.getVar('tempRise').getRawVal()
          const trackThickness = calc.getVar('trackThickness').getRawVal()
          const trackLayer = calc.getVar('trackLayer').getVal()

          if (trackLayer === 'External') {
            const crossSectionalArea = (Math.pow((traceCurrent / (0.048 * Math.pow(tempRise, 0.44))), 1 / 0.725))
            const width = (crossSectionalArea / (trackThickness * 1000000.0 / 25.4)) * (25.4 / 1000000.0)
            return width
          } else if (trackLayer === 'Internal') {
            const crossSectionalArea = (Math.pow((traceCurrent / (0.024 * Math.pow(tempRise, 0.44))), 1 / 0.725))
            const width = (crossSectionalArea / (trackThickness * 1000000.0 / 25.4)) * (25.4 / 1000000.0)
            return width
          }
        },
        rawVal: '',
        units: [
          {text: 'um', value: 1e-6},
          {text: 'mm', value: 1e-3},
          {text: 'mils', value: METERS_PER_MILS}
        ],
        selUnit: 1e-3,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The minimum track width needed to carry the specified current without exceeding the given temperature rise.'
      }))

      // Configure calculator to default state now that all
      // variables have been added.
      calc.init()

      return {
        calc: calc
      }
    },
    computed: {
      trackLayer () {
        return this.calc.getVar('trackLayer').getVal()
      }
    },
    watch: {
      trackLayer () {
        this.drawCanvas({
          trackLayer: this.trackLayer
        })
      }
    },
    methods: {
      drawCanvas: function (inputObj) {
        console.log('drawCanvas() called with inputObj =')
        console.log(inputObj)
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
        // ============ TOP FR4 (conditional) ========= //
        // ============================================ //

        if (inputObj.trackLayer === 'Internal') {
          context.beginPath()
          context.rect(topLeftX, topLeftY, pcbWidth, pcbThickness)
          context.fillStyle = '#3d8f00'
          context.fill()
          context.lineWidth = 2
          context.strokeStyle = 'black'
          context.stroke()
        } else if (inputObj.trackLayer === 'External') {
          context.beginPath()
          context.rect(topLeftX, topLeftY, pcbWidth, pcbThickness)
          context.fillStyle = '#e4fdce'
          context.fill()
          context.lineWidth = 2
          context.strokeStyle = '#c3c3c3'
          context.stroke()
        }

        // ============================================ //
        // ================ COPPER TRACK ============== //
        // ============================================ //
        const trackWidthBot = 120
        const trackWidthTop = 80

        const trackStartY = topLeftY + pcbThickness
        const trackStopY = trackStartY + copperThickness

        context.beginPath()
        context.moveTo(topLeftX + pcbWidth / 2 - trackWidthTop / 2, trackStartY)
        context.lineTo(topLeftX + pcbWidth / 2 + trackWidthTop / 2, trackStartY)
        context.lineTo(topLeftX + pcbWidth / 2 + trackWidthBot / 2, trackStopY)
        context.lineTo(topLeftX + pcbWidth / 2 - trackWidthBot / 2, trackStopY)
        context.closePath()
        context.fillStyle = '#d9a654'
        context.fill()
        context.lineWidth = 2
        context.strokeStyle = 'black'
        context.stroke()

        // ============================================ //
        // ================= BOTTOM FR4  ============== //
        // ============================================ //
        const bottomFr4StartY = trackStopY
        const bottomFr4StopY = bottomFr4StartY + pcbThickness

        context.beginPath()
        context.rect(topLeftX, bottomFr4StartY, pcbWidth, pcbThickness)
        context.fillStyle = '#3d8f00'
        context.fill()
        context.lineWidth = 2
        context.strokeStyle = 'black'
        context.stroke()

        // ============================================ //
        // ============= TRACK WIDTH ARROW ============ //
        // ============================================ //
        const trackWidthArrowStartX = topLeftX + pcbWidth / 2 - (trackWidthTop / 2)
        const trackWidthArrowStopX = topLeftX + pcbWidth / 2 + (trackWidthTop / 2)
        this.canvasArrow(context, trackWidthArrowStartX, bottomFr4StopY + 20, trackWidthArrowStopX, bottomFr4StopY + 20)

        // ============================================ //
        // =========== TRACK THICKNESS ARROW ========== //
        // ============================================ //
        const trackThicknessAndPlaneProximityArrowX = topLeftX + pcbWidth + 20
        this.canvasArrow(context, trackThicknessAndPlaneProximityArrowX, trackStartY, trackThicknessAndPlaneProximityArrowX, trackStopY)
      },
      canvasArrow: function (context, fromx, fromy, tox, toy) {
        var headlen = 10   // length of head in pixels
        var angle = Math.atan2(toy - fromy, tox - fromx)
        context.beginPath()
        context.moveTo(fromx, fromy)
        // Start arrow head
        context.lineTo(fromx + headlen * Math.cos(angle + Math.PI / 6), fromy + headlen * Math.sin(angle + Math.PI / 6))
        context.moveTo(fromx, fromy)
        context.lineTo(fromx + headlen * Math.cos(angle - Math.PI / 6), fromy + headlen * Math.sin(angle - Math.PI / 6))

        context.moveTo(fromx, fromy)

        // End arrow head
        context.lineTo(tox, toy)
        context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6))
        context.moveTo(tox, toy)
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6))
        context.stroke()
      }
    },
    mounted () {
//      console.log('Ohm\'s Law calculator mounted.')
      this.drawCanvas({
        trackLayer: this.trackLayer
      })
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
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
