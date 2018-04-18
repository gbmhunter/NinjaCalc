<template>
    <div class="app" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%;">
        <h1>Jet Engine PID Control</h1>

        <!-- PROCESS VARIABLE AND PID SET-POINT CHART -->
        <div style="width: 800px; height: 400px;">
            <canvas id="myChart" width="800" height="400"></canvas>
        </div>

        <!-- PID TERMS CHART -->
        <div style="width: 800px; height: 400px;">
            <canvas id="pidTermsChart" width="800" height="400"></canvas>
        </div>

        <div id="below-chart" style="display: flex;">

            <panel title="Simulation Settings">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="height: 20px;"/>
                    <div>
                        <span class="panel-subheading">Fuel Flow Rate Limits (mL/min):</span>
                        <br>
                        min <input v-model="fuelFlowRateMin_mlPmin" v-on:change="fuelFlowRateLimitsChanged" style="width: 100px;"/> max <input v-model="fuelFlowRateMax_mlPmin" v-on:change="fuelFlowRateLimitsChanged" style="width: 100px;"/>
                    </div>
                    <div style="height: 20px;"/>

                    <div>
                        <span class="panel-subheading">Run Mode:</span><br>
                        <select v-model="selectedRunMode" :options="runModes" style="width: 250px; height: 30px; background-color: transparent;">
                            <option v-for="option in runModes" v-bind:value="option"  v-bind:key="option">
                            {{ option }}
                            </option>
                        </select>
                    </div>
                    <div style="height: 20px;"/>            
                    <mn-button 
                        :variant="!simulationRunning ? 'success' : 'danger'"
                        :onClick="startStopSimulation"
                        style="width: 100px; height: 50px;">
                        <div style="font-size: 18px;">{{ !simulationRunning ? 'START' : 'STOP' }}</div>
                    </mn-button>     

                    <input type="checkbox" v-model="showPidTermsGraph" />
                </div>       
            </panel>

            <div style="width: 20px;" />

            <panel title="Controls">
                <div style="height: 20px;"/>
                <span class="panel-subheading">Fuel Flow Rate (mL/min)</span>
                <div>
                    <div style="height: 40px;"/>
                    <vue-slider 
                        ref="slider"
                        v-model="fuelFlow_mlPmin"
                        :min="Number(fuelFlowRateMin_mlPmin)" :max="Number(fuelFlowRateMax_mlPmin)" :interval="(Number(fuelFlowRateMax_mlPmin) - Number(fuelFlowRateMin_mlPmin)) / 100.0"
                        :disabled="selectedRunMode === simulationRunModesEnum.MANUAL_CONTROL_RPM || selectedRunMode === simulationRunModesEnum.AUTO_RPM_STEP_CHANGES"
                        style="width:300px;" />
                </div>   
                <div style="height: 20px;"/>
                <span class="panel-subheading">Velocity Set-Point (rpm)</span>
                <div>
                    <div style="height: 40px;"/>
                    <vue-slider
                        ref="slider"
                        v-model="rotVelSetPoint_rpm"
                        :min=0 :max=100000 :interval=1000
                        :disabled="selectedRunMode === simulationRunModesEnum.MANUAL_CONTROL_FUEL_RATE || selectedRunMode === simulationRunModesEnum.AUTO_RPM_STEP_CHANGES"
                        style="width:300px;"/>
                </div>
            </panel>

            <div style="width: 20px;" />

            <panel title="PID Settings">                    
                <span class="panel-subheading">PID Constants</span>
                <table class="sliders"> 
                <tbody>
                    <tr>
                        <td>Constant</td>
                        <td>Min.</td>
                        <td>Max.</td>
                        <td>Value</td>
                    </tr>
                    <tr>
                        <td>P</td>
                        <td><input v-model="pidConstants.p.min" class="pid-limit"/></td>
                        <td><input v-model="pidConstants.p.max" class="pid-limit"/></td>
                        <td style="width: 200px;">
                        <vue-slider ref="slider" v-model="pidConstants.p.value"
                        :min="Number(pidConstants.p.min)" :max="Number(pidConstants.p.max)"
                        :interval="(Number(pidConstants.p.max) - Number(pidConstants.p.min)) / 100.0"/></td>
                    </tr>
                    <tr>
                        <td>I</td>
                        <td><input v-model="pidConstants.i.min" class="pid-limit"/></td>
                        <td><input v-model="pidConstants.i.max" class="pid-limit"/></td>
                        <td style="width: 200px;">
                        <vue-slider ref="slider" v-model="pidConstants.i.value"
                        :min="Number(pidConstants.i.min)" :max="Number(pidConstants.i.max)"
                        :interval="(Number(pidConstants.i.max) - Number(pidConstants.i.min)) / 100.0"/>
                        </td>
                    </tr>
                    <tr>
                        <td>D</td>
                        <td><input v-model="pidConstants.d.min" class="pid-limit"/></td>
                        <td><input v-model="pidConstants.d.max" class="pid-limit"/></td>
                        <td style="width: 200px;">
                        <vue-slider ref="slider" v-model="pidConstants.d.value"
                        :min="Number(pidConstants.d.min)" :max="Number(pidConstants.d.max)"
                        :interval="(Number(pidConstants.d.max) - Number(pidConstants.d.min)) / 100.0"/>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div style="height: 20px;"/>

                <!-- INTEGRAL LIMITING SETTINGS -->
                <div id="integral-limiting-container">
                <span class="panel-subheading">Integral Limiting (Windup Control)</span>
                <div style="height: 10px;"/>
                <div>
                    Mode: <select v-model="selIntegralLimitingMode" @change="setIntegralLimitingMode" style="width: 300px; height: 30px; background-color: transparent;">
                        <option v-for="option in integralLimitModes" v-bind:value="option" v-bind:key="String(option)">
                        {{ String(option) }}
                    </option>
                    </select>
                </div>
                <div style="height: 10px;"/>
                    <div>
                        Min: <input v-model="integralLimitingConstantMin" @change="setIntegralLimitingMode" :disabled="areIntegralLimitingConstantsDisabled" style="width: 50px;"/>,
                        Max: <input v-model="integralLimitingConstantMax" @change="setIntegralLimitingMode" :disabled="areIntegralLimitingConstantsDisabled" style="width: 50px;"/>
                    </div>
                </div> <!-- <div id="integral-limiting-container"> -->              
            </panel> <!-- <panel title="PID Settings"> -->        
        </div> <!-- <div id="below-chart" style="display: flex;"> -->
    </div>
