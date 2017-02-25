import MainView from './MainView'

// console.log('OhmsLawCalculator.js called!')
// console.log('MainView =')
// console.log(MainView)

var ohmsLawCalculator = {
  displayName: 'Ohm\'s Law',
  description: 'The hammer in any electrical engineers toolbox. calculate voltage, resistance and current using Ohm\'s law.',
  mainView: MainView,
  imagePath: require('../../components/OhmsLawCalculator/grid-icon.png')
}

export default ohmsLawCalculator

// Register calculator
// var calculatorService = CalculatorServiceSingleton.getInstance()
// calculatorService.registerCalc(ohmsLawCalculator)
