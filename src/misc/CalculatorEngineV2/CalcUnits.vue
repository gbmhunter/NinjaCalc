<!-- This template is designed to work with CalculatorEngineV2 -->
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <select v-model="calcVar.selUnit" v-on:change="calcVar.onUnitChange()" class="variable-units"
          :style="{ width: width + 'px', height: height + 'px' }">
    <option v-for="option in calcVar.units" v-bind:value="option.value">
      {{ option.text }}
    </option>
  </select>
</template>

<script>

  import './style.css'

  export default {
    name: 'calc-unit',
    props: {
      calcVar: {
        type: Object,
        required: true
      },
      width: {
        type: Number,
        required: false,
        default: 80
      },
      height: {
        type: Number,
        required: false,
        default: 35
      }
    },
    components: {},
    computed: {
      readonly () {},
      methods: {},
      mounted () {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
