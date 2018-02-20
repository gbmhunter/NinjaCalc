<!-- This template is designed to work with CalculatorEngineV2 -->
<template>
  <div>
    <p>Test</p>
    <ul>
      <tree-item v-for="(child, index) in data"
        :key="index"
        :data="child"/>
    </ul>
  </div>
</template>

<script>

  export default {
    name: 'tree-view',
    props: {
      data: {type: Array}
    },
    components: {},
    computed: {},
    methods: {},
    mounted () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
