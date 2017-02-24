<template xmlns:v-on="http://www.w3.org/1999/xhtml">

  <div class="diagram-container" style="position: relative; width: 600px; height: 600px;">

    <!-- Background image is centered in diagram container -->
    <img :src="require('./diagram.png')" style="left: 50px; top: 50px; width: 500px; height: 500px; z-index: -1">

    <!-- ========================================= -->
    <!-- =============== VOLTAGE ================= -->
    <!-- ========================================= -->
    <div class="variable-container" style="left: 10px; top: 240px;">

      <md-radio v-model="calcWhat" id="my-test1" name="my-test-group1" md-value="voltage"
                style="position: absolute; left: 20px; top: 0px"></md-radio>

      <div style="left: 0px; top: 80px; display: flex; align-items: center;">
        <!-- VALUE -->
        <!--<b-form-input class="variable-value" type="text" :value="12"
                      @input="calc.getVar('voltage').setDispVal($event)"></b-form-input>-->
        <input ref="voltageInput">
        <div style="width: 5px;"></div>

        <!-- UNITS -->
        <select ref="voltageUnits" class="variable-units">
          <option>
          </option>
        </select>
      </div>
    </div>

    <!-- ========================================= -->
    <!-- =============== CURRENT ================= -->
    <!-- ========================================= -->
    <div style="left: 440px; top: 340px;">
      <md-radio v-model="calcWhat" id="my-test1" name="my-test-group1" md-value="current"></md-radio>

      <div style="left: 0px; top: 70px; display: flex; align-items: center;">
        <!--<b-form-input v-model="calc.getVar('current').dispVal" type="text" @input="varsChanged" class="variable-value"></b-form-input>-->
        <input ref="currentInput">

        <div style="width: 5px;"></div>
        <!--<select v-model="calc.getVar('current').selUnit" class="variable-units">-->
          <!--<option v-for="option in calc.getVar('current').units" :value="option.value">-->
            <!--{{ option.text }}-->
          <!--</option>-->
        <!--</select>-->
      </div>
    </div>

    <!-- ========================================= -->
    <!-- ============= RESISTANCE ================ -->
    <!-- ========================================= -->
    <div style="left: 450px; top: 140px;">
      <md-radio v-model="calcWhat" id="my-test1" name="my-test-group1" md-value="resistance"></md-radio>

      <div style="left: 0px; top: 70px; display: flex; align-items: center;">
        <!--<b-form-input v-model="calc.getVar('resistance').dispVal" type="text" @input="varsChanged" class="variable-value"></b-form-input>-->

        <input ref="resistanceInput">
        <!--<div style="width: 5px;"></div>-->
        <!--<select v-model="calc.getVar('resistance').selUnit" class="variable-units">-->
          <!--<option v-for="option in calc.getVar('resistance').units" :value="option.value">-->
            <!--{{ option.text }}-->
          <!--</option>-->
        <!--</select>-->
      </div>
    </div>

  </div>

</template>

<script>

  import Calculator from '../../misc/Calculator'
  import CalcVar from '../../misc/CalcVar'

  var temp = {
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
    methods: {
    },
    mounted () {
      console.log('OhmsLawCalculator.mounted() called.')

      var calc = new Calculator()
      calc.addVariable(new CalcVar({
        name: 'voltage',
        valueInput: this.$refs.voltageInput,
        initRawVal: '',
        units: [
          {text: 'mV', value: 1e-3},
          {text: 'V', value: 1}
        ],
        selUnit: 'V',
        eqn: () => {
          return 2
        },
        typeEqn: () => {
          return 'input'
        },
        calc: calc
      }))
      calc.addVariable(new CalcVar({
        name: 'current',
        valueInput: this.$refs.currentInput,
        initRawVal: '',
        units: [
          {text: 'uA', value: 1e-6},
          {text: 'mA', value: 1e-3},
          {text: 'A', value: 1}
        ],
        selUnit: 'A',
        eqn: () => {
          return 4
        },
        typeEqn: () => {
          return 'input'
        },
        calc: calc
      }))
      calc.addVariable(new CalcVar({
        name: 'resistance',
        valueInput: this.$refs.resistanceInput,
        initRawVal: '',
        units: [
          {text: 'mΩ', value: 1e-3},
          {text: 'Ω', value: 1},
          {text: 'kΩ', value: 1e3},
          {text: 'MΩ', value: 1e6}
        ],
        selUnit: 'Ω',
        eqn: () => {
          return calc.getVar('voltage').getRawVal() / calc.getVar('current').getRawVal()
        },
        typeEqn: () => {
          return 'output'
        },
        calc: calc
      }))
    }
  }

  export default temp

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

  .variable-value {
    width: 150px;
    height: 40px;
  }

  .variable-units {
    height: 40px;
  }

</style>
