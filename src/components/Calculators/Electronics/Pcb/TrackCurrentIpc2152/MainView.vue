<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container" style="margin: auto;">

    <!-- SPACER -->
    <div style="height: 50px;"></div>

    <ui-collapsible title="Info" class="calc-info" style="max-width: 800px;">
      <p>This calculator can find the minimum allowed PCB track width for a given continuous current. Takes into account
        the allowed temperature rise, copper track thickness, proximity to planes, total thickness of the PCB, and PCB
        material in accordance with IPC-2152.</p>

      <p>The calculator uses equations built from the data provided in the IPC-2152 graphs.Data points were extracted
        from the graphs using <a href="http://arohatgi.info/WebPlotDigitizer/">WebPlotDigitizer</a> (a great program
        by-the-way). Suitable trend lines were then fitted. In the case of the three variable graphs, trend lines were
        fitted to the coefficients of the first set of trend lines.</p>

      <p>I believe the accuracy of the calculator (w.r.t. the IPC-2152 graphs) to be quite high, within the range of
        data provided by these graphs. Outside of this, extrapolation could become inaccurate quickly, due to the use of
        5th order polynomial's being used to model some of the data (this was the best choice). Other graph were
        modelled with power equations of the form y=Ax^B, and are likely to be more accurate that the polynomial during
        extrapolation.</p>

      <p>Below is an example of the trend-line fitting process. This image shows the "Copper Thickness Modifier" data
        from IPC-2152, along with 5th order polynomials being fitted to each data set. The data for the 3oz. copper
        weight is a horizontal line at y=1 by definition.</p>

      <img :src="require('./ipc-2152-copper-thickness-modifier-graph-with-trendlines.png')" style="display: block; margin: auto; max-width: 500px;"/>

      <p>The co-efficients of the above trend lines were then plotted against copper weight (aka. track thickness). The
        graph below is co-efficient C5 (the co-efficient infront of x^5) against copper weight. These had their own
        trend lines fitted. Note that there are only four data points, AND the fitted trend-line is a third-degree
        polynomial, which is guaranteed to fit the data perfectly. This is probably the most dangerous part of the
        "discrete graphed data sets to continuous equations" conversion.</p>

      <img :src="require('./ipc-2152-copper-thickness-modifier-copper-weight-versus-c5-graph.png')"
           style="display: block; margin: auto; max-width: 500px;"/>

      <p>The current in assumed to be constant (DC). However, you can use the RMS value for a pulsed current as long as
        the pulses are fast enough.</p>

      <p>The temperature of the PCB material should NEVER exceed the relative thermal index (RTI) of the material. This
        is defined in UL746B as the temperature at which 50% of the materials properties are retained after 100,000
        hours.</p>

      <p>Remember this calculator does not take into account other nearby heat sources.</p>

      <p>This stanard is designed to supersede the older IPC-2221A standard. It is designed to produce a more accurate track width calculation, but does require more variables. <a @click="openIpc2221ACalc">However, if you do want to use the older IPC-2221A standard, click here</a>.</p>
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
      <div class="variable-container" style="left: 550px; top: 80px;">
        <span class="variable-name">Track Thickness</span>
        <calc-value-and-unit :calcVar="calc.getVar('trackThickness')"></calc-value-and-unit>
      </div>

      <!-- ========================================= -->
      <!-- ======== BOARD THICKNESS (input) ======== -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: -110px; top: 170px;">
        <span class="variable-name">Board Thickness</span>
        <calc-value-and-unit :calcVar="calc.getVar('boardThickness')"></calc-value-and-unit>
      </div>

      <!-- ========================================= -->
      <!-- ====== IS PLANE PRESENT (combobox) ====== -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 500px; top: 300px;">
        <span class="variable-name">Is Plane Present?</span>
        <select v-model="calc.getVar('isPlanePresent').val" v-on:change="calc.getVar('isPlanePresent').onValChange()"
                style="width: 80px; height: 30px; font-size: 20px;">
          <option v-for="option in calc.getVar('isPlanePresent').options" v-bind:value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <!-- ========================================= -->
      <!-- ======== PLANE PROXIMITY (input) ======== -->
      <!-- ========================================= -->
      <div v-show="calc.getVar('isPlanePresent').val === 'True'" class="variable-container" style="left: 550px; top: 170px;">
        <span class="variable-name">Plane Proximity</span>
        <calc-value-and-unit :calcVar="calc.getVar('planeProximity')"></calc-value-and-unit>
      </div>

      <!-- ========================================= -->
      <!-- ====== THERMAL CONDUCTIVITY (input) ===== -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 100px; top: 330px;">
        <span class="variable-name">Thermal Conductivity</span>
        <calc-value-and-unit :calcVar="calc.getVar('thermalConductivity')"></calc-value-and-unit>
      </div>

      <!-- ========================================= -->
      <!-- ======= MIN. TRACK WIDTH (output) ======= -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 200px; top: -20px;">
        <span class="variable-name">Min. Track Width</span>
        <calc-value-and-unit :calcVar="calc.getVar('minTrackWidth')"></calc-value-and-unit>
      </div>

    </div>

    <ui-collapsible title="Intermediate Variables">
      <table>
        <tbody>
        <tr>
          <td><span class="variable-name">Unadjusted Track Cross-Sectional Area</span></td>
          <td>
            <calc-value-and-unit :calcVar="calc.getVar('unadjustedTrackCrossSectionalArea')"></calc-value-and-unit>
          </td>
        </tr>
        <tr>
          <td><span class="variable-name">Track Thickness Modifier</span></td>
          <td>
            <calc-value-and-unit :calcVar="calc.getVar('trackThicknessModifier')"></calc-value-and-unit>
          </td>
        </tr>
        <tr>
          <td><span class="variable-name">Board Thickness Modifier</span></td>
          <td>
            <calc-value-and-unit :calcVar="calc.getVar('boardThicknessModifier')"></calc-value-and-unit>
          </td>
        </tr>
        <tr>
          <td><span class="variable-name">Plane Proximity Modifier</span></td>
          <td>
            <calc-value-and-unit :calcVar="calc.getVar('planeProximityModifier')"></calc-value-and-unit>
          </td>
        </tr>
        <tr>
          <td><span class="variable-name">Thermal Conductivity Modifier</span></td>
          <td>
            <calc-value-and-unit :calcVar="calc.getVar('thermalConductivityModifier')"></calc-value-and-unit>
          </td>
        </tr>
        <tr>
          <td><span class="variable-name">Adjusted Track Cross-Sectional Area</span></td>
          <td>
            <calc-value-and-unit :calcVar="calc.getVar('adjustedTrackCrossSectionalArea')"></calc-value-and-unit>
          </td>
        </tr>
        </tbody>
      </table>
    </ui-collapsible>

    <!-- SPACER -->
    <div style="height: 50px;"></div>

  </div>
