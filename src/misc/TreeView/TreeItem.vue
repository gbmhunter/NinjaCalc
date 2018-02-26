<!-- This template is designed to work with CalculatorEngineV2 -->
<template>
  <li v-on:click.stop="handleOnClick">
    <div :class="classes"><span>{{ data.name }}</span></div>
    <ul>
      <tree-item v-for="(child, index) in data.children"
                 :key="index"
                 :data="child"
                v-on:clicked="handleChildClicked"/>
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
    computed: {
      classes () {
        return [
          { 'selected': this.data.selected }
        ]
      }
    },
    methods: {
      handleOnClick () {
        console.log('Item clicked. this.data.name = ')
        console.log(this.data.name)

        this.data.selected = !this.data.selected
        console.log('this.data =')
        console.log(this.data)
        var category = []
        category.unshift(this.data.name)
        this.$emit('clicked', category)
      },
      handleChildClicked (category) {
        console.log('handleChildClicked() called. category = ')
        console.log(category)

        category.unshift(this.data.name)
        // Bubble event upwards (should stop at TreeView component)
        this.$emit('clicked', category)
      }
    },
    mounted () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .selected {
    background-color: red;
  }
</style>
