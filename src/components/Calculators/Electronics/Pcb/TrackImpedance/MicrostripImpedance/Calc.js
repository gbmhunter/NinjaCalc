import MainView from './MainView'

export var microstripImpedanceCalculator = {
  displayName: 'Microstrip Impedance Calculator',
  description: 'A calculator for working out the impedance of a standard microstrip style track.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Electronics', 'PCB', 'Track Impedance' ],
  tags: [ 'pcb', 'track', 'net', 'impedance', 'rf', 'z', 'microstrip', 'route', 'routing', 'controlled', 'icr', 'wavelength', 'microwave', 'ghz' ],
  mainView: MainView
}
