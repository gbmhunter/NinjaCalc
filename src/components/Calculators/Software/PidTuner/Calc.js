import MainView from './MainView'

export var pidTuner = {
  displayName: 'PID Tuner',
  description: 'A tool to help you tune a PID controller. Can simulate both predefined and user-defined process/plants/systems. Incl. real-time graphs of simulation.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Software' ],
  tags: [ 'pid', 'control', 'system', 'process', 'plant', 'simulation', 'simulate', 'tune', 'tuner', 'user', 'controller', 'proportional', 'integral', 'derivative' ],
  mainView: MainView
}
