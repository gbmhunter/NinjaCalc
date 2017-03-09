<template xmlns:v-on="http://www.w3.org/1999/xhtml">

  <div id="app">

    <!-- This is a long, thin menu down the left-hand side of the screen -->
    <div id="left-bar" style="width: 50px; background-color: #eeeeee;">
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
    <!--<ui-tabs ref="tabs" type="text" :grow="true" v-if="this.$store.state.openCalcs.length">-->
      <!--<ui-tab v-for="item in this.$store.state.openCalcs" :title="item.name" :id="item.uniqueId.toString()">-->
        <!--<component :is="item.componentName"></component>-->
      <!--</ui-tab>-->
    <!--</ui-tabs>-->

    <el-tabs type="card" v-if="this.$store.state.openCalcs.length" v-model="activeTabId">
      <!-- The name property is the unique ID which identifies the tab -->
      <el-tab-pane v-for="item in this.$store.state.openCalcs" :label="item.name" :name="item.uniqueId.toString()">
        <component :is="item.componentName"></component>
      </el-tab-pane>
    </el-tabs>

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
  import { trackCurrentIpc2221ACalculator } from './components/Calculators/Electronics/Pcb/TrackCurrentIpc2221A/Calc'
  import TrackCurrentIpc2152Calculator from './components/Calculators/Electronics/Pcb/TrackCurrentIpc2152/Calc'
  import { dewPointMagnusCalculator } from './components/Calculators/Electronics/Sensors/DewPointMagnus/Calc'
  import { ntcThermistorTemperature } from './components/Calculators/Electronics/Sensors/NtcThermistor/Calc'
  import { viaCurrentIpc2221ACalculator } from './components/Calculators/Electronics/Pcb/ViaCurrentIpc2221A/Calc'
  import { crcCalculator } from './components/Calculators/Software/Crc/Calc'

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

        return this.$store.state.activeTabId.toString()
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
    watch: {},
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
      // ========= ELECTRONICS -> SENSORS =========== //
      // ============================================ //

      Vue.component(dewPointMagnusCalculator.mainView.name, dewPointMagnusCalculator.mainView)
      this.$store.commit('registerCalc', dewPointMagnusCalculator)

      Vue.component(ntcThermistorTemperature.mainView.name, ntcThermistorTemperature.mainView)
      this.$store.commit('registerCalc', ntcThermistorTemperature)

      // ============================================ //
      // =========== ELECTRONICS -> PCB ============= //
      // ============================================ //

      Vue.component(trackCurrentIpc2221ACalculator.mainView.name, trackCurrentIpc2221ACalculator.mainView)
      this.$store.commit('registerCalc', trackCurrentIpc2221ACalculator)

      Vue.component(TrackCurrentIpc2152Calculator.mainView.name, TrackCurrentIpc2152Calculator.mainView)
      this.$store.commit('registerCalc', TrackCurrentIpc2152Calculator)

      Vue.component(viaCurrentIpc2221ACalculator.mainView.name, viaCurrentIpc2221ACalculator.mainView)
      this.$store.commit('registerCalc', viaCurrentIpc2221ACalculator)

      // ============================================ //
      // ================== SOFTWARE ================ //
      // ============================================ //

      Vue.component(crcCalculator.mainView.name, crcCalculator.mainView)
      this.$store.commit('registerCalc', crcCalculator)
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

  /* ===== TAB STYLING ===== */
  div.el-tabs {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }

  div.el-tabs__content {
    height: 100%;
  }

  div.el-tab-pane {
    width: 100%;
    height: 100%;

    display: flex;

    /* This gives scroll-bars if calculator content is too large for screen in vertical direction */
    overflow-y: auto;
  }

  /* This targets the Material Design tooltips, which by default have
  a fixed height, which means that multiple lines of text do not work.
  This fixes this limitation.
   */
  span.md-tooltip {
    max-width: 300px !important;
    height: auto !important;
    font-size: 12px;

    /* Justify the left/right sides of the text within tooltip */
    text-align: justify;

    /* This makes the tooltip text within the span element wrap correctly. */
    white-space: normal;
  }

  div.calculator-container {
    /* margin: auto prevents the top and bottom of overflowing flex content from NOT being accessable within a flex */
    margin: auto;
  }

  /* Targets the "expandable" calculator info sections at the top of
  each calculator */
  .calc-info {
    padding-top: 20px;
    padding-bottom: 20px;

    /* Justify the left/right sides of the text within tooltip */
    text-align: justify;
  }

  div.modal-mask {
    display: flex !important;
  }

  div.modal-wrapper {
    display: flex !important;
    flex-direction: column !important;
    align-content: center !important;
    justify-content: center !important;
  }

</style>
