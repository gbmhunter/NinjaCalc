<!-- This template is designed to work with CalculatorEngineV2 -->
<template>
  <div>
    <ul>
      <tree-item v-for="(child, index) in data.children"
        :key="index"
        :data="child"
                 v-on:clicked="handleChildClicked" />
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
    methods: {
      handleChildClicked (category) {
        console.log('handleChildClicked() called. category = ')
        console.log(category)

        // category.unshift(this.data.name)
        // Bubble event upwards (should stop at TreeView component)
        this.$emit('clicked', category)
      }
    },
    watch: {
      // data: {
      //   handler (val) {
      //     console.log('data.handler() called.')
      //     this.$emit('dataChanged')
      //   },
      //   deep: true
      // }
    },
    mounted () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
