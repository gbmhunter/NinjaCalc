<template xmlns:v-on="http://www.w3.org/1999/xhtml">

  <div>
    <div>

      Voltage
      <b-form-input style="width:200px;" v-model="voltage"
                    type="text"
      ></b-form-input>

      <!--V = <input v-model="voltage" @keyup="varsChanged">-->
      <md-radio v-model="calcWhat" id="my-test1" name="my-test-group1" md-value="voltage"></md-radio>
    </div>
    <div style="height: 20px;"></div>
    <div>
      I = <input v-model="current" @keyup="varsChanged">
      <md-radio v-model="calcWhat" id="my-test1" name="my-test-group1" md-value="current"></md-radio>
    </div>
    <div style="height: 20px;"></div>
    <div>
      R = <input v-model="resistance" @keyup="varsChanged">
      <md-radio v-model="calcWhat" id="my-test1" name="my-test-group1" md-value="resistance"></md-radio>
    </div>
  </div>

</template>

<script>

  import {CalculatorServiceSingleton} from '../../services/CalculatorService'

  var temp = {
    displayName: 'Ohm\'s Law',
    name: 'ohms-law-calculator',
    props: {},
    data: function () {
      return {
        voltage: '',
        current: '',
        resistance: '',
        calcWhat: 'resistance'
      }
    },
    components: {},
    computed: {},
    watch: {},
    methods: {
      varsChanged () {
        console.log('varsChanged() called.')

//        if (this.calcWhat === 'resistance') {
//          this.resistance = this.voltage / this.current
//        }

        switch (this.calcWhat) {
          case 'voltage':
            this.voltage = this.current * this.resistance
            break
          case 'current':
            this.current = this.voltage / this.resistance
            break
          case 'resistance':
            this.resistance = this.voltage / this.current
            break
        }
      }
    },
    mounted () {
      console.log('OhmsLawCalculator.mounted() called.')
    }
  }

  export default temp

  // Register calculator
  var calculatorService = CalculatorServiceSingleton.getInstance()
  calculatorService.registerCalc(temp)

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
