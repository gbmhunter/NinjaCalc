<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <transition name="modal">
    <div class="modal-mask" v-on:click="borderClicked">
      <div class="modal-wrapper">
        <!-- The .stop below prevents the click event from bubbling, resulting in the
        overlay only being closed when the modal-mask is clicked directly -->
        <div class="modal-container" v-on:click.stop="overlayClicked">
          <div class="modal-body" style="display: flex; flex-direction: row; height: 100%;">
            <!------------------------>
            <!-- CATEGORY TREE VIEW -->
            <!------------------------>
            <div style="width: 200px; text-align: left; border-right: 1px solid #cdcdcd;">
              <tree-view :data="treeData" v-on:clicked="categoryClicked" />
            </div>
            <!-- The flex: 1 below makes the grid/search take up the remaining horizontal space
             once the category filter has been assigned space on the left hand-side -->
          <div style="flex: 1; display: flex; flex-direction: column; height: 100%;">
            <!---------------------->
            <!-- SEARCH CONTAINER -->
            <!---------------------->
            <div id="search-container">
              <span style="padding-right: 5px;">Search</span>
              <input v-model="searchText" style="width: 400px; height: 25px;">
            </div>
            <!---------------------------------->
            <!-- GENERATE CALCULATOR PREVIEWS -->
            <!---------------------------------->
            <transition-group name="list" tag="div" class="preview-grid">
              <CalcPreview v-for="item in $store.state.core.calcsFilteredByCategoryAndSearch"
                           class="list-complete-item"
                           :title='item.displayName'
                           :description="item.description"
                           :componentName="item.mainView.name"
                           :imageUrl="item.imagePath"
                           :key="item.displayName"> <!-- key is important for transition to work correctly -->
              </CalcPreview>
            </transition-group>
          </div>
          </div>
          </div>
        </div>
      </div>
  </transition>
</template>

<script>

  import CalcPreview from '../CalcPreview/CalcPreview'

  export default {
    name: 'calculator-selection-overlay',
    components: {
      CalcPreview
    },
    data: function () {
      return {
      }
    },
    computed: {
      searchText: {
        get () {
          return this.$store.state.core.searchText
        },
        set (value) {
          this.$store.dispatch('setSearchText', value)
        }
      },
      treeData () {
        var output = {
          'name': 'root',
          'selected': false,
          'children': []
        }

        console.log(this.$store)
        var self = this
        this.$store.state.core.availableCalcs.map(function (calc) {
          // console.log('calc =')
          // console.log(calc)
          self.addCategoriesToTree(calc.category, output)
          // console.log('After adding category elements for 1 calculator, output =')
          // console.log(output)
        })
        return output
      }
    },
    methods: {
      addCategoriesToTree (categories, treeNode) {
        // console.log('addCategoriesToTree() called with categories =')
        console.log(categories)

        // Copy array, we are going to modify it, and we don't want to touch
        // the original!
        categories = categories.slice()
        // console.log(', treeNode =')
        // console.log(treeNode)

        var inTree = false
        treeNode.children.map(function (childNode) {
          if (childNode.name === categories[0]) {
            inTree = true
          }
        })

        // Add first category element if it doesn't already exist
        if (!inTree) {
          console.log('Category ' + categories[0] + ' not found in tree.')
          var newTreeNode = {
            'name': categories[0],
            'selected': false,
            'children': []
          }
          treeNode.children.push(newTreeNode)
        }

        // Remove first category element
        categories.splice(0, 1)

        if (categories.length > 0) {
          this.addCategoriesToTree(categories, treeNode.children[treeNode.children.length - 1])
        }
      },
      borderClicked (event) {
        this.$store.commit('showCalculatorSelectionOverlay', {
          trueFalse: false
        })
      },
      overlayClicked (event) {
        // Do nothing, this handler exists purely to swallow event
        // (event does not bubble because of .stop modifier in HTML)
      },
      itemClick (node) {
        console.log(node.model.text + ' clicked !')
      },
      categoryClicked (category) {
        console.log('categoryClicked() called. category =')
        console.log(category)
        this.$store.dispatch('setSelCategory', category)
      }
    },
    watch: {},
    mounted () {
      if (!this.$store.state.core.calcsFilteredByCategoryAndSearch) {
        throw Error('this.$store.state.core.calcsFilteredByCategoryAndSearch was null.')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /* This is the grid that holds all of the calculator preview objects. */
  .preview-grid {

    height: 100%;

    display: flex;
    flex-wrap: wrap;

    /* This makes the calculators appears as if they are in a grid system
     space-inbetween does not work so well for the last, incomplete row */
    justify-content: flex-start;

    /* Adds scroll-bars when there are too many calculator previews to fit in the screen. */
    overflow-y: scroll;
  }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;

    width: 100%;
    height: 100%;
  }

  .modal-container {
    width: 80%;
    height: 80%;

    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  /* Transition setup for "tile sliding" effect on the calculator preview
  objects when search text is entered */
  .list-leave-active {
    position: absolute !important;
  }

  .list-move {
    /* The time below determines the length of the move transition */
    transition: transform 0.7s !important;
  }

</style>
