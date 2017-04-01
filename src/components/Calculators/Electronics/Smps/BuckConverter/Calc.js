import MainView from './MainView'

export var buckConverterCalculator = {
  displayName: 'Buck Converter (SMPS)',
  description: 'This calculator can be used to calculate the values of the critical component values for a buck converter.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Electronics', 'SMPS' ],
  tags: [ 'buck, converter, smps, psu, power, voltage, current, inductor, conversion' ],
  mainView: MainView
}
