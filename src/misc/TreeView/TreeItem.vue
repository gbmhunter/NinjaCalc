<!-- This template is designed to work with CalculatorEngineV2 -->
<template>
  <li v-on:click.stop="handleOnClick">
    <div :class="classes"><span>{{ data.name }}</span></div>
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
