<!-- This template is designed to work with CalculatorEngineV2 -->
<template>
  <li v-on:click.stop="handleOnClick" style="background-color: transparent; margin: 0;">
    <!-- This div goes behind list element, has width that spans entire width of tree view -->
    <div class="whole-row clickable" :class="{ hover: isHover, selected: data.selected }" @mouseover="isHover=true" @mouseout="isHover=false"
         style="width: 100%; display: block; position: absolute; left: 0; height: 25px; z-index: 0; transition: background-color 0.2s ease;"></div>
      <div class="name clickable" @mouseover="isHover=true" @mouseout="isHover=false"
           style="z-index: 1; background-color: transparent; position: relative; height: 25px;">{{ data.name }}</div>
    <ul style="padding-left: 10px; background-color: transparent;">
      <tree-item v-for="(child, index) in model.children"
                 :key="index"
                 :data="child"
                v-on:clicked="handleChildClicked"
                v-on:unselectAll="handleUnselectAll"/>
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
        isHover: false,
        model: this.data
      }
    },
    components: {},
    computed: {},
    methods: {
      handleOnClick () {
        console.log('Item clicked. this.data.name = ')
        console.log(this.model.name)

        var wasSelected = this.model.selected
        this.$emit('unselectAll')
        this.model.selected = !wasSelected
        console.log('this.data =')
        console.log(this.model)
        var category = []
        category.unshift(this.model.name)
        this.$emit('clicked', { category: category, isSelected: this.model.selected })
      },
      handleChildClicked (payload) {
        console.log('handleChildClicked() called. payload = ')
        console.log(payload)

        payload.category.unshift(this.model.name)
        // Bubble event upwards (should stop at TreeView component)
        this.$emit('clicked', payload)
      },
      handleUnselectAll () {
        this.$emit('unselectAll')
      }
    },
    mounted () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div.selected {
    background-color: rgb(33, 150, 243);
  }

  div.hover {
    background-color: rgba(33, 150, 243, 0.7);
    color: white;
  }

  /* Makes element appear clickable to the user */
  .clickable {
    cursor: pointer;
  }

</style>
