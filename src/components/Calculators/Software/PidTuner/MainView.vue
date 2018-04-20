<template>
    <div class="app" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; overflow: auto; min-height: min-content;">
        <h1>PID Tuner</h1>

        <!-- The style "min-height: min-content" is required so that this flex box's height expands to the maximum width
        of any of it's children -->
        <div id="controls" style="display: flex; min-height: min-content;">
            <!-- =================== -->
            <!-- SIMULATION SETTINGS -->
            <!-- =================== -->
            <panel title="Simulation Settings">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="height: 20px;"/>

                    <div style="display: flex; align-items: center;">
                        Process:
                        <select v-model="selProcessName" :disabled="simulationRunning" style="width: 150px; height: 30px; background-color: transparent;">
                            <option v-for="option in processes" v-bind:value="option.name"  v-bind:key="option.name">
                                {{ option.name }}
                            </option>
                        </select>
                        <div style="width: 10px;"/> <!-- H SPACER -->
                        <mn-button
                            variant="success"
                            :onClick="processLoad"
                            style="width: 60px; height: 30px;">
                            Load
                        </mn-button>
                    </div>
                    <div style="height: 10px;"/> <!-- V SPACER -->
                    <div>
                        <mn-button
                            variant="success"
                            :onClick="processEdit"
                            style="width: 140px; height: 30px;">
                            Edit Process
                        </mn-button>
                    </div>

                    <div style="height: 20px;"/>

                    <div>
                        <table>
                            <tr>
                                <td>Simulation Tick Period (ms):</td>
                                <td><input v-model.number="simulationTickPeriod_ms" :disabled="simulationRunning" style="width: 80px;"/></td>
                            </tr>
                            <tr>
                                <td>Plot Period (ms):</td>
                                <td><input v-model.number="plotPeriod_ms" :disabled="simulationRunning" style="width: 80px;"/></td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="height: 20px;"/>

                    <div>
                        <span class="panel-subheading">Run Mode:</span><br>
                        <select v-model="selectedRunMode" :options="runModes" :disabled="simulationRunning" style="width: 250px; height: 30px; background-color: transparent;">
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
                </div>       
            </panel>

            <div style="width: 20px;" />

            <panel title="Controls">
                <div style="display: flex; flex-direction: column;">
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
                        <td><input v-model="pidConfig.constants.p.min" class="pid-limit"/></td>
                        <td><input v-model="pidConfig.constants.p.max" class="pid-limit"/></td>
                        <td style="width: 200px;">
                        <vue-slider ref="slider" v-model="pidConfig.constants.p.value"
                        :min="Number(pidConfig.constants.p.min)" :max="Number(pidConfig.constants.p.max)"
                        :interval="(Number(pidConfig.constants.p.max) - Number(pidConfig.constants.p.min)) / 100.0"/></td>
                    </tr>
                    <tr>
                        <td>I</td>
                        <td><input v-model="pidConfig.constants.i.min" class="pid-limit"/></td>
                        <td><input v-model="pidConfig.constants.i.max" class="pid-limit"/></td>
                        <td style="width: 200px;">
                        <vue-slider ref="slider" v-model="pidConfig.constants.i.value"
                        :min="Number(pidConfig.constants.i.min)" :max="Number(pidConfig.constants.i.max)"
                        :interval="(Number(pidConfig.constants.i.max) - Number(pidConfig.constants.i.min)) / 100.0"/>
                        </td>
                    </tr>
                    <tr>
                        <td>D</td>
                        <td><input v-model="pidConfig.constants.d.min" class="pid-limit"/></td>
                        <td><input v-model="pidConfig.constants.d.max" class="pid-limit"/></td>
                        <td style="width: 200px;">
                        <vue-slider ref="slider" v-model="pidConfig.constants.d.value"
                        :min="Number(pidConfig.constants.d.min)" :max="Number(pidConfig.constants.d.max)"
                        :interval="(Number(pidConfig.constants.d.max) - Number(pidConfig.constants.d.min)) / 100.0"/>
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
                    Mode:
                    <select v-model="pidConfig.integralLimitingMode" @change="setIntegralLimitingMode" style="width: 300px; height: 30px; background-color: transparent;">
                        <option v-for="option in integralLimitModes" v-bind:value="option" v-bind:key="String(option)">
                        {{ String(option) }}
                        </option>
                    </select>
                </div>
                <div style="height: 10px;"/>
                    <div>
                        min <input v-model="integralLimitingConstantMin" @change="setIntegralLimitingMode" :disabled="areIntegralLimitingConstantsDisabled" style="width: 50px;"/>
                        max <input v-model="integralLimitingConstantMax" @change="setIntegralLimitingMode" :disabled="areIntegralLimitingConstantsDisabled" style="width: 50px;"/>
                    </div>
                </div> <!-- <div id="integral-limiting-container"> -->    
                <div style="height: 20px;"/>
                <div>
                    <span class="panel-subheading">Control Variable Limits:</span>
                    <br>
                    min <input v-model="fuelFlowRateMin_mlPmin" v-on:change="fuelFlowRateLimitsChanged" :disabled="simulationRunning" style="width: 80px;"/> 
                    max <input v-model="fuelFlowRateMax_mlPmin" v-on:change="fuelFlowRateLimitsChanged" :disabled="simulationRunning" style="width: 80px;"/>
                </div>
            </panel> <!-- <panel title="PID Settings"> -->        
        </div> <!-- <div id="controls" style="display: flex;"> -->

        <!-- PROCESS VARIABLE AND PID SET-POINT CHART -->
        <div style="width: 800px; height: 400px;">
            <canvas id="myChart" width="800" height="400"></canvas>
        </div>

        <!-- PID TERMS CHART -->
        <div style="width: 800px; height: 400px;">
            <canvas id="pidTermsChart" width="800" height="400"></canvas>
        </div>

        

        <div style="height: 20px;"/>

        <!-- ============================================= -->
        <!-- =========== PROCESS EDIT MODEAL ============= -->
        <!-- ========== (not in document flow) =========== -->
        <mn-modal v-if="showProcessEditModal" @close="showProcessEditModal = false">
            <div slot="body" style="display: flex; flex-direction: column; width: 100%; height: 100%;">
                <textarea v-model="plantCodeString" style="flex-grow: 2;"/>
                <div style="height: 10px;"/>
                <mn-button variant="success" :onClick="processHideModalAndLoad" style="width: 120px; height: 30px; align-self: flex-end;">Close</mn-button>
            </div>
        </mn-modal>
    </div>
