<!-- This template is designed to work with CalculatorEngineV2 -->
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="value-unit-container">
    <input v-model="calcVar.dispVal" v-on:keyup="calcVar.onDispValChange()" class="variable-value" :class="calcVar.validationResult">

    <select v-model="calcVar.selUnit" v-on:change="calcVar.onUnitChange()" class="variable-units">
      <option v-for="option in calcVar.units" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>

</template>

<script>

  export default {
    name: 'calc-value',
    props: {
      calcVar: {
        type: Object,
        required: true
      }
    },
    components: {},
    computed: {},
    methods: {},
    mounted () {
      console.log('CalcValue.mounted() called.')
      console.log('this.calcVar =')
      console.log(this.calcVar)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .value-unit-container {
    display: flex;
    align-items: center;
  }

  .variable-value {
    width: 150px;
    height: 40px;
  }

  .variable-units {
    height: 40px;
    margin-left: 5px;
  }

  .ok {
    background-color: rgba(45, 255, 0, 0.29);
  }

  .warning {
    background-color: rgba(255, 165, 0, 0.31);
  }

  .error {
    background-color: rgba(255, 0, 0, 0.24);
  }

</style>
