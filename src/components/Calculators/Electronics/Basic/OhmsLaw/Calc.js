import MainView from './MainView'

export var ohmsLawCalculator = {
  displayName: 'Ohm\'s Law',
  description: 'The hammer in any electrical engineers toolbox. calculate voltage, resistance and current using Ohm\'s law.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Electronics', 'Basic' ],
  tags: [ 'ohm', 'ohm\'s', 'resistor', 'resistance', 'voltage', 'current', 'law', 'v=ir', 'power' ],
  mainView: MainView
}