</template>

<script>
/* eslint-disable */
import Chart from "chart.js";
import vueSlider from "vue-slider-component";

import { JetEngineModel } from "./JetEngineModel.js";
import { Pid, IntegralLimitModes } from "./Pid";

const SimulationRunModes = {
  MANUAL_CONTROL_FUEL_RATE: "Manual Fuel Rate Control (no PID)",
  MANUAL_CONTROL_RPM: "Manual RPM Control (PID)",
  AUTO_RPM_STEP_CHANGES: "Automatic RPM Step Changes (PID)"
};

export default {
  name: "HelloWorld",
  components: {
    vueSlider
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      jetEngineModel: new JetEngineModel(10000.0, -1.0, 10000),

      fuelFlow_mlPmin: 0.0,
      fuelFlowRateMin_mlPmin: 0.0,
      fuelFlowRateMax_mlPmin: 1000.0,

      tickRate_s: 0.05,
      updateRate_s: 0.1,
      duration_s: 0.0,

      // Enumeration of run modes. Used to populate select input.
      //   runModes: [
      //     { text: "Control Fuel Rate (no PID)", value: "RUN_MODE_CONTROL_FUEL_RATE" },
      //     { text: "Manual RPM Control (PID)", value: "RUN_MODE_PID_MANUAL_RPM_CONTROL"},
      //     { text: "Auto RPM Step Changes (PID)", value: "RUN_MODE_PID_AUTO_RPM_STEP_CHANGES"}
      //   ],
      simulationRunModesEnum: SimulationRunModes,
      runModes: [],
      selectedRunMode: SimulationRunModes.AUTO_RPM_STEP_CHANGES,

      chartConfig: {
        type: "line",
        data: {
          datasets: [
            {
              label: "Rotational Velocity",
              backgroundColor: "rgba(0, 0, 255, 0.5)",
              borderColor: "rgba(0, 0, 255, 0.5)",
              data: [],
              fill: false
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                type: "linear",
                scaleLabel: {
                  display: true,
                  labelString: "Time (s)"
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Rotational Velocity (rpm)"
                }
              }
            ]
          }
        }
      },
      chart: null,

      pidTermsChartConfig: {
        type: "line",
        data: {
          datasets: [
            {
              label: "P",
              backgroundColor: "rgba(84, 255, 60, 0.5)",
              borderColor: "rgba(84, 255, 60, 0.5)",
              data: [],
              fill: false
            },
            {
              label: "I",
              backgroundColor: "rgba(60, 255, 201, 0.5)",
              borderColor: "rgba(60, 255, 201, 0.5)",
              data: [],
              fill: false
            },
            {
              label: "D",
              backgroundColor: "rgba(60, 205, 255, 0.5)",
              borderColor: "rgba(60, 205, 255, 0.5)",
              data: [],
              fill: false
            },
            {
              label: "Output",
              backgroundColor: "rgba(255, 60, 92, 0.5)",
              borderColor: "rgba(255, 60, 92, 0.5)",
              data: [],
              fill: false
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                type: "linear",
                scaleLabel: {
                  display: true,
                  labelString: "Time (s)"
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "PID Effort"
                }
              }
            ]
          }
        }
      },
      pidTermsChart: null,
      // Make sure the following indicies stay in sync with the
      // datasets defined in the pidTermsChartConfig variable above!
      pTermDataIndex: 0,
      iTermDataIndex: 1,
      dTermDataIndex: 2,
      outputDataIndex: 3,

      simulationRunning: false,
      modelTickTimer: null,
      modelUpdateTimer: null,

      rotVelSetPoint_rpm: 0.0,
      maxNumDataPoints: 100,
      pid: new Pid(0.0006, 0.0006, 0.0), // PID constants get overriden by values set from sliders
      pidConstants: {
        p: {
          min: 0.0,
          max: 0.001,
          value: 0.0006
        },
        i: {
          min: 0.0,
          max: 0.001,
          value: 0.0006
        },
        d: {
          min: 0.0,
          max: 0.001,
          value: 0.0
        }
      },
      integralLimitModes: [],
      selIntegralLimitingMode: null,
      integralLimitingConstantMin: -1.0,
      integralLimitingConstantMax: 1.0,

      showPidTermsGraph: false
    };
  },
  computed: {
    areIntegralLimitingConstantsDisabled() {
      console.log(
        "areIntegralLimitingConstantsDisabled() called. this.selIntegralLimitingMode = " +
          this.selIntegralLimitingMode +
          ", this.integralLimitModes = "
      );
      console.log(this.integralLimitModes);
      if (
        this.selIntegralLimitingMode === IntegralLimitModes.CONSTANT_LIMITED
      ) {
        return false;
      } else {
        return true;
      }
    },
    pidEnabled() {
      console.log("Computing pidEnabled...");
      if (
        this.selectedRunMode ===
          this.simulationRunModesEnum.MANUAL_CONTROL_RPM ||
        this.selectedRunMode ===
          this.simulationRunModesEnum.AUTO_RPM_STEP_CHANGES
      ) {
        console.log("Returning true.");
        return true;
      } else if (
        this.selectedRunMode ===
        this.simulationRunModesEnum.MANUAL_CONTROL_FUEL_RATE
      ) {
        return false;
      } else {
        throw new Error("Unexpected simulation run mode ");
      }
    }
  },
  methods: {
    addSetPointLine() {
      console.log("Adding set point line to chart.");
      // Add set point line to chart
      this.chartConfig.data.datasets.push({
        label: "Set Point",
        backgroundColor: "rgba(255,0,0,.5)",
        borderColor: "rgba(255,0,0,.5)",
        data: [],
        fill: false
      });
      this.chart.update();
    },
    fuelFlowRateLimitsChanged() {
      console.log("Fuel flow rate limits changed.");
      this.pid.setOutputLimits(
        Number(this.fuelFlowRateMin_mlPmin) / 1000.0,
        Number(this.fuelFlowRateMax_mlPmin) / 1000.0
      );
    },
    performAutoSetPointChange() {
      if (this.rotVelSetPoint_rpm === 0.0) {
        this.rotVelSetPoint_rpm = 60000.0;
      } else {
        this.rotVelSetPoint_rpm = 0.0;
      }
    },
    setIntegralLimitingMode() {
      console.log("selIntegralLimitingMode changed.");
      if (this.selIntegralLimitingMode === IntegralLimitModes.NONE) {
        this.pid.setIntegralLimit({
          mode: IntegralLimitModes.NONE
        });
      } else if (
        this.selIntegralLimitingMode === IntegralLimitModes.CONSTANT_LIMITED
      ) {
        this.pid.setIntegralLimit({
          mode: IntegralLimitModes.CONSTANT_LIMITED,
          min: Number(this.integralLimitingConstantMin),
          max: Number(this.integralLimitingConstantMax)
        });
      } else if (
        this.selIntegralLimitingMode === IntegralLimitModes.OUTPUT_LIMITED
      ) {
        this.pid.setIntegralLimit({
          mode: IntegralLimitModes.OUTPUT_LIMITED
        });
      } else {
        throw new Error("Integral limiting mode unrecognized.");
      }
    },
    startStopSimulation() {
      if (!this.simulationRunning) {
        // START
        console.log("Starting simulation...");

        this.modelTickTimer = window.setInterval(() => {
          this.tick();
        }, this.tickRate_s * 1000.0);

        this.modelUpdateTimer = window.setInterval(() => {
          this.update();
        }, this.updateRate_s * 1000.0);

        if (this.selectedRunMode === SimulationRunModes.AUTO_RPM_STEP_CHANGES) {
          this.autoStepChangeTimer = window.setInterval(() => {
            this.performAutoSetPointChange();
          }, 4000.0);
        }

        this.simulationRunning = true;
      } else {
        // STOP
        console.log("Stopping simulation...");
        clearInterval(this.modelTickTimer);
        clearInterval(this.modelUpdateTimer);
        clearInterval(this.autoStepChangeTimer);
        this.simulationRunning = false;
      }
    },
    // This updates the simulation. Should be called more frequently than update().
    tick() {
      if (this.pidEnabled) {
        let rotVel_radPs = this.jetEngineModel.getRotVel_radPs();

        console.log("this.rotVelSetPoint_rpm = " + this.rotVelSetPoint_rpm);
        let rotVelSetPoint_radPs = this.rotVelSetPoint_rpm / 60.0 * 2 * Math.PI;

        this.pid.setSetPoint(rotVelSetPoint_radPs);
        this.fuelFlow_mlPmin =
          this.pid.run(rotVel_radPs, this.tickRate_s) * 1000.0;
      }

      this.jetEngineModel.update(
        this.fuelFlow_mlPmin / 1000.0,
        this.tickRate_s
      );

      this.duration_s += this.tickRate_s;
    },
    // This updates the UI. Called by window.setInterval()
    update() {
        let rotVel_radPs = this.jetEngineModel.getRotVel_radPs();
        let rotVel_rpm = rotVel_radPs / (2 * Math.PI) * 60;

        this.chartConfig.data.datasets[0].data.push({
            x: this.duration_s,
            y: rotVel_rpm
        });

        // Limit number of data points
        if (
            this.chartConfig.data.datasets[0].data.length > this.maxNumDataPoints
        ) {
            this.chartConfig.data.datasets[0].data.shift();
        }

        // If in run mode where PID is used, update set point also
        if (this.pidEnabled) {
            this.chartConfig.data.datasets[1].data.push({
                x: this.duration_s,
                y: this.rotVelSetPoint_rpm
            });
        }

        // Limit number of data points
        if (this.chartConfig.data.datasets[1].data.length > this.maxNumDataPoints)
            this.chartConfig.data.datasets[1].data.shift()        

        this.chart.update()

        //===== PID TERMS CHART =====//

        const pidTerms = this.pid.getLastTerms()

        // P
        this.pidTermsChartConfig.data.datasets[this.pTermDataIndex].data.push({
            x: this.duration_s,
            y: pidTerms.p
        });

        // Limit number of data points
        if (this.pidTermsChartConfig.data.datasets[this.pTermDataIndex].data.length > this.maxNumDataPoints)
            this.pidTermsChartConfig.data.datasets[this.pTermDataIndex].data.shift()  

        // I
        this.pidTermsChartConfig.data.datasets[this.iTermDataIndex].data.push({
            x: this.duration_s,
            y: pidTerms.i
        });

        // Limit number of data points
        if (this.pidTermsChartConfig.data.datasets[this.iTermDataIndex].data.length > this.maxNumDataPoints)
            this.pidTermsChartConfig.data.datasets[this.iTermDataIndex].data.shift()  

        // D
        this.pidTermsChartConfig.data.datasets[this.dTermDataIndex].data.push({
            x: this.duration_s,
            y: pidTerms.d
        });

        // Limit number of data points
        if (this.pidTermsChartConfig.data.datasets[this.dTermDataIndex].data.length > this.maxNumDataPoints)
            this.pidTermsChartConfig.data.datasets[this.dTermDataIndex].data.shift()  

        // OUTPUT
        this.pidTermsChartConfig.data.datasets[this.outputDataIndex].data.push({
            x: this.duration_s,
            y: pidTerms.output
        });

        // Limit number of data points
        if (this.pidTermsChartConfig.data.datasets[this.outputDataIndex].data.length > this.maxNumDataPoints)
            this.pidTermsChartConfig.data.datasets[this.outputDataIndex].data.shift()    

        this.pidTermsChart.update()
    },

    updatePidConstants() {
      this.pid.setConstants(
        this.pidConstants.p.value,
        this.pidConstants.i.value,
        this.pidConstants.d.value
      );
    }
  },
  watch: {
    pidEnabled(val) {
      console.log("pidEnabled changed.");
      if (val) this.addSetPointLine();
    },
    pidConstants: {
      handler(val) {
        console.log("pidConstants changed.");
        this.updatePidConstants();
      },
      deep: true
    }
  },
  mounted() {
    // Draw plant output and set-point chart
    const plantOutputChartContext = document.getElementById("myChart");
    this.chart = new Chart(plantOutputChartContext, this.chartConfig);

    // Draw PID terms chart
    const pidTermsChartContext = document.getElementById("pidTermsChart");
    this.pidTermsChart = new Chart(
      pidTermsChartContext,
      this.pidTermsChartConfig
    );

    // Set the run mode to auto by default. This should trigger watch
    this.selectedRunMode = SimulationRunModes.AUTO_RPM_STEP_CHANGES;

    this.updatePidConstants();
    this.fuelFlowRateLimitsChanged();

    let self = this;

    // Populate simulation run modes select box
    Object.keys(SimulationRunModes).forEach(function(key) {
      let obj = SimulationRunModes[key];
      self.runModes.push(obj);
    });
    console.log("this.runModes = ");
    console.log(this.runModes);

    // Populate integral limit modes select box
    Object.keys(IntegralLimitModes).forEach(function(key) {
      let obj = IntegralLimitModes[key];
      self.integralLimitModes.push(obj);
    });

    // Set default integral limiting mode
    this.selIntegralLimitingMode = IntegralLimitModes.OUTPUT_LIMITED;
    this.setIntegralLimitingMode()

    if (this.pidEnabled) this.addSetPointLine();
  }
};
/* eslint-enable */
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.diagram-container {
  position: relative;
}

.diagram-container > * {
  position: absolute;
}

h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

/* Table with sliders. Make row height large enough that slider value fits into it */
.sliders tr {
  height: 50px;
}

.sliders input {
  width: 50px;
}

fieldset.panel {
  display: block;
  margin-inline-start: 2px;
  margin-inline-end: 2px;
  border: groove 2px ThreeDFace;
  padding-block-start: 0.35em;
  padding-inline-end: 0.625em;
  padding-block-end: 0.75em;
  padding-inline-start: 0.625em;
  min-width: min-content;
}

legend.panel {
  padding-inline-start: 2px;
  padding-inline-end: 2px;
}
</style>
