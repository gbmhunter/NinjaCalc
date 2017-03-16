import MainView from './MainView'

export const capacitorChargeCalculator = {
  displayName: 'Capacitor Charge (Q=CV)',
  description: 'Calculate either the charge, capacitance or voltage across a capacitor using Q = CV.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Electronics', 'Basic' ],
  tags: [ 'capacitor', 'capacitance', 'charge', 'voltage', 'farad', 'coulomb', 'electron' ],
  mainView: MainView
}
