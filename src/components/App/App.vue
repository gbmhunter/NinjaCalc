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
    <div id="no-calc-screen" v-if="!this.$store.state.core.openCalcs.length">
      <div class="centered">
        <div class="md-display-1">No calculators are open! Do you wish to create one?</div>
        <div style="height: 20px;"></div>
        <ui-button @click.native="showCalculatorSelectionOverlay" color="primary">New Calculator
        </ui-button>
      </div>
    </div>

    <!-- The "editable" property allows you to close tabs. Note that by default this also adds a "+" button on the far-
    right of the tab header, but we disable this in CSS -->
    <el-tabs type="card" v-if="this.$store.state.core.openCalcs.length" v-model="activeTabId" editable @edit="handleTabsEdit">
      <!-- The name property is the unique ID which identifies the tab -->
      <el-tab-pane v-for="item in this.$store.state.core.openCalcs" :label="item.name" :name="item.uniqueId.toString()">
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

  /* eslint-disable */

  import Vue from 'vue'
  import LeftSideMenu from '../LeftSideMenu/LeftSideMenu'
  import CalculatorSelectionOverlay from '../CalculatorSelectionOverlay/CalculatorSelectionOverlay'

  import OhmsLawCalculator from '../Calculators/Electronics/Basic/OhmsLaw/Calc'
  import ResistorDividerCalculator from '../Calculators/Electronics/Basic/ResistorDivider/Calc'
  import StandardResistanceCalculator from '../Calculators/Electronics/Basic/StandardResistance/Calc'
  import LowPassRCCalculator from '../Calculators/Electronics/Filters/LowPassRC/Calc'
  import TrackCurrentIpc2152Calculator from '../Calculators/Electronics/Pcb/TrackCurrentIpc2152/Calc'
  import { trackCurrentIpc2221ACalculator } from '../Calculators/Electronics/Pcb/TrackCurrentIpc2221A/Calc'
  import { viaCurrentIpc2221ACalculator } from '../Calculators/Electronics/Pcb/ViaCurrentIpc2221A/Calc'
  import { dewPointMagnusCalculator } from '../Calculators/Electronics/Sensors/DewPointMagnus/Calc'
  import { ntcThermistorTemperature } from '../Calculators/Electronics/Sensors/NtcThermistor/Calc'
  import BuckConverter from '../Calculators/Electronics/Smps/BuckConverter/Calc'
  import { crcCalculator } from '../Calculators/Software/Crc/Calc'

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
        return this.$store.state.activeTabId.toString()
      },
      route () {
        return this.$store.state.route
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
      },
      handleTabsEdit (targetName, action) {
        console.log('App.handleTabEdit() called.')
        switch (action) {
          case 'add':
            // This should never get called, since we hid the "add" button!
            throw new Error('action.add() is not supported by App.handleTabsEdit().')
          case 'remove':
            this.$store.commit('closeCalculator', {
              // Need to convert string to integer
              uniqueId: parseInt(targetName)
            })
            break
          default:
            throw new Error('Provided action to handleTabsEdit() was not supported.')
        }
      },
      handleRouteChange () {
        // Make sure path is valid calculator
        const calcName = this.route.path.substring(1, this.route.path.length)
        var foundCalc = this.$store.state.core.availableCalcs.find((element) => {
          return element.mainView.name === calcName
        })
        if (!foundCalc) {
          // If no calculator was found, fail silently
          return
        }

        // Hide the overlay
        this.$store.commit('showCalculatorSelectionOverlay', {
          trueFalse: false
        })

        // Calc was found, so open calculator
        this.$store.dispatch('openCalc', {
          // Remove the first "/"
          componentName: calcName
        })
      }
    },
    watch: {
      route () {
        console.log('route() watcher called.')
        console.log(this.route)
        this.handleRouteChange()
      }
    },
    mounted () {

      console.log('NinjaCalc app mounted.')

      // ============================================ //
      // ========== ELECTRONICS -> BASIC ============ //
      // ============================================ //

      this.$store.dispatch('registerCalc', OhmsLawCalculator)
      this.$store.dispatch('registerCalc', ResistorDividerCalculator)
      this.$store.dispatch('registerCalc', StandardResistanceCalculator)

      // ============================================ //
      // ========= ELECTRONICS -> FILTERS =========== //
      // ============================================ //

      this.$store.dispatch('registerCalc', LowPassRCCalculator)

      // ============================================ //
      // =========== ELECTRONICS -> SMPS ============ //
      // ============================================ //

      this.$store.dispatch('registerCalc', BuckConverter)

      // ============================================ //
      // ========= ELECTRONICS -> SENSORS =========== //
      // ============================================ //

      this.$store.dispatch('registerCalc', dewPointMagnusCalculator)
      this.$store.dispatch('registerCalc', ntcThermistorTemperature)

      // ============================================ //
      // =========== ELECTRONICS -> PCB ============= //
      // ============================================ //

      this.$store.dispatch('registerCalc', trackCurrentIpc2221ACalculator)
      this.$store.dispatch('registerCalc', TrackCurrentIpc2152Calculator)
      this.$store.dispatch('registerCalc', viaCurrentIpc2221ACalculator)

      // ============================================ //
      // ================== SOFTWARE ================ //
      // ============================================ //

      this.$store.dispatch('registerCalc', crcCalculator)

      // Show the overlay by default.
      // THIS MUST BE DONE BEFORE handlerRouteChange() IS CALLED
      this.$store.commit('showCalculatorSelectionOverlay', {
        trueFalse: true
      })

      // Call this for the first time, since it may be already set,
      // and we only start listening for changes from this point onwards.
      this.handleRouteChange()
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

  /* This hides the "+" button which is automatically added
  to the far-right of the tab header when the "editable"
  property is supplied to the tab component */
  span.el-tabs__new-tab {
    display: none;
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