</template>

<script>
/* eslint-disable */
import Chart from "chart.js";
import vueSlider from "vue-slider-component";

import JetEngineModelTxt from './Processes/JetEngineModel.txt'
import SpringMassDamperProcessTxt from './Processes/SpringMassDamperProcess.txt'

import { Pid, IntegralLimitModes } from "./Pid";

const SimulationRunModes = {
    MANUAL_CONTROL_FUEL_RATE: "Manual Fuel Rate Control (no PID)",
    MANUAL_CONTROL_RPM: "Manual RPM Control (PID)",
    AUTO_RPM_STEP_CHANGES: "Automatic RPM Step Changes (PID)"
};

export default {
    name: "pid-tuner",
    components: {
        vueSlider
    },
    data() {
        return {
            processes: [
                {
                    name: "Mass/Spring/Damper",
                    code: SpringMassDamperProcessTxt
                },
                {
                    name: "R/C Jet Engine",
                    code: JetEngineModelTxt
                },
                {
                    name: "User Defined",
                    code: "n/a"
                },
            ],
            selProcessName: "",
            plantCodeString: '', // This is the non-eval()'d plant code, either provided from file or user-defined
            plantCode: null, // This gets populated by eval() when the Start/Stop simulation button is clicked
            showProcessEditModal: false, // Set to true when the "Edit Process" button is clicked

            // jetEngineModel: new JetEngineModel(10000.0, -1.0, 10000),

            fuelFlow_mlPmin: 0.0,
            fuelFlowRateMin_mlPmin: 0.0,
            fuelFlowRateMax_mlPmin: 1000.0,
            
            simulationTickPeriod_ms: 50, // Gets converted into seconds by computed property
            plotPeriod_ms: 100, // Gets converted into seconds by computed property
            duration_s: 0.0,

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
                    title: {
                        display: true,
                        text: 'Plant Output And PID Set-Point'
                    },
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
                        // Draw output first as first dataset has highest Z value (i.e. drawn ontop of other
                        // UI elements)
                        {
                            label: "Output (P + I + D)",
                            backgroundColor: "rgba(255, 60, 92, 0.5)",
                            borderColor: "rgba(255, 60, 92, 0.5)",
                            data: [],
                            fill: false
                        },
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
                    ]
                },
                options: {
                    title: {
                        display: true,
                        text: 'PID Controller Output'
                    },
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
            }, // pidTermsChartConfig: {
            pidTermsChart: null,
            // Make sure the following indicies stay in sync with the
            // datasets defined in the pidTermsChartConfig variable above!
            outputDataIndex: 0,
            pTermDataIndex: 1,
            iTermDataIndex: 2,
            dTermDataIndex: 3,      

            simulationRunning: false,
            modelTickTimer: null,
            modelUpdateTimer: null,

            rotVelSetPoint_rpm: 0.0,
            maxNumDataPoints: 100,
            pid: new Pid(0.0006, 0.0006, 0.0), // PID constants get overriden by values set from sliders
            pidConfig: {
                constants: { // These get overwritten when a process is loaded (process.getDefaults())
                    p: {
                        min: 0.0,
                        max: 1.0,
                        value: 0.5
                    },
                    i: {
                        min: 0.0,
                        max: 1.0,
                        value: 0.5
                    },
                    d: {
                        min: 0.0,
                        max: 1.0,
                        value: 0.5
                    }
                },
                integralLimitMode: 'Output Limited',
            }, // pidConfig
            
            areIntegralLimitingConstantsDisabled: false,
            integralLimitModes: [],            
            integralLimitingConstantMin: -1.0,
            integralLimitingConstantMax: 1.0,

        };
    },
    computed: {
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
        },
        plotPeriod_s () {
            return this.plotPeriod_ms/1000.0
        },
        simulationTickPeriod_s () {
            return this.simulationTickPeriod_ms/1000.0
        },
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
        processEdit () {
            console.log('processEdit() called.')
            this.showProcessEditModal = true
        },
        processHideModalAndLoad () { // Called when close() button inside edit process modal is clicked
            console.log('processHideModalAndLoad() called.')
            this.showProcessEditModal = false

            // We want to load any changes user has made to code
            console.log('Loading user changes to process code...')
            this.plantCode = eval(this.plantCodeString)
            console.log('plantCode = ')
            console.log(this.plantCode)
            this.plantCode.init()
        },
        processLoad () {
            console.log('processLoad() called.')

            // Load the file containing the process code if not user defined process
            if(this.selProcessName !== 'User Defined') {
                console.log('Loading predefined process code...')
                var self = this
                let selProcess = this.processes.find(function(element) {
                    return element.name === self.selProcessName
                })
                console.log('selProcess = ')
                console.log(selProcess)
                this.plantCodeString = selProcess.code

            }
            console.log('this.plantCodeString = ')
            console.log(this.plantCodeString)

            console.log('eval()\'ing plant code...')

            this.plantCode = eval(this.plantCodeString)
            console.log('plantCode = ')
            console.log(this.plantCode)

            // Set PID tuner defaults
            const defaults = this.plantCode.getDefaults()
            console.log('defaults =')
            console.log(defaults)

            if(defaults !== null) {
                console.log('Default values found.')
                this.pidConfig = defaults.pidConfig
            } else
                console.log('Default values NOT found.')

            this.plantCode.init()

        },
        performAutoSetPointChange() {
            if (this.rotVelSetPoint_rpm === 0.0) {
                this.rotVelSetPoint_rpm = 60000.0;
            } else {
                this.rotVelSetPoint_rpm = 0.0;
            }
        },
        setIntegralLimitingMode() {
            console.log('setIntegralLimitingMode() called.');
            if (this.pidConfig.integralLimitingMode === IntegralLimitModes.NONE) {
                this.pid.setIntegralLimit({
                    mode: IntegralLimitModes.NONE
                });
            } else if (this.pidConfig.integralLimitingMode === IntegralLimitModes.CONSTANT_LIMITED) {
                this.pid.setIntegralLimit({
                    mode: IntegralLimitModes.CONSTANT_LIMITED,
                    min: Number(this.integralLimitingConstantMin),
                    max: Number(this.integralLimitingConstantMax)
                });
            } else if (this.pidConfig.integralLimitingMode === IntegralLimitModes.OUTPUT_LIMITED) {
                this.pid.setIntegralLimit({
                    mode: IntegralLimitModes.OUTPUT_LIMITED
                });
            } else {
                throw new Error("Integral limiting mode unrecognized.");
            }

            if (this.pidConfig.integralLimitingMode === IntegralLimitModes.CONSTANT_LIMITED) {
                this.areIntegralLimitingConstantsDisabled = false
            } else {
                this.areIntegralLimitingConstantsDisabled = true
            }
        },
        startStopSimulation() {
            if (!this.simulationRunning) {
                // START
                console.log("Starting simulation...");                

                this.modelTickTimer = window.setInterval(() => {
                this.tick();
                }, this.simulationTickPeriod_s * 1000.0);

                this.modelUpdateTimer = window.setInterval(() => {
                this.update();
                }, this.plotPeriod_s * 1000.0);

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
                // let rotVel_radPs = this.jetEngineModel.getRotVel_radPs();
                let rotVel_radPs = this.plantCode.getRotVel_radPs();

                // console.log("this.rotVelSetPoint_rpm = " + this.rotVelSetPoint_rpm);
                let rotVelSetPoint_radPs = this.rotVelSetPoint_rpm / 60.0 * 2 * Math.PI;

                this.pid.setSetPoint(rotVelSetPoint_radPs);
                this.fuelFlow_mlPmin = this.pid.run(rotVel_radPs, this.simulationTickPeriod_s) * 1000.0;
            }

            // this.jetEngineModel.update(
            //     this.fuelFlow_mlPmin / 1000.0,
            //     this.simulationTickPeriod_s
            // );

            this.plantCode.update(
                this.fuelFlow_mlPmin / 1000.0,
                this.simulationTickPeriod_s
            );

            this.duration_s += this.simulationTickPeriod_s;
        },
        // This updates the UI. Called by window.setInterval()
        update() {
            // let rotVel_radPs = this.jetEngineModel.getRotVel_radPs();
            let rotVel_radPs = this.plantCode.getRotVel_radPs();
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
                this.pidConfig.constants.p.value,
                this.pidConfig.constants.i.value,
                this.pidConfig.constants.d.value
            );
        }
    },
    watch: {
        pidEnabled(val) {
            console.log("pidEnabled changed.");
            if (val)
                this.addSetPointLine();
        },
        pidConfig: {
            handler(val) {
                console.log("pidConstants changed.");
                this.updatePidConstants();
            },
            deep: true
        }
    }, // watch: {
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

        // Set default process, and then load it
        this.selProcessName = this.processes[1].name
        this.processLoad()

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
        this.pidConfig.integralLimitingMode = IntegralLimitModes.OUTPUT_LIMITED;
        this.setIntegralLimitingMode()

        if (this.pidEnabled) this.addSetPointLine();

        console.log('Loading ES6 module...')
        var res = eval('function test() { console.log(\'testing\') }; test;')
        console.log('x = ' + res)
        res()

    } // mounted() {
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
