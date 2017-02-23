<template xmlns:v-on="http://www.w3.org/1999/xhtml">


  <div class="diagram-container" style="position: relative; width: 600px; height: 600px;">

    <!-- Background image is centered in diagram container -->
    <img :src="require('./diagram.png')" style="left: 50px; top: 50px; width: 500px; height: 500px; z-index: -1">

    <!-- ========================================= -->
    <!-- =============== VOLTAGE ================= -->
    <!-- ========================================= -->
    <div style="left: 10px; top: 240px;">
      <md-radio v-model="calcWhat" id="my-test1" name="my-test-group1" md-value="voltage"
                style="left: 20px; top: 0px"></md-radio>
      <b-form-input style="left: 0px; top: 70px; width: 150px;" v-model="voltage" type="text"
                    @input="varsChanged"></b-form-input>
    </div>

    <!-- ========================================= -->
    <!-- =============== CURRENT ================= -->
    <!-- ========================================= -->
    <div style="left: 440px; top: 340px;">
      <md-radio v-model="calcWhat" id="my-test1" name="my-test-group1" md-value="current"
                style="left: 90px;"></md-radio>
      <b-form-input style="left: 0px; top: 70px; width:150px;" v-model="current" type="text"
                    @input="varsChanged"></b-form-input>
    </div>

    <!-- ========================================= -->
    <!-- ============= RESISTANCE ================ -->
    <!-- ========================================= -->
    <div style="left: 450px; top: 140px;">
      <md-radio v-model="calcWhat" id="my-test1" name="my-test-group1" md-value="resistance"
                style="left: 90px;"></md-radio>
      <b-form-input style="left: 0px; top: 70px; width:150px;" v-model="resistance" type="text"
                    @input="varsChanged"></b-form-input>
    </div>

  </div>

</template>

<script>

  var temp = {
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

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .diagram-container {
    position: relative;
  }

  .diagram-container * {
    position: absolute;
  }
</style>