</template>

<script>

  import Calc from '@/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeric, NumericValidators} from '@/misc/CalculatorEngineV2/CalcVarNumeric'
  import {CalcVarComboBox} from '@/misc/CalculatorEngineV2/CalcVarComboBox'
  import {UnitMulti} from '@/misc/CalculatorEngineV2/UnitMulti'
  import {UnitFunc} from '@/misc/CalculatorEngineV2/UnitFunc'
  import {CustomValidator} from '@/misc/CalculatorEngineV2/CustomValidator'
  import {unitConversionConstants} from '@/misc/UnitConversionConstants/UnitConversionConstants'
  import { canvasShapes } from '@/misc/CanvasShapes/CanvasShapes'

  // ============================================================================================= //
  // ============================================ CONSTANTS ====================================== //
  // ============================================================================================= //
  const NUM_MILS_PER_MM = 1000 / 25.4

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
  const PLANE_PROXIMITY_TREND_LINE_COEF_M = 3.1298662911e-03
  const PLANE_PROXIMITY_TREND_LINE_COEF_C = 4.0450883823e-01

  // THERMAL CONDUCTIVITY CONSTANTS
  const THERMAL_CONDUCTIVITY_TREND_LINE_COEF_M = -1.4210148167e+00
  const THERMAL_CONDUCTIVITY_TREND_LINE_COEF_C = 1.1958174134e+00

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
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
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
      calc.addVar(new CalcVarNumeric({
        name: 'tempRise',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          new UnitMulti({ name: '°C', multi: 1e0 }),
          new UnitFunc({
            name: 'F',
            toUnit: function (baseValue) {
              return baseValue * 1.8 + 32
            },
            fromUnit: function (unitValue) {
              return (unitValue - 32) / 1.8
            }
          })
        ],
        defaultUnitName: '°C',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
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
      calc.addVar(new CalcVarNumeric({
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
          new UnitMulti({ name: 'um²', multi: 1e-12 }),
          new UnitMulti({ name: 'mils²', multi: unitConversionConstants.M2_PER_MIL2 }),
          new UnitMulti({ name: 'mm²', multi: 1e-6 })
        ],
        defaultUnitName: 'um²',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The unadjusted cross-sectional area. This gets multiplied by the many modifiers to give an adjusted cross-sectional area.'
      }))

      // ============================================ //
      // ========== TRACK THICKNESS (input) ========= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'trackThickness',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'um', multi: 1e-6}),
          new UnitMulti({name: 'mm', multi: 1e-3}),
          new UnitMulti({name: 'oz', multi: unitConversionConstants.COPPER_THICKNESS_M_PER_OZ}),
          new UnitMulti({name: 'mils', multi: unitConversionConstants.METERS_PER_MILS})
        ],
        defaultUnitName: 'um',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
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
      calc.addVar(new CalcVarNumeric({
        name: 'trackThicknessModifier',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          const trackCurrentA = calc.getVar('trackCurrent').getRawVal()
          const trackThicknessM = calc.getVar('trackThickness').getRawVal()

          // Convert to "oz" units, as this is what is used in IPC-2152 graphs
          const trackThicknessOz = trackThicknessM * (1 / unitConversionConstants.COPPER_THICKNESS_M_PER_OZ)

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
          new UnitMulti({name: 'no unit', multi: 1e0})
        ],
        defaultUnitName: 'no unit',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The modifier to adjust the cross-sectional area with based on the track thickness.'
      }))

      // ============================================================================================= //
      // ===================================== BOARD THICKNESS (input) =============================== //
      // ============================================================================================= //
      calc.addVar(new CalcVarNumeric({
        name: 'boardThickness',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'um', multi: 1e-6}),
          new UnitMulti({name: 'mm', multi: 1e-3}),
          new UnitMulti({name: 'mils', multi: unitConversionConstants.METERS_PER_MILS})
        ],
        defaultUnitName: 'mm',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
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
      calc.addVar(new CalcVarNumeric({
        name: 'boardThicknessModifier',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          const boardThicknessM = calc.getVar('boardThickness').getRawVal()

          // Convert to "mils" units, as this is what is used in IPC-2152 graphs
          const boardThicknessMils = boardThicknessM * (1 / unitConversionConstants.METERS_PER_MILS)

          const boardThicknessModifierMulti = BOARD_THICKNESS_TREND_LINE_COEF_A *
            Math.pow(boardThicknessMils, BOARD_THICKNESS_TREND_LINE_COEF_B)

          return boardThicknessModifierMulti
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'no unit', multi: 1e0})
        ],
        defaultUnitName: 'no unit',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The modifier to adjust the cross-sectional area with based on the board thickness.'
      }))

      // ============================================================================================= //
      // ==================================== IS PLANE PRESENT (combobox) ============================ //
      // ============================================================================================= //
      calc.addVar(new CalcVarComboBox({
        name: 'isPlanePresent',
        options: [
          'True',
          'False'
        ],
        defaultVal: 'True',
        validators: [],
        helpText: 'Set this to "True" if there is a copper plane either above or below the current-carrying track, and then enter the distance to it in the "Plane Proximity" field. If there is no plane, set this to "False", and the "Plane Proximity" variable will also disappear.'
      }))

      // ============================================================================================= //
      // ===================================== PLANE PROXIMITY (input) =============================== //
      // ============================================================================================= //
      calc.addVar(new CalcVarNumeric({
        name: 'planeProximity',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'um', multi: 1e-6}),
          new UnitMulti({name: 'mm', multi: 1e-3}),
          new UnitMulti({name: 'mils', multi: unitConversionConstants.METERS_PER_MILS})
        ],
        defaultUnitName: 'mm',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const planeProximity = calc.getVar('planeProximity').getRawVal()
              return (planeProximity >= 144e-6)
            },
            text: 'Plane proximity is below the minimum value (144um) extracted from the plane proximity modifier graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          }),
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const planeProximity = calc.getVar('planeProximity').getRawVal()
              return (planeProximity <= 2.40e-3)
            },
            text: 'Plane proximity is above the maximum value (2.40mm) extracted from the plane proximity modifier graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          }),
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const planeProximity = calc.getVar('planeProximity').getRawVal()
              const boardThickness = calc.getVar('boardThickness').getRawVal()
              return (planeProximity <= boardThickness)
            },
            text: 'Plane proximity cannot be larger than total board thickness (this just does not make sense!).',
            level: 'error'
          })
        ],
        helpText: 'The distance from the current-carrying track to the closest copper plane. If it is a 2-layer 1.6mm PCB, with the current-carrying track on one side and ground on the other side, then the plane proximity would be 1.6mm. For 4 or more layer boards, this value is likely to be much less.'
      }))

      // ============================================================================================= //
      // =============================== PLANE PROXIMITY MODIFIER (output) =========================== //
      // ============================================================================================= //
      calc.addVar(new CalcVarNumeric({
        name: 'planeProximityModifier',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables.
          // isPlanePresent should be a string, either 'True' or 'False'
          const isPlanePresent = calc.getVar('isPlanePresent').getVal()
          const planeProximityM = calc.getVar('planeProximity').getRawVal()

          if (isPlanePresent === 'False') {
            // Lets not modify the cross-sectional area by anything if no plane is present
            // (multiply by 1)
            return 1.0
          }

          // Plane must be present at this point

          // Convert to "mils" units, as this is what is used in IPC-2152 graphs
          const planeProximityMils = planeProximityM * (1 / unitConversionConstants.METERS_PER_MILS)

          const planeProximityModifierMulti = PLANE_PROXIMITY_TREND_LINE_COEF_M * planeProximityMils +
            PLANE_PROXIMITY_TREND_LINE_COEF_C

          return planeProximityModifierMulti
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'no unit', multi: 1e0})
        ],
        defaultUnitName: 'no unit',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The modifier to adjust the cross-sectional area with based on the board thickness.'
      }))

      // ============================================================================================= //
      // =================================== THERMAL CONDUCTIVITY (input) ============================ //
      // ============================================================================================= //
      calc.addVar(new CalcVarNumeric({
        name: 'thermalConductivity',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '0.20',
        units: [
          new UnitMulti({name: 'W/(m*K)', multi: 1e0}),
          new UnitMulti({name: 'BTU/(hour*ft*F)', multi: unitConversionConstants.THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF})
        ],
        defaultUnitName: 'W/(m*K)',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const thermalConductivity = calc.getVar('thermalConductivity').getRawVal()
              return (thermalConductivity >= 180e-3)
            },
            text: 'Thermal conductivity is below the minimum value (180mW/m*c) extracted from the thermal conductivity modififer graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          }),
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const thermalConductivity = calc.getVar('thermalConductivity').getRawVal()
              return (thermalConductivity <= 340e-3)
            },
            text: 'Thermal conductivity is above the maximum value (340mW/m*c) extracted from the thermal conductivity modififer graph in IPC-2152.' +
            ' Results might not be as accurate (extrapolation will occur).',
            level: 'warning'
          })
        ],
        helpText: 'The thermal conductivity of the PCB. This is normally hard to determine, but for most FR4 PCBs this is around 0.20Wm-1K-1.'
      }))

      // ============================================================================================= //
      // ============================ THERMAL CONDUCTIVITY MODIFIER (output) ========================= //
      // ============================================================================================= //
      calc.addVar(new CalcVarNumeric({
        name: 'thermalConductivityModifier',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          const thermalConductivityWattnMeternDegC = calc.getVar('thermalConductivity').getRawVal()

          // Convert to BTU/(ft*hour*F), as this is what the IPC-2152 graph used
          const thermalConductivityBtunFtnHournDegF = thermalConductivityWattnMeternDegC *
            (1 / unitConversionConstants.THERMAL_CONDUCTIVITY_WATT_nMETER_nKELVIN_PER_BTU_nHOUR_nFT_nDEGF) // eslint-disable-line camelcase

          const thermalConductivityModifierMulti = THERMAL_CONDUCTIVITY_TREND_LINE_COEF_M *
            thermalConductivityBtunFtnHournDegF + THERMAL_CONDUCTIVITY_TREND_LINE_COEF_C

          return thermalConductivityModifierMulti
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'no unit', multi: 1e0})
        ],
        defaultUnitName: 'no unit',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The modifier to adjust the cross-sectional area with based on the thermal conductivity of the PCB.'
      }))

      // ============================================================================================= //
      // ========================= ADJUSTED TRACK CROSS-SECTIONAL AREA (output) ====================== //
      // ============================================================================================= //
      calc.addVar(new CalcVarNumeric({
        name: 'adjustedTrackCrossSectionalArea',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          const unadjustedTrackCrossSectionalArea = calc.getVar('unadjustedTrackCrossSectionalArea').getRawVal()
          const trackThicknessModifier = calc.getVar('trackThicknessModifier').getRawVal()
          const boardThicknessModifier = calc.getVar('boardThicknessModifier').getRawVal()
          const planeProximityModifier = calc.getVar('planeProximityModifier').getRawVal()
          const thermalConductivityModifier = calc.getVar('thermalConductivityModifier').getRawVal()

          const adjustedTrackCrosssectionalAreaM2 =
            unadjustedTrackCrossSectionalArea *
            trackThicknessModifier *
            boardThicknessModifier *
            planeProximityModifier *
            thermalConductivityModifier

          return adjustedTrackCrosssectionalAreaM2
        },
        rawVal: '',
        units: [
          new UnitMulti({ name: 'um²', multi: 1e-12 }),
          new UnitMulti({ name: 'mils²', multi: unitConversionConstants.M2_PER_MIL2 }),
          new UnitMulti({ name: 'mm²', multi: 1e-6 })
        ],
        defaultUnitName: 'um²',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The adjusted cross-sectional area, which is equal to the unadjusted cross-section area multiplied by all of the modifiers.'
      }))

      // ============================================================================================= //
      // ===================================== MIN. TRACK WIDTH (output) ============================= //
      // ============================================================================================= //
      calc.addVar(new CalcVarNumeric({
        name: 'minTrackWidth',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          const trackThickness = calc.getVar('trackThickness').getRawVal()
          const adjustedTrackCrossSectionalArea = calc.getVar('adjustedTrackCrossSectionalArea').getRawVal()

          const minimumTrackWidthM = adjustedTrackCrossSectionalArea / trackThickness

          return minimumTrackWidthM
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'um', multi: 1e-6}),
          new UnitMulti({name: 'mm', multi: 1e-3}),
          new UnitMulti({name: 'mils', multi: unitConversionConstants.METERS_PER_MILS})
        ],
        defaultUnitName: 'mm',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const minTrackWidth = calc.getVar('minTrackWidth').getRawVal()

              return minTrackWidth > 0
            },
            text: 'Oh oh, one of the input variables is too far away from the data obtained from the IPC-2152 graphs, and the equations have produced a negative track width. Try and make sure input variables are green (or if orange, not too far away from being green).',
            level: 'error'
          })
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
      isPlanePresent () {
        if (this.calc.getVar('isPlanePresent').getVal() === 'True') {
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      isPlanePresent () {
        this.drawCanvas({
          isPlanePresent: this.isPlanePresent
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

        var pcbStopY
        if (inputObj.isPlanePresent) {
          context.beginPath()
          context.rect(topLeftX, copperPlaneStartY, pcbWidth, copperThickness)
          context.fillStyle = '#d9a654'
          context.fill()
          context.lineWidth = 2
          context.strokeStyle = 'black'
          context.stroke()
          pcbStopY = copperPlaneStartY + copperThickness
        } else {
          pcbStopY = copperPlaneStartY
        }
        // ============================================ //
        // =========== BOARD THICKNESS ARROW ========== //
        // ============================================ //
        canvasShapes.drawArrow(context, topLeftX - 20, topLeftY, topLeftX - 20, pcbStopY)

        // ============================================ //
        // ============= TRACK WIDTH ARROW ============ //
        // ============================================ //
        const trackWidthArrowStartX = topLeftX + pcbWidth / 2 - (trackWidthTop / 2)
        const trackWidthArrowStopX = topLeftX + pcbWidth / 2 + (trackWidthTop / 2)
        canvasShapes.drawArrow(context, trackWidthArrowStartX, topLeftY - 20, trackWidthArrowStopX, topLeftY - 20)

        // ============================================ //
        // =========== TRACK THICKNESS ARROW ========== //
        // ============================================ //
        const trackThicknessAndPlaneProximityArrowX = topLeftX + pcbWidth + 20
        canvasShapes.drawArrow(context, trackThicknessAndPlaneProximityArrowX, topLeftY, trackThicknessAndPlaneProximityArrowX, topLeftY + copperThickness)

        // ============================================ //
        // =========== PLANE PROXIMITY ARROW ========== //
        // ============================================ //
        if (inputObj.isPlanePresent) {
          canvasShapes.drawArrow(context, trackThicknessAndPlaneProximityArrowX, topLeftY + copperThickness, trackThicknessAndPlaneProximityArrowX, pcbStopY)
        }
      },
      openIpc2221ACalc: function () {
        this.$store.dispatch('openCalc', { componentName: 'track-current-ipc-2221a-calculator' })
      }
    },
    mounted () {
      this.drawCanvas({
        isPlanePresent: this.isPlanePresent
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
