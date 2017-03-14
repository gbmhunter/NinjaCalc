<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <transition name="modal">
    <div class="modal-mask" v-on:click="borderClicked">
      <div class="modal-wrapper">
        <!-- The .stop below prevents the click event from bubbling, resulting in the
        overlay only being closed when the modal-mask is clicked directly -->
        <div class="modal-container" v-on:click.stop="overlayClicked">
          <div class="modal-body">
            <div id="search-container">
              Search:
              <input v-model="searchText" style="width: 200px; height: 25px;">
            </div>
            <div class="preview-grid">
              <!-- GENERATE CALCULATOR PREVIEWS -->
              <CalcPreview v-for="item in $store.state.availableCalcs"
                           :title='item.displayName'
                           :description="item.description"
                           :componentName="item.mainView.name"
                            :imageUrl="item.imagePath">
              </CalcPreview>
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
      return {}
    },
    computed: {
      searchText: {
        get () {
          return this.$store.state.searchText
        },
        set (value) {
          this.$store.commit('setSearchText', value)
        }
      }
    },
    methods: {
      borderClicked (event) {
        console.log('border clicked')
        this.$store.commit('showCalculatorSelectionOverlay', {
          trueFalse: false
        })
      },
      overlayClicked (event) {
        // Do nothing, this handler exists purely to swallow event
        // (event does not bubble because of .stop modifier in HTML)
      }
    },
    watch: {},
    mounted () {}
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

  .modal-body {
    height: 100%;
    /*margin: 20px 0;*/
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

</style>
