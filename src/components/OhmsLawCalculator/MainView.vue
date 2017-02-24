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
        <b-form-input class="variable-value" v-model="voltage.rawVal" type="text"
                      @input="varsChanged"></b-form-input>
        <div style="width: 5px;"></div>
        <select v-model="voltage.selUnit" class="variable-units">
          <option v-for="option in voltage.units" :value="option.value">
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
        <b-form-input v-model="current.rawVal" type="text" @input="varsChanged" class="variable-value"></b-form-input>
        <div style="width: 5px;"></div>
        <select v-model="current.selUnit" class="variable-units">
          <option v-for="option in current.units" :value="option.value">
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
        <b-form-input v-model="resistance.rawVal" type="text" @input="varsChanged" class="variable-value"></b-form-input>
        <div style="width: 5px;"></div>
        <select v-model="resistance.selUnit" class="variable-units">
          <option v-for="option in resistance.units" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>

  </div>

</template>

<script>

  import CalcVar from '../../misc/CalcVar'

  var temp = {
    name: 'ohms-law-calculator',
    props: {},
    data: function () {
      return {
        voltage: new CalcVar({
          name: 'voltage',
          initRawVal: '',
          units: [
            {text: 'mV', value: 1e-3},
            {text: 'V', value: 1}
          ],
          selUnit: 'V'
        }),

        current: new CalcVar({
          name: 'current',
          initRawVal: '',
          units: [
            {text: 'uA', value: 1e-6},
            {text: 'mA', value: 1e-3},
            {text: 'A', value: 1}
          ],
          selUnit: 'A'
        }),

        resistance: new CalcVar({
          name: 'resistance',
          initRawVal: '',
          units: [
            {text: 'mΩ', value: 1e-3},
            {text: 'Ω', value: 1},
            {text: 'kΩ', value: 1e3},
            {text: 'MΩ', value: 1e6}
          ],
          selUnit: 'Ω'
        }),

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

        switch (this.calcWhat) {
          case 'voltage':
            this.voltage = { ...this.voltage, rawVal: this.current.rawVal * this.resistance.rawVal }
            break
          case 'current':
            this.current = { ...this.current, rawVal: this.voltage.rawVal / this.resistance.rawVal }
            break
          case 'resistance':
            this.resistance = { ...this.resistance, rawVal: this.voltage.rawVal / this.current.rawVal }
            break
        }
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
