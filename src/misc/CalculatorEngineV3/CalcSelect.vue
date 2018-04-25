<!-- This template is designed to work with CalculatorEngineV2 -->
<template>
  <select
    ref="varValue"
    :value="value"
    class="calc-select"
    :class="inputClasses"
    @change="onChange()">
    <option v-for="option in options" :key="option">{{ option }}</option>
  </select>
</template>

<script>
import './style.css'

export default {
  name: 'calc-select',
  props: {
    value: {
      type: [String],
      required: true
    },
    options: {
      type: [Array],
      required: true
    }
  },
  components: {},
  data () {
    return {}
  },
  computed: {
    inputClasses () {
      return []
    }
  },
  methods: {
    onChange () {
      console.log('onChange() called. this.$refs.varValue.value = ')
      console.log(this.$refs.varValue.value)
      this.$emit('input', this.$refs.varValue.value)
    }
  },
  watch: {},
  mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
