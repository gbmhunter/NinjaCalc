import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import CalcValue from 'src/misc/CalculatorEngineV2/view/CalcValue'
Vue.component('calc-value', CalcValue)
import CalcValueAndUnit from 'src/misc/CalculatorEngineV2/view/CalcValueAndUnit'
Vue.component('calc-value-and-unit', CalcValueAndUnit)
import CalcUnits from 'src/misc/CalculatorEngineV2/view/CalcUnits'
Vue.component('calc-units', CalcUnits)
import CalcVarString from 'src/misc/CalculatorEngineV2/view/CalcVarString'
Vue.component('calc-var-string', CalcVarString)
import CalcVarCheckbox from 'src/misc/CalculatorEngineV2/view/CalcVarCheckbox'
Vue.component('calc-var-checkbox', CalcVarCheckbox)

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
Vue.use(VueMaterial)

import KeenUI from 'keen-ui'
Vue.use(KeenUI)
import 'keen-ui/dist/keen-ui.css'

import MainView from 'src/components/Calculators/Electronics/Basic/OhmsLaw/MainView'

describe('OhmsLawCalculator.vue', () => {
  it('Basic equation test.', () => {
    const Constructor = Vue.extend(MainView)
    const vm = new Constructor().$mount()
    // vm.calc.getVar('voltage_V').dispVal = '2'
    // vm.calc.getVar('voltage_V').onDispValChange()
    // vm.calc.getVar('current_A').dispVal = '0.5'
    // vm.calc.getVar('current_A').onDispValChange()
    // expect(vm.calc.getVar('resistance_Ohms').dispVal).to.equal('4.000')
  })
})
