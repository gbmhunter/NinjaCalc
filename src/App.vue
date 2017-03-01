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
        <ui-button @click.native="showCalculatorSelectionOverlay" color="primary">New Calculator
        </ui-button>
      </div>
    </div>

    <!-- Only show calculator tabs if calculators are open -->
    <ui-tabs ref="tabs" type="text" :grow="true" v-if="this.$store.state.openCalcs.length">
      <ui-tab v-for="item in this.$store.state.openCalcs" :title="item.name" :id="item.uniqueId.toString()">
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

  import OhmsLawCalculator from './components/Calculators/Electronics/Basic/OhmsLaw/Calc'
  import ResistorDividerCalculator from './components/Calculators/Electronics/Basic/ResistorDivider/Calc'
  import StandardResistanceCalculator from './components/Calculators/Electronics/Basic/StandardResistance/Calc'
  import LowPassRCCalculator from './components/Calculators/Electronics/Filters/LowPassRC/Calc'
  import TrackCurrentIpc2152Calculator from './components/Calculators/Electronics/Pcb/TrackCurrentIpc2152/Calc'

  console.log('LeftSideMenu =')
  console.log(LeftSideMenu)
  // console.log('MainView =')
  // console.log(MainView)

  export default {
    name: 'app',
    components: {
      LeftSideMenu,
      CalculatorSelectionOverlay
    },
    data: function () {
      return {}
    },
    computed: {
      activeTabId () {
        console.log('App.activeTabId() called.')

        return this.$store.state.activeTabId
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
    watch: {
      activeTabId: function () {
        var self = this
        // We need to wait until after render to set the active tab, as the tab has not been
        // inserted into the DOM yet
        Vue.nextTick(function () {
          var tabId = self.$store.state.openCalcs[self.$store.state.openCalcs.length - 1].uniqueId
          console.log('Setting active tab to id = "' + tabId)
          self.$refs.tabs.setActiveTab(tabId.toString())
        })
      }
    },
    mounted () {
      // ============================================ //
      // ========== ELECTRONICS -> BASIC ============ //
      // ============================================ //
      Vue.component(OhmsLawCalculator.mainView.name, OhmsLawCalculator.mainView)
      this.$store.commit('registerCalc', OhmsLawCalculator)

      Vue.component(ResistorDividerCalculator.mainView.name, ResistorDividerCalculator.mainView)
      this.$store.commit('registerCalc', ResistorDividerCalculator)

      Vue.component(StandardResistanceCalculator.mainView.name, StandardResistanceCalculator.mainView)
      this.$store.commit('registerCalc', StandardResistanceCalculator)

      // ============================================ //
      // ========= ELECTRONICS -> FILTERS =========== //
      // ============================================ //

      Vue.component(LowPassRCCalculator.mainView.name, LowPassRCCalculator.mainView)
      this.$store.commit('registerCalc', LowPassRCCalculator)

      // ============================================ //
      // =========== ELECTRONICS -> PCB ============= //
      // ============================================ //

      Vue.component(TrackCurrentIpc2152Calculator.mainView.name, TrackCurrentIpc2152Calculator.mainView)
      this.$store.commit('registerCalc', TrackCurrentIpc2152Calculator)
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
    /*align-items: center;
    justify-content: center;*/
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

  /*.tooltip {
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
  }*/

  /* This targets the Material Design tooltips, which by default have
  a fixed height, which means that multiple lines of text do not work.
  This fixes this limitation.
   */
  span.md-tooltip {
    height: auto !important;
    font-size: 12px;
  }

  div.calculator-container {
    /* margin: auto prevents the top and bottom of overflowing flex content from NOT being accessable within a flex */
    margin: auto;
  }

</style>
