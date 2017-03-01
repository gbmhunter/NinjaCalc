<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="diagram-container" style="position: relative; width: 600px; height: 600px;">

    <!-- Background image is centered in diagram container -->
    <!--<img :src="require('./diagram.png')" style="left: 50px; top: 50px; width: 500px; height: 500px; z-index: 0">-->
    <canvas ref="canvas" style="width: 600px; height: 600px; left: 0px; top: 0px;"></canvas>

    <!-- ========================================= -->
    <!-- ========== TRACK CURRENT (input) ======== -->
    <!-- ========================================= -->
    <div class="variable-container" style="left: 0px; top: 0px;">
      <span class="variable-name">Track Current</span>
      <calc-value-and-unit :calcVar="calc.getVar('trackCurrent')" style="left: 0px; top: 70px;"></calc-value-and-unit>
    </div>

    <!-- ========================================= -->
    <!-- =========== TEMP. RISE (input) ========== -->
    <!-- ========================================= -->
    <div class="variable-container" style="left: 450px; top: 0px;">
      <span class="variable-name" style="left: 0px; top: 0px;">Temp. Rise</span>
      <calc-value-and-unit :calcVar="calc.getVar('tempRise')" style="left: 0px; top: 70px;"></calc-value-and-unit>
    </div>

  </div>

</template>

<script>

  //  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import CalcVar from 'src/misc/CalculatorEngineV2/CalcVar'
  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'
  import { CustomValidator } from 'src/misc/CalculatorEngineV2/CustomValidator'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'track-current-ipc-2152-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // ============================================ //
      // ============ TRACK CURRENT (input) ========= //
      // ============================================ //
      calc.addVar(new CalcVar({
        name: 'trackCurrent',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {},
        rawVal: '',
        units: [
          {text: 'uA', value: 1e-6},
          {text: 'mA', value: 1e-3},
          {text: 'A', value: 1}
        ],
        selUnit: 1,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              var trackCurrent = calc.getVar('trackCurrent').getRawVal()
              return (trackCurrent >= 274e-3)
            },
            text: 'Current is below the minimum value (274mA) extracted from the universal graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          }),
          new CustomValidator({
            func: () => {
              // Read dependency variables
              var trackCurrent = calc.getVar('trackCurrent').getRawVal()
              return (trackCurrent <= 26.0)
            },
            text: 'Current is above the maximum value (26A) extracted from the universal graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          })
        ],
        helpText: 'The current you want the PCB track to be able to handle.'
      }))

      // ============================================ //
      // ============= TEMP. RISE (input) =========== //
      // ============================================ //
      calc.addVar(new CalcVar({
        name: 'tempRise',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {},
        rawVal: '',
        units: [
          {text: '°C', value: 1e0}
        ],
        selUnit: 1,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              var tempRise = calc.getVar('tempRise').getRawVal()
              return (tempRise >= 1.0)
            },
            text: 'Temp. rise is below the minimum value (1°c) extracted from the universal graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          }),
          new CustomValidator({
            func: () => {
              // Read dependency variables
              var tempRise = calc.getVar('tempRise').getRawVal()
              return (tempRise <= 100.0)
            },
            text: 'Temp. rise is above the maximum value (100°C) extracted from the universal graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          })
        ],
        helpText: 'The maximum desired temperature rise due to the current flowing through the track. 20-40°C is a common value for this.'
      }))

      // Configure calculator to default state now that all
      // variables have been added.
      calc.init()

      return {
        calc: calc
      }
    },
    methods: {
      drawCanvas: function () {
        var canvas = this.$refs.canvas
        var context = canvas.getContext('2d')
        canvas.width = 600
        canvas.height = 600

        const copperThickness = 40
        const pcbThickness = 100
        const pcbWidth = 400

        const topLeftX = 100
        const topLeftY = 100

        // ============================================ //
        // =============== TOP COPPER TRACK =========== //
        // ============================================ //
        const trackWidthBot = 120
        const trackWidthTop = 80

        context.beginPath()
        context.moveTo(topLeftX + pcbWidth / 2 - trackWidthTop / 2, topLeftY)
        context.lineTo(topLeftX + pcbWidth / 2 + trackWidthTop / 2, topLeftY)
        context.lineTo(topLeftX + pcbWidth / 2 + trackWidthBot / 2, topLeftY + copperThickness)
        context.lineTo(topLeftX + pcbWidth / 2 - trackWidthBot / 2, topLeftY + copperThickness)
        context.closePath()
        context.fillStyle = '#d9a654'
        context.fill()
        context.lineWidth = 2
        context.strokeStyle = 'black'
        context.stroke()

        // ============================================ //
        // =============== GREEN FR4 PCB ============== //
        // ============================================ //
        const pcbStartY = topLeftY + copperThickness

        context.beginPath()
        context.rect(topLeftX, pcbStartY, pcbWidth, pcbThickness)
        context.fillStyle = '#3d8f00'
        context.fill()
        context.lineWidth = 2
        context.strokeStyle = 'black'
        context.stroke()

        // ============================================ //
        // ============= BOTTOM COPPER PANE =========== //
        // ============================================ //
        const copperPlaneStartY = pcbStartY + pcbThickness

        context.beginPath()
        context.rect(topLeftX, copperPlaneStartY, pcbWidth, copperThickness)
        context.fillStyle = '#d9a654'
        context.fill()
        context.lineWidth = 2
        context.strokeStyle = 'black'
        context.stroke()

        // ============================================ //
        // =========== BOARD THICKNESS ARROW ========== //
        // ============================================ //
        const arrowStopY = copperPlaneStartY + copperThickness
        this.canvasArrow(context, topLeftX - 20, topLeftY, topLeftX - 20, arrowStopY)

        // ============================================ //
        // ============= TRACK WIDTH ARROW ============ //
        // ============================================ //
        const trackWidthArrowStartX = topLeftX + pcbWidth / 2 - (trackWidthTop / 2)
        const trackWidthArrowStopX = topLeftX + pcbWidth / 2 + (trackWidthTop / 2)
        this.canvasArrow(context, trackWidthArrowStartX, topLeftY - 20, trackWidthArrowStopX, topLeftY - 20)

        // ============================================ //
        // =========== TRACK THICKNESS ARROW ========== //
        // ============================================ //
        const trackThicknessAndPlaneProximityArrowX = topLeftX + pcbWidth + 20
        this.canvasArrow(context, trackThicknessAndPlaneProximityArrowX, topLeftY, trackThicknessAndPlaneProximityArrowX, topLeftY + copperThickness)

        // ============================================ //
        // =========== PLANE PROXIMITY ARROW ========== //
        // ============================================ //
        this.canvasArrow(context, trackThicknessAndPlaneProximityArrowX, topLeftY + copperThickness, trackThicknessAndPlaneProximityArrowX, copperPlaneStartY + copperThickness)
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
      console.log('Ohm\'s Law calculator mounted.')
      this.drawCanvas()
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
