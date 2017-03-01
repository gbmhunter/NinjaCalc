<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div>

    <div class="diagram-container" style="position: relative; width: 600px; height: 600px;">

      <!-- Background image is centered in diagram container -->
      <!--<img :src="require('./diagram.png')" style="left: 50px; top: 50px; width: 500px; height: 500px; z-index: 0">-->
      <canvas ref="canvas" style="width: 600px; height: 600px; left: 0px; top: 0px;"></canvas>

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
      <div class="variable-container" style="left: 450px; top: 0px;">
        <span class="variable-name">Temp. Rise</span>
        <calc-value-and-unit :calcVar="calc.getVar('tempRise')"></calc-value-and-unit>
      </div>

      <!-- ========================================= -->
      <!-- ======== TRACK THICKNESS (input) ======== -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 550px; top: 80px;">
        <span class="variable-name">Track Thickness</span>
        <calc-value-and-unit :calcVar="calc.getVar('trackThickness')"></calc-value-and-unit>
      </div>

      <!-- ========================================= -->
      <!-- ======== BOARD THICKNESS (input) ======== -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 550px; top: 170px;">
        <span class="variable-name">Board Thickness</span>
        <calc-value-and-unit :calcVar="calc.getVar('boardThickness')"></calc-value-and-unit>
      </div>

    </div>

    <!-- =============================================== -->
    <!-- UN-ADJUSTED TRACK CROSS-SECTIONAL AREA (output) -->
    <!-- =============================================== -->
    <div class="variable-container">
      <span class="variable-name">Unadjusted Track Cross-Sectional Area</span>
      <calc-value-and-unit :calcVar="calc.getVar('unadjustedTrackCrossSectionalArea')"></calc-value-and-unit>
    </div>
    <div class="variable-container">
      <span class="variable-name">Track Thickness Modifier</span>
      <calc-value-and-unit :calcVar="calc.getVar('trackThicknessModifier')"></calc-value-and-unit>
    </div>
    <div class="variable-container">
      <span class="variable-name">Board Thickness Modifier</span>
      <calc-value-and-unit :calcVar="calc.getVar('boardThicknessModifier')"></calc-value-and-unit>
    </div>

  </div>
</template>

<script>

  //  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import CalcVar from 'src/misc/CalculatorEngineV2/CalcVar'
  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'
  import {CustomValidator} from 'src/misc/CalculatorEngineV2/CustomValidator'

  // ============================================================================================= //
  // ============================================ CONSTANTS ====================================== //
  // ============================================================================================= //
  const NUM_MILS_PER_MM = 1000 / 25.4
  //  const UNIT_CONVERSION_COPPER_THICKNESS_M_PER_OZ = 0.0000350012
  const UNIT_CONVERSION_M_PER_MIL = 25.4 / 1e6
  const UNIT_CONVERSION_M2_PER_MIL2 = UNIT_CONVERSION_M_PER_MIL * UNIT_CONVERSION_M_PER_MIL
  const COPPER_THICKNESS_M_PER_OZ = 0.0000350012
  const METERS_PER_INCH = 25.4 / 1000
  const METERS_PER_MILS = METERS_PER_INCH / 1000.0

  //  const UNIT_CONVERSION_THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF = 1.73

  // UNIVERSAL CHART CONSTANTS

  // The trendlines to calculate the co-efficients for a fixed temp takes the form y = Ax^B
  // where y is the co-efficient, x is the temperature.
  // e.g. (co-efficient A) = AA * temp ^ AB
  //      (co-efficient B) = BA * temp ^ BB
  const UNIVERSAL_CHART_TREND_LINE_COEF_AA = 8.9710902134e-02
  const UNIVERSAL_CHART_TREND_LINE_COEF_AB = 3.9379253898e-01

  const UNIVERSAL_CHART_TREND_LINE_COEF_BA = 5.0382053698e-01
  const UNIVERSAL_CHART_TREND_LINE_COEF_BB = 3.8495772461e-02

  // TRACK THICKNESS MODIFIER CONSTANTS

  // The data from the track thickness modifier graph in IPS-2152 is modelled using
  // a 5th degree polynomial

  // y = C0 + C1*x^1 + C2*x^2 + C3*x^3 + C4*x^4 + C5*x^5

  const TRACK_THICKNESS_TREND_LINE_COEF_COEF_A = [
    [
      9.8453567795e-01,    // C0C0
      -2.2281787548e-01,    // C0C1
      2.0061423196e-01,    // C0C2
      -4.1541116264e-02    // C0C3
    ],
    [
      -1.6571949210e-02,    // C1C0
      1.7520059279e-04,    // C1C1
      -5.0615234096e-03,    // C1C2
      2.2814836340e-03    // C1C3
    ],
    [
      8.8711317661e-04,    // C2C0
      1.3631745743e-03,    // C2C1
      -2.2373309710e-04,    // C2C2
      -1.0974218613e-04    // C2C3
    ],
    [
      -6.6729255031e-06,    // e.t.c...
      -1.4976736827e-04,
      5.8082340133e-05,
      -2.4728159584e-06
    ],
    [
      -7.9576264561e-07,
      5.5788354958e-06,
      -2.4912026388e-06,
      2.4000295954e-07
    ],
    [
      1.6619678738e-08,
      -7.1122635445e-08,
      3.3800191741e-08,
      -3.9797591878e-09
    ]]

  // BOARD THICKNESS CONSTANTS
  const BOARD_THICKNESS_TREND_LINE_COEF_A = 2.4929779905e+01
  const BOARD_THICKNESS_TREND_LINE_COEF_B = -7.5501997929e-01

  // PLANE PROXIMITY CONSTANTS
