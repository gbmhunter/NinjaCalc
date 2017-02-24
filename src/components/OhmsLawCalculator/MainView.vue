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
        <b-form-input v-model="calc.getVar('voltage').dispVal" class="variable-value" type="text"
                      @input="varsChanged"></b-form-input>
        <div style="width: 5px;"></div>
        <select v-model="calc.getVar('voltage').selUnit" class="variable-units">
          <option v-for="option in calc.getVar('voltage').units" :value="option.value">
            {{ option.text }}
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
        <b-form-input v-model="calc.getVar('current').dispVal" type="text" @input="varsChanged" class="variable-value"></b-form-input>
        <div style="width: 5px;"></div>
        <select v-model="calc.getVar('current').selUnit" class="variable-units">
          <option v-for="option in calc.getVar('current').units" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>

    <!-- ========================================= -->
    <!-- ============= RESISTANCE ================ -->
    <!-- ========================================= -->
    <div style="left: 450px; top: 140px;">
      <md-radio v-model="calcWhat" id="my-test1" name="my-test-group1" md-value="resistance"></md-radio>

      <div style="left: 0px; top: 70px; display: flex; align-items: center;">
        <b-form-input v-model="calc.getVar('resistance').dispVal" type="text" @input="varsChanged" class="variable-value"></b-form-input>
        <div style="width: 5px;"></div>
        <select v-model="calc.getVar('resistance').selUnit" class="variable-units">
          <option v-for="option in calc.getVar('resistance').units" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>

  </div>

</template>

<script>

  import Calculator from '../../misc/Calculator'
  import CalcVar from '../../misc/CalcVar'

  var calculator = new Calculator()
  calculator.addVariable(new CalcVar({
    name: 'voltage',
    initRawVal: '',
    units: [
      {text: 'mV', value: 1e-3},
      {text: 'V', value: 1}
    ],
    selUnit: 'V'
  }))
  calculator.addVariable(new CalcVar({
    name: 'current',
    initRawVal: '',
    units: [
      {text: 'uA', value: 1e-6},
      {text: 'mA', value: 1e-3},
      {text: 'A', value: 1}
    ],
    selUnit: 'A'
  }))
  calculator.addVariable(new CalcVar({
    name: 'resistance',
    initRawVal: '',
    units: [
      {text: 'mΩ', value: 1e-3},
      {text: 'Ω', value: 1},
      {text: 'kΩ', value: 1e3},
      {text: 'MΩ', value: 1e6}
    ],
    selUnit: 'Ω'
  }))

  var temp = {
    name: 'ohms-law-calculator',
    props: {},
    data: function () {
      return {
        calc: calculator,
        calcWhat: 'resistance'
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
      varsChanged () {
        console.log('varsChanged() called.')

        var calc = this.calc

        switch (this.calcWhat) {
          case 'voltage':
            // this.voltage = { ...this.voltage, rawVal: this.current.rawVal * this.resistance.rawVal }
            calc.getVar('voltage').dispVal = calc.getVar('current').dispVal * calc.getVar('resistance').dispVal
            break
          case 'current':
            // this.current = { ...this.current, rawVal: this.voltage.rawVal / this.resistance.rawVal }
            calc.getVar('current').dispVal = calc.getVar('voltage').dispVal / calc.getVar('resistance').dispVal
            break
          case 'resistance':
            calc.getVar('resistance').dispVal = calc.getVar('voltage').dispVal / calc.getVar('current').dispVal
            break
        }

        console.log('this.calc (before) =')
        console.log(this.calc)
        this.calc = Object.assign(Object.create(Calculator.prototype), calc)
        console.log('this.calc (after) =')
        console.log(this.calc)
      }
    },
    mounted () {
      console.log('OhmsLawCalculator.mounted() called.')
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
