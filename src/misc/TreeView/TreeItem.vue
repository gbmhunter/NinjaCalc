<!-- This template is designed to work with CalculatorEngineV2 -->
<template>
  <li v-on:click.stop="handleOnClick" style="background-color: transparent; margin: 0;">
    <!-- This div goes behind list element, has width that spans entire width of tree view -->
    <div class="whole-row" :class="{ hover: isHover }" @mouseover="isHover=true" @mouseout="isHover=false"
         style="width: 100%; display: block; position: absolute; left: 0; height: 25px; z-index: 0; transition: background-color 0.2s ease;"></div>
      <div class="name" :class="{ selected: data.selected }" @mouseover="isHover=true" @mouseout="isHover=false"
           style="z-index: 1; background-color: transparent; position: relative; height: 25px; display: flex; justify-content: center; flex-direction: column;">{{ data.name }}</div>
    <ul style="padding-left: 10px; background-color: transparent;">
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
    data () {
      return {
        isHover: false
      }
    },
    components: {},
    computed: {},
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

  div.hover {
    background-color: rgb(33, 150, 243);
    color: white;
  }

</style>