//  const PLANE_PROXIMITY_TREND_LINE_COEF_M = 3.1298662911e-03
//  const PLANE_PROXIMITY_TREND_LINE_COEF_C = 4.0450883823e-01

  // THERMAL CONDUCTIVITY CONSTANTS
//  const THERMAL_CONDUCTIVITY_TREND_LINE_COEF_M = -1.4210148167e+00
//  const THERMAL_CONDUCTIVITY_TREND_LINE_COEF_C = 1.1958174134e+00

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
        eqn: () => {
        },
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
        eqn: () => {
        },
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

      // ============================================================================================= //
      // ============================ UN-ADJUSTED TRACK CROSS-SECTIONAL AREA (output) ================ //
      // ============================================================================================= //
      calc.addVar(new CalcVar({
        name: 'unadjustedTrackCrossSectionalArea',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read in variables
          const trackCurrent = calc.getVar('trackCurrent').getRawVal()
          const tempRise = calc.getVar('tempRise').getRawVal()

          // Lets calculate the two co-efficients for the fixed-temp trend line
          const universalChartTrendLineCoefA = UNIVERSAL_CHART_TREND_LINE_COEF_AA * Math.pow(tempRise, UNIVERSAL_CHART_TREND_LINE_COEF_AB)
          const universalChartTrendLineCoefB = UNIVERSAL_CHART_TREND_LINE_COEF_BA * Math.pow(tempRise, UNIVERSAL_CHART_TREND_LINE_COEF_BB)

          // Now we know the two co-efficients, we can use the trend line eq. y=Ax^B to find the unadjusted cross-sectional area
          const unadjustedTrackCrosssectionalAreaMils2 = Math.pow(trackCurrent / universalChartTrendLineCoefA, 1 / universalChartTrendLineCoefB)

          // Convert mils^2 to m^2 (store variable values in SI units)
          const unadjustedTrackCrosssectionalAreaM2 = unadjustedTrackCrosssectionalAreaMils2 * (1 / (NUM_MILS_PER_MM * NUM_MILS_PER_MM * 1e6))

          return unadjustedTrackCrosssectionalAreaM2
        },
        rawVal: '',
        units: [
          {text: 'um²', value: 1e-12},
          {text: 'mils²', value: UNIT_CONVERSION_M2_PER_MIL2},
          {text: 'mm²', value: 1e-6}
        ],
        selUnit: 1e-12,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The unadjusted cross-sectional area. This gets multiplied by the many modifiers to give an adjusted cross-sectional area.'
      }))

      // ============================================ //
      // ========== TRACK THICKNESS (input) ========= //
      // ============================================ //
      calc.addVar(new CalcVar({
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
            text: 'Track thickness is below the minimum value (17.5um) extracted from the track thickness modififer graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          }),
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const trackThickness = calc.getVar('trackThickness').getRawVal()
              return (trackThickness <= 105.0036e-6)
            },
            text: 'Track thickness is above the maximum value (105um) extracted from the track thickness modififer graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          })
        ],
        helpText: 'The thickness (height) of the track. This is equal to the thickness of the copper layer the track is on. This is also called the copper weight. Common values are 16um (0.5oz) or 32um (1oz).'
      }))

      // ============================================================================================= //
      // =============================== TRACK THICKNESS MODIFIER (output) =========================== //
      // ============================================================================================= //
      calc.addVar(new CalcVar({
        name: 'trackThicknessModifier',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          const trackCurrentA = calc.getVar('trackCurrent').getRawVal()
          const trackThicknessM = calc.getVar('trackThickness').getRawVal()

          // Convert to "oz" units, as this is what is used in IPC-2152 graphs
          const trackThicknessOz = trackThicknessM * (1 / COPPER_THICKNESS_M_PER_OZ)

          // Lets calculate the two co-efficients for the fixed-temp trend line
          // double[] trackThicknessTrendLineCoefA = new double[TRACK_THICKNESS_TREND_LINE_COEF_COEF_A.length];
          var trackThicknessTrendLineCoefA = []

          // Outer loop calculates all co-efficients
          for (var i = 0; i < TRACK_THICKNESS_TREND_LINE_COEF_COEF_A.length; i++) {
            // Initialise array element with 0
            trackThicknessTrendLineCoefA[i] = 0

            // Inner loop calculates a single co-efficient
            for (var j = 0; j < TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[0].length; j++) {
              trackThicknessTrendLineCoefA[i] += TRACK_THICKNESS_TREND_LINE_COEF_COEF_A[i][j] * Math.pow(trackThicknessOz, j)
            }
          }

          // Now we have calculate the 5th degree polynomial co-efficients, we can finally calc the thickness modifier
          var trackThicknessModifierMulti = 0

          for (i = 0; i < trackThicknessTrendLineCoefA.length; i++) {
            trackThicknessModifierMulti += trackThicknessTrendLineCoefA[i] * Math.pow(trackCurrentA, i)
          }

          return trackThicknessModifierMulti
        },
        rawVal: '',
        units: [
          {text: 'no unit', value: 1e0}
        ],
        selUnit: 1e0,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The modifier to adjust the cross-sectional area with based on the track thickness.'
      }))

      // ============================================================================================= //
      // ===================================== BOARD THICKNESS (input) =============================== //
      // ============================================================================================= //
      calc.addVar(new CalcVar({
        name: 'boardThickness',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
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
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const boardThickness = calc.getVar('boardThickness').getRawVal()
              return (boardThickness >= 0.72e-3)
            },
            text: 'Board thickness is below the minimum value (0.72mm) extracted from the board thickness modifier graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          }),
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const boardThickness = calc.getVar('boardThickness').getRawVal()
              return (boardThickness <= 2.36e-3)
            },
            text: 'Board thickness is above the maximum value (2.36mm) extracted from the board thickness modifier graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          })
        ],
        helpText: 'The total thickness of the PCB that the track is on. A standard PCB thickness is 1.6mm.'
      }))

      // ============================================================================================= //
      // =============================== BOARD THICKNESS MODIFIER (output) =========================== //
      // ============================================================================================= //
      calc.addVar(new CalcVar({
        name: 'boardThicknessModifier',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          const boardThicknessM = calc.getVar('boardThickness').getRawVal()

          // Convert to "mils" units, as this is what is used in IPC-2152 graphs
          const boardThicknessMils = boardThicknessM * (1 / UNIT_CONVERSION_M_PER_MIL)

          const boardThicknessModifierMulti = BOARD_THICKNESS_TREND_LINE_COEF_A *
            Math.pow(boardThicknessMils, BOARD_THICKNESS_TREND_LINE_COEF_B)

          return boardThicknessModifierMulti
        },
        rawVal: '',
        units: [
          {text: 'no unit', value: 1e0}
        ],
        selUnit: 1e0,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The modifier to adjust the cross-sectional area with based on the board thickness.'
      }))

      // ============================================================================================= //
      // ==================================== IS PLANE PRESENT (combobox) ============================ //
      // ============================================================================================= //
      calc.addVar(new CalcVar({
        name: 'isPlanePresent',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          {text: 'no unit', value: 1e0}
        ],
        selUnit: 1e1,
        roundTo: 4,
        validators: [],
        helpText: 'Set this to "True" if there is a copper plane either above or below the current-carrying track, and then enter the distance to it in the "Plane Proximity" field. If there is no plane, set this to "False", and the "Plane Proximity" variable will also disappear.'
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
