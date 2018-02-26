<!-- This template is designed to work with CalculatorEngineV2 -->
<template>
  <div>
    <ul>
      <tree-item v-for="(child, index) in data.children"
        :key="index"
        :data="child"/>
    </ul>
  </div>
</template>

<script>

  export default {
    name: 'tree-view',
    props: {
      data: {type: Object}
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
