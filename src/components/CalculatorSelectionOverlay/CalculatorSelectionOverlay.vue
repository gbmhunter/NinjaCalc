<template xmlns:v-on="http://www.w3.org/1999/xhtml">

  <transition name="modal">
    <div class="modal-mask" v-on:click="borderClicked">
      <div class="modal-wrapper">
        <div class="modal-container" v-on:click.stop="overlayClicked">

          <div class="modal-body">
            <div class="preview-grid">
              <CalcPreview v-for="item in $store.state.availableCalcs"
                           :title='item.name'
                           :componentName="item.componentName"
                            :imageUrl="item.imagePath">

              </CalcPreview>
            </div>
          </div>

          <div class="modal-footer">
              <md-button class="md-raised md-primary" @click="$emit('close')">Close</md-button>
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
    computed: {
    },
    methods: {
      borderClicked (event) {
        console.log('border clicked')
        this.$store.commit('showCalculatorSelectionOverlay', {
          trueFalse: false
        })
      },
      overlayClicked (event) {

      },
      imagePath () {
        return require('../../components/OhmsLawCalculator/' + 'grid-icon.png')
      }
    },
    mounted () {
      console.log('CalculatorSelectionOverlay.mounted() called.')
      this.showModal = true
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .preview-grid {
    display: flex;

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
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
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
