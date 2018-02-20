<!-- This template is designed to work with CalculatorEngineV2 -->
<template>
  <li>
    <span>{{ data.name }}</span>
    <ul>
      <tree-item v-for="(child, index) in data.children"
                 :key="index"
                 :data="child" />
    </ul>

  </li>
</template>

<script>

  export default {
    name: 'tree-item',
    props: {
      data: {type: Object, required: true}
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
