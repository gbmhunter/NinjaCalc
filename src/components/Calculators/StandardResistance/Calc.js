import MainView from './MainView'

export default {
  displayName: 'Resistance Divider',
  description: 'Find the closest E-series (e.g. E12, E96) resistor (preferred value) to your desired resistance.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Electronics', 'Basic' ],
  tags: [ 'ohm', 'resistor', 'resistance', 'e', 'series', 'standard', 'preferred', 'values', 'e6', 'e12', 'e24', 'e48', 'e96', 'e128' ],
  mainView: MainView
}
