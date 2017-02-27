<template xmlns:v-on="http://www.w3.org/1999/xhtml">

  <div id="app">

    <div id="left-bar">
      <div id="menu-button-wrapper">
        <md-button id="menu-button" class="md-icon-button" @click.native="showLeftSideNav">
          <md-icon>menu</md-icon>
        </md-button>
      </div>
    </div>

    <!--Only show this if no calculators are open-->
    <div id="no-calc-screen" v-if="!this.$store.state.openCalcs.length">
      <div class="centered">
        <div class="md-display-1">No calculators are open! Do you wish to create one?</div>
        <div style="height: 20px;"></div>
        <md-button @click.native="showCalculatorSelectionOverlay" class="md-raised md-primary">New Calculator
        </md-button>
      </div>
    </div>

    <!-- Only show calculator tabs if calculators are open -->
    <!--<md-tabs v-if="this.openCalcs.length">-->
    <!--<md-tab v-for="item in openCalcs" :md-label="item.name" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">-->
    <!--<component :is="item.componentName"></component>-->
    <!--</md-tab>-->
    <!--</md-tabs>-->

    <ui-tabs type="text" :grow="true" v-if="this.openCalcs.length">
      <ui-tab v-for="item in openCalcs" :title="item.name">
        <component :is="item.componentName"></component>
      </ui-tab>
    </ui-tabs>


    <!-- OBJECTS NOT IN DOC FLOW -->
    <calculator-selection-overlay
      v-if="this.$store.state.showCalculatorSelectionOverlay"></calculator-selection-overlay>
    <LeftSideMenu></LeftSideMenu>
  </div>
</template>


<script>

  //  import { CalculatorServiceSingleton } from './services/CalculatorService'

  import Vue from 'vue'
  import LeftSideMenu from './components/LeftSideMenu/LeftSideMenu'
  // import MainView from './components/OhmsLawCalculator/MainView'
  import CalculatorSelectionOverlay from './components/CalculatorSelectionOverlay/CalculatorSelectionOverlay'

  import OhmsLawCalculator from './components/Calculators/OhmsLawCalculator/Calc'
  import ResistorDividerCalculator from './components/Calculators/ResistorDivider/Calc'

  import Tabs from 'bootstrap-vue/components/tabs.vue'
  import Tab from 'bootstrap-vue/components/tab.vue'

  console.log('LeftSideMenu =')
  console.log(LeftSideMenu)
  // console.log('MainView =')
  // console.log(MainView)

  export default {
    name: 'app',
    components: {
      LeftSideMenu,
      CalculatorSelectionOverlay,
      Tabs,
      Tab
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
//      console.log('App.mounted() called')
//      console.log('CalculatorService =')
//      console.log(CalculatorServiceSingleton)
//
//      // Setup calculators
//      var calculatorService = CalculatorServiceSingleton.getInstance()
//
//      console.log('OhmsLawCalculator =')
//      console.log(OhmsLawCalculator)
//      calculatorService.registerCalc(OhmsLawCalculator)
//      calculatorService.setupStore(this.$store)

      Vue.component(OhmsLawCalculator.mainView.name, OhmsLawCalculator.mainView)
      this.$store.commit('registerCalc', OhmsLawCalculator)

      Vue.component(ResistorDividerCalculator.mainView.name, ResistorDividerCalculator.mainView)
      this.$store.commit('registerCalc', ResistorDividerCalculator)
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

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 100%;
  }

  .ui-tabs {
    display: flex;
    flex-direction: column;
  }

  .ui-tabs__body {
    border-width: 0px !important;
    padding: 0px !important;
    height: 100%;
  }

  .ui-tab {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* This selector gets weird of weird raised offset in the text for the first
  header tab title */
  ul:not(.md-list) > li + li {
    margin-top: 0px !important;
  }

  #menu-button-wrapper {
    /* This height exactly matches the height of the tab header bar */
    height: 48px;

    /* This colour exactly matches the colour of the tab header bar */
    background-color: #eeeeee;
  }

  .tooltip {
    display: none;
    opacity: 0;
    transition: opacity 1s;
    pointer-events: none;
    padding: 2px;
    z-index: 10000;
  }

  .tooltip .tooltip-content {
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 10px;
    padding: 5px;
  }

  .tooltip.tooltip-open-transitionend {
    display: block;
  }

  .tooltip.tooltip-after-open {
    opacity: 1;
  }

</style>
