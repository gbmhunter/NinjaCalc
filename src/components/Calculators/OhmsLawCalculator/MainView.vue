<template xmlns:v-on="http://www.w3.org/1999/xhtml">

  <div class="diagram-container" style="position: relative; width: 600px; height: 600px;">

    <!-- Background image is centered in diagram container -->
    <img :src="require('./diagram.png')" style="left: 50px; top: 50px; width: 500px; height: 500px; z-index: -1">

    <!-- ========================================= -->
    <!-- =============== VOLTAGE ================= -->
    <!-- ========================================= -->
    <div class="variable-container" style="left: 0px; top: 240px;">

      <!-- INPUT/OUTPUT DECIDER -->
      <input type="radio" ref="voltageRadio" name="calcWhat" style="left: 0px; top: 20px">

      <div style="left: 0px; top: 70px; display: flex; align-items: center;" class="value-unit-container">
        <!-- VALUE -->
        <input ref="voltageInput" class="variable-value">
        <div style="width: 5px;"></div>

        <!-- UNITS -->
        <select ref="voltageSelectUnits" class="variable-units"></select>
      </div>
    </div>

    <!-- ========================================= -->
    <!-- =============== CURRENT ================= -->
    <!-- ========================================= -->
    <div class="variable-container" style="left: 440px; top: 360px;">

      <input type="radio" ref="currentRadio" name="calcWhat" style="left: 100px; top: 0px;">
      <div style="left: 0px; top: 50px; display: flex; align-items: center;" class="value-unit-container">

        <input ref="currentInput" class="variable-value">
        <div style="width: 5px;"></div>

        <!-- UNITS -->
        <select ref="currentSelectUnits" class="variable-units"></select>
      </div>
    </div>

    <!-- ========================================= -->
    <!-- ============= RESISTANCE ================ -->
    <!-- ========================================= -->
    <div class="variable-container" style="left: 450px; top: 160px;">
      <!--<md-radio v-model="calcWhat" id="my-test1" name="my-test-group1" md-value="resistance"></md-radio>-->
      <input type="radio" ref="resistanceRadio" name="calcWhat" style="left: 100px; top: 0px;">

      <div style="left: 0px; top: 40px; display: flex; align-items: center;" class="value-unit-container">

        <input ref="resistanceInput" class="variable-value">
        <div style="width: 5px;"></div>


        <!-- UNITS -->
        <select ref="resistanceSelectUnits" class="variable-units"></select>
      </div>
    </div>

  </div>

</template>

<script>

  import Calculator from 'src/misc/Calculator'
  import CalcVar from 'src/misc/CalcVar'

  export default {
    name: 'ohms-law-calculator',
    props: {},
    data: function () {
      return {
        calcWhat: 'resistance',
        test: '5.61'
      }
    },
    components: {},
    computed: {},
    watch: {
      selUnit () {
        console.log(this.selUnit)
      }
    },
    methods: {},
    mounted () {
      console.log('OhmsLawCalculator.mounted() called.')

      // Check resistance (default variable that is an output)
      this.$refs.resistanceRadio.checked = true

      var calc = new Calculator()
      calc.addVariable(new CalcVar({
        name: 'voltage',
        uiInputValue: this.$refs.voltageInput,
        uiSelectUnits: this.$refs.voltageSelectUnits,
        initRawVal: '',
        units: [
          {text: 'mV', multi: 1e-3},
          {text: 'V', multi: 1}
        ],
        selUnit: 'V',
        eqn: () => {
          return calc.getVar('current').getRawVal() * calc.getVar('resistance').getRawVal()
        },
        typeEqn: () => {
          if (this.$refs.voltageRadio.checked) {
            return 'output'
          } else {
            return 'input'
          }
        },
        calc: calc
      }))
      calc.addVariable(new CalcVar({
        name: 'current',
        uiInputValue: this.$refs.currentInput,
        uiSelectUnits: this.$refs.currentSelectUnits,
        initRawVal: '',
        units: [
          {text: 'uA', multi: 1e-6},
          {text: 'mA', multi: 1e-3},
          {text: 'A', multi: 1}
        ],
        selUnit: 'A',
        eqn: () => {
          return calc.getVar('voltage').getRawVal() / calc.getVar('resistance').getRawVal()
        },
        typeEqn: () => {
          if (this.$refs.currentRadio.checked) {
            return 'output'
          } else {
            return 'input'
          }
        },
        calc: calc
      }))
      calc.addVariable(new CalcVar({
        name: 'resistance',
        uiInputValue: this.$refs.resistanceInput,
        uiSelectUnits: this.$refs.resistanceSelectUnits,
        initRawVal: '',
        units: [
          {text: 'mΩ', multi: 1e-3},
          {text: 'Ω', multi: 1},
          {text: 'kΩ', multi: 1e3},
          {text: 'MΩ', multi: 1e6}
        ],
        selUnit: 'Ω',

        eqn: () => {
          return calc.getVar('voltage').getRawVal() / calc.getVar('current').getRawVal()
        },
        typeEqn: () => {
          if (this.$refs.resistanceRadio.checked) {
            return 'output'
          } else {
            return 'input'
          }
        },
        calc: calc
      }))
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
    position: absolute;
  }

  .value-unit-container {
    position: absolute;
  }

  .variable-value {
    width: 150px;
    height: 40px;
  }

  .variable-units {
    height: 40px;
  }

  input[type="radio"] {
    transform: scale(1.5)
  }

</style>
