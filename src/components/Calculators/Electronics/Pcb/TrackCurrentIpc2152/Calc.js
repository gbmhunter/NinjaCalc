import MainView from './MainView'

export var trackCurrentIpc2152Calculator = {
  displayName: 'Track Current (IPC-2152)',
  description: 'PCB track current carrying capability calculator, using the IPC-2152 standard.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Electronics', 'PCB' ],
  tags: [ 'pcb', 'track', 'net', 'current', 'trace', 'width', 'carry', 'heat', 'hot', 'temperature', 'ipc', 'ipc2221a', 'ipc-2221a' ],
  mainView: MainView
}
