import MainView from './MainView'

export var distanceBetweenTwoCoordinates = {
  displayName: 'Distance Between Two Coordinates',
  description: 'Calculate the great-circle distance between two coordinates specified by latitude/longitude.',
  imagePath: require('./grid-icon.png'),
  category: [ 'Geospatial' ],
  tags: [ 'coordinate', 'distance', 'great circle', 'latitude', 'longitude' ],
  mainView: MainView
}
