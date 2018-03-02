/* eslint-disable camelcase */

export class Coordinate {
  constructor () {
    this.lat_rad = 0.0
    this.lon_rad = 0.0
  }

  GetLat_rad () {
    return this.lat_rad
  }

  SetLat_rad (value) {
    this.lat_rad = value
  }

  GetLon_rad () {
    return this.lon_rad
  }

  SetLon_rad (value) {
    this.lon_rad = value
  }

  GetLat_deg () {
    return this.lat_rad * (180.0 / Math.PI)
  }

  SetLat_deg (value) {
    this.lat_rad = value * (Math.PI / 180.0)
  }

  GetLon_deg () {
    return this.lon_rad * (180.0 / Math.PI)
  }

  SetLon_deg (value) {
    this.lon_rad = value * (Math.PI / 180.0)
  }

  FromString (value, units) {
    console.log('FromString() called.')
    // console.log('t' + units instanceof CoordinateUnits)
    // if (!(typeof value === 'string') || !(units instanceof CoordinateUnits)) {
    //   throw new Error('Inputs are invalid.')
    // }

    var latlon = value.split(/, ?/)
    console.log('latlon = ' + latlon)

    var lat = parseFloat(latlon[0])
    if (isNaN(lat)) {
      throw new Error('String was not valid')
    }
    if (units === CoordinateUnits.DEGREES) {
      this.SetLat_deg(lat)
    } else if (units === CoordinateUnits.RADIANS) {
      this.SetLat_rad(lat)
    }
    // console.log('this.lat_rad = ' + this.lat_rad)

    var lon = parseFloat(latlon[1])
    console.log('lon = ' + lon)
    if (isNaN(lon)) {
      throw new Error('String was not valid')
    }
    if (units === CoordinateUnits.DEGREES) {
      this.SetLon_deg(lon)
    } else if (units === CoordinateUnits.RADIANS) {
      this.SetLon_rad(lon)
    }
  }
}

export const CoordinateUnits = {
  DEGREES: 'degrees',
  RADIANS: 'radians'
}

export class Geospatial {

  constructor () {
    this.EARTH_RADIUS_M = 6371e3
  }

  DistanceBetweenTwoPoints_m = (coord1, coord2) => {
    var deltaLat = coord2.GetLat_rad() - coord1.GetLat_rad()
    var deltaLon = coord2.GetLon_rad() - coord1.GetLon_rad()

    var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(coord1.GetLat_rad()) * Math.cos(coord2.GetLat_rad()) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    var distance_m = this.EARTH_RADIUS_M * c
    return distance_m
  }
}
