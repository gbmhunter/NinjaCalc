<script type="text/x-template" id="modal-template">
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              default body
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              default footer
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</script>

<template xmlns:v-on="http://www.w3.org/1999/xhtml">

  <div id="app">

    <div id="left-bar">
      <md-button class="md-icon-button" @click.native="showLeftSideNav">
        <md-icon>menu</md-icon>
      </md-button>
    </div>

    <!-- Only show this if no calculators are open -->
    <div id="no-calc-screen" v-if="!this.$store.state.openCalcs.length">
      <div class="centered">
        <div class="md-display-1">No calculators are open! Do you wish to create one?</div>
        <div style="height: 20px;"></div>
        <md-button @click.native="showCalculatorSelectionOverlay" class="md-raised md-primary">New Calculator
        </md-button>
      </div>
    </div>

    <!-- Only show calculator tabs if calculators are open -->
    <md-tabs v-if="this.openCalcs.length">
      <md-tab v-for="item in openCalcs" :md-label="item.name">
        <component :is="item.componentName"></component>
      </md-tab>
    </md-tabs>

    <!-- OBJECTS NOT IN DOC FLOW -->
    <calculator-selection-overlay
      v-if="this.$store.state.showCalculatorSelectionOverlay"></calculator-selection-overlay>
    <LeftSideMenu></LeftSideMenu>
  </div>
</template>



<script>

  import { CalculatorServiceSingleton } from './services/CalculatorService'

  import LeftSideMenu from './components/LeftSideMenu/LeftSideMenu'
  // import MainView from './components/OhmsLawCalculator/MainView'
  import CalculatorSelectionOverlay from './components/CalculatorSelectionOverlay/CalculatorSelectionOverlay'

  import OhmsLawCalculator from './components/OhmsLawCalculator/OhmsLawCalculator'

  console.log('LeftSideMenu =')
  console.log(LeftSideMenu)
  // console.log('MainView =')
  // console.log(MainView)

  export default {
    name: 'app',
    components: {
      LeftSideMenu,
      CalculatorSelectionOverlay
      // OhmsLawCalculator
    },
    computed: {
      openCalcs () {
        console.log('openCalcs() called.')
        return this.$store.state.openCalcs
      }
    },
    methods: {
      showCalculatorSelectionOverlay: function () {
        this.$store.commit('showCalculatorSelectionOverlay', {
          trueFalse: true
        })
      },
      showLeftSideNav () {
        this.$store.commit('showLeftSideBar', {
          trueFalse: true
        })
      }
    },
    mounted () {
      // this.$refs.leftSidenav.toggle()
      console.log('App.mounted() called')
      console.log('CalculatorService =')
      console.log(CalculatorServiceSingleton)

      // Setup calculators
      var calculatorService = CalculatorServiceSingleton.getInstance()

      console.log('OhmsLawCalculator =')
      console.log(OhmsLawCalculator)
      calculatorService.registerCalc(OhmsLawCalculator)
      calculatorService.setupStore(this.$store)
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    display: flex;

    height: 100%;
  }

  #left-bar {
    width: 50px;
  }

  #no-calc-screen {
    display: flex;

    width: 100%;
    height: 100%;

  }

  .centered {
    margin: auto;
  }
</style>
