<!-- This template is designed to work with CalculatorEngineV2 -->
<template>
  <div style="position: relative; background-color: transparent;">
    <ul style="background-color: transparent;">
      <tree-item v-for="(child, index) in model.children"
        :key="index"
        :data="child"
                 v-on:clicked="handleChildClicked" v-on:unselectAll="handleUnselectAll" style="background-color: transparent;"/>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'tree-view',
  props: {
    data: {type: Object}
  },
  data () {
    return {
      model: this.data
    }
  },
  components: {},
  computed: {},
  methods: {
    handleChildClicked (payload) {
      console.log('handleChildClicked() called. payload = ')
      console.log(payload)

      // category.unshift(this.data.name)
      // Bubble event upwards (should stop at TreeView component)
      this.$emit('clicked', payload)
    },
    handleUnselectAll () {
      console.log('TreeView.handleUnselectAll() called.')
      console.log('Before unselection, tree = ')
      console.log(this.model)
      this.unselectAllInNodeAndChildren(this.model)
      console.log('After unselection, tree = ')
      console.log(this.model)
    },
    unselectAllInNodeAndChildren (node) {
      node.selected = false
      node.children.map((child) => {
        this.unselectAllInNodeAndChildren(child)
      })
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
