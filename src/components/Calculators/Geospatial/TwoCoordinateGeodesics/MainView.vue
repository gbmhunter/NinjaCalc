<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="calculator-container">

    <ui-collapsible title="Info" class="calc-info" style="max-width: 600px;">
      This calculator finds the great-circle (shortest) distance between two points on the earth defined by latitude and longitude.
    </ui-collapsible>

    <table>
      <tbody>
      <tr>
        <td>Point 1</td>
        <td><calc-input v-model="point1String" dir="in" tooltip="The start (first) coordinate." placeholder="10.0,10.0" /></td>
        <td>
          <select v-model="selCoordinateUnit">
            <option>Degrees</option>
            <option>Radians</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Point 2</td>
        <td><calc-input v-model="point2String" dir="in" tooltip="The end (second) coordinate." placeholder="10.0,10.0"/></td>
        <td>
          <select v-model="selCoordinateUnit">
            <option>Degrees</option>
            <option>Radians</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Distance</td>
        <td><calc-input v-model="distance" tooltip="The great-circle (shortest) distance between the two points." dir="out"/></td>
        <td>
          <select v-model="distanceUnits">
            <option>km</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Initial Bearing</td>
        <td><calc-input v-model="initialBearing" tooltip="The bearing (relative to North) that you would be facing when standing at point 1 and travelling to point 2." dir="out"/></td>
        <td>
          <select v-model="selCoordinateUnit">
            <option>Degrees</option>
            <option>Radians</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Final Bearing</td>
        <td><calc-input v-model="finalBearing" tooltip="The bearing (relative to North) that you would be facing when you arrive at point 2, having travelled from point 1." dir="out"/></td>
        <td>
          <select v-model="selCoordinateUnit">
            <option>Degrees</option>
            <option>Radians</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Intermediate Point Fraction</td>
        <td><calc-input v-model="intermediatePointFraction" dir="in" tooltip="A fractional amount between 0 and 1 the describes how far the intermediate point is between point 1 and point 2." :validator="isNumber"/></td>
      </tr>
      <tr>
        <td>Coordinates</td>
        <td><calc-input v-model="intermediatePointCoordinatesString" tooltip="The coordinates of an intermediate point which is between point 1 and 2, determined by the fractional amount above." dir="out"/></td>
      </tr>
      </tbody>
    </table>

    <div id="globe-container" />


  </div>
</template>

<script>

  // 3D globe based of pen found at https://codepen.io/anon/pen/MQrzdp

  /* eslint-disable camelcase */
  /* eslint-disable */

  import * as d3 from 'd3'
  import feature from 'topojson-client/src/feature'
  import versor from 'versor';

  import CalcInput from 'src/misc/CalculatorEngineV3/CalcInput'

  import { Coordinate, CoordinateUnits, Geospatial } from 'src/misc/Geospatial/Geospatial'
  var world110m = require('./world-110m')
  var self = null

  export default {
    name: 'two-coordinate-geodesics', // This will show up in the URL
    components: { CalcInput },
    data: function () {
      console.log('data() called')


      return {
        geospatial: new Geospatial(),
        coordinateUnits: [
          {name: 'Degrees'},
          {name: 'Radians'}
        ],
        selCoordinateUnit: 'Degrees',

        point1String: '-20, -30',
        point2String: '40, 20',
        distanceUnits: 'km',
        intermediatePointFraction: 0.5,

        canvas: null,
        water: {type: 'Sphere'},
        colorWater: '#fff',
        land: null,
        colorLand: '#111',
        projection: null,
        graticule: null,
        colorGraticule: '#ccc',
        path: null,
        width: 400,
        height: 400,
        scaleFactor: 0.90
      }
    },
    computed: {
      distance: function() {
        if(this.point1Coord == null || this.point2Coord == null) {
          return ''
        }

        var distance_m = this.geospatial.DistanceBetweenTwoPoints_m(this.point1Coord, this.point2Coord);

        var scaledDistance
        if(this.distanceUnits == 'km')
          scaledDistance = distance_m/1000.0
        else
          throw Error('Distance unit not recognized.')

        return Math.round(scaledDistance)
      },
      point1Coord: function() {
        console.log('point1Coord() called.')
        var pointCoord = new Coordinate()
        try {
          if(this.selCoordinateUnit === 'Degrees') {
            pointCoord.FromString(this.point1String, CoordinateUnits.DEGREES)
          } else if(this.selCoordinateUnit === 'Radians') {
            pointCoord.FromString(this.point1String, CoordinateUnits.RADIANS)
          }
        } catch (e) {
          return null
        }
        return pointCoord
      },
      point2Coord: function() {
        console.log('point2Coord() called.')
        var pointCoord = new Coordinate()
        try {
          if(this.selCoordinateUnit === 'Degrees') {
            pointCoord.FromString(this.point2String, CoordinateUnits.DEGREES)
          } else if(this.selCoordinateUnit === 'Radians') {
            pointCoord.FromString(this.point2String, CoordinateUnits.RADIANS)
          }
        } catch (e) {
          return null
        }
        return pointCoord
      },
      initialBearing: function() {

        if(this.point1Coord == null || this.point2Coord == null) {
          return ''
        }

        var y = Math.sin(this.point2Coord.GetLon_rad() - this.point1Coord.GetLon_rad()) * Math.cos(this.point2Coord.GetLat_rad());
        var x = Math.cos(this.point1Coord.GetLat_rad())*Math.sin(this.point2Coord.GetLat_rad()) -
          Math.sin(this.point1Coord.GetLat_rad())*Math.cos(this.point2Coord.GetLat_rad())*Math.cos(this.point2Coord.GetLon_rad() - this.point1Coord.GetLon_rad());
        var bearing_rad = Math.atan2(y, x)

        var bearing_units
        if(this.selCoordinateUnit === 'Degrees') {
          bearing_units = bearing_rad*(180.0/Math.PI)
        } else if(this.selCoordinateUnit === 'Radians') {
          bearing_units = bearing_rad
        } else {
          throw Error('Selected unit not recognized.')
        }

        return bearing_units.toPrecision(4)
      },
      finalBearing: function() {

        if(this.point1Coord == null || this.point2Coord == null) {
          return ''
        }

        var y = Math.sin(this.point1Coord.GetLon_rad() - this.point2Coord.GetLon_rad()) * Math.cos(this.point1Coord.GetLat_rad());
        var x = Math.cos(this.point2Coord.GetLat_rad())*Math.sin(this.point1Coord.GetLat_rad()) -
          Math.sin(this.point2Coord.GetLat_rad())*Math.cos(this.point1Coord.GetLat_rad())*Math.cos(this.point1Coord.GetLon_rad() - this.point2Coord.GetLon_rad());
        var bearing_rad = Math.atan2(y, x)

        // Reverse bearing
        bearing_rad = (bearing_rad + Math.PI) % (2*Math.PI)

        var bearing_units
        if(this.selCoordinateUnit === 'Degrees') {
          bearing_units = bearing_rad*(180.0/Math.PI)
        } else if(this.selCoordinateUnit === 'Radians') {
          bearing_units = bearing_rad
        } else {
          throw Error('Selected unit not recognized.')
        }

        return bearing_units.toPrecision(4)
      },
      intermediatePointCoordinates: function() {
        if(!this.distance)
          return ''

        const p1Lat = this.point1Coord.GetLat_rad()
        const p1Lon = this.point1Coord.GetLon_rad()
        const p2Lat = this.point2Coord.GetLat_rad()
        const p2Lon = this.point2Coord.GetLon_rad()
        const f = parseFloat(this.intermediatePointFraction)
        const d = this.distance/this.geospatial.EARTH_RADIUS_M

        var A = Math.sin((1-f)*d)/Math.sin(d)
        var B = Math.sin(f*d)/Math.sin(d)
        var x = A*Math.cos(p1Lat)*Math.cos(p1Lon) +  B*Math.cos(p2Lat)*Math.cos(p2Lon)
        var y = A*Math.cos(p1Lat)*Math.sin(p1Lon) +  B*Math.cos(p2Lat)*Math.sin(p2Lon)
        var z = A*Math.sin(p1Lat) + B*Math.sin(p2Lat)
        var intPointLat = Math.atan2(z,Math.sqrt(Math.pow(x,2)+Math.pow(y,2)))
        var intPointLon = Math.atan2(y,x)

        var intPointCoord = new Coordinate()
        intPointCoord.SetLat_rad(intPointLat)
        intPointCoord.SetLon_rad(intPointLon)
        return intPointCoord
      },
      intermediatePointCoordinatesString: function() {
        if(!this.intermediatePointCoordinates)
          return ''

        if(this.selCoordinateUnit === 'Degrees') {
          return this.intermediatePointCoordinates.GetLat_deg().toPrecision(4) + ', ' +
            this.intermediatePointCoordinates.GetLon_deg().toPrecision(4)
        } else if(this.selCoordinateUnit === 'Radians') {
          return this.intermediatePointCoordinates.GetLat_rad().toPrecision(4) + ', ' +
            this.intermediatePointCoordinates.GetLon_rad().toPrecision(4)
        } else {
          throw Error('Selected unit not recognized.')
        }
      }
    },
    watch: {
      point1Coord: function(val) {
        this.render()
      },
      point2Coord: function(val) {
        this.render()
      },
      intermediatePointCoordinates: function(val) {
        this.render()
      }
    },
    methods: {
      fill: function(obj, color) {
        // console.log('fill() called. this.context =')
        // console.log(this.context)
        this.context.beginPath()
        this.path(obj)
        this.context.fillStyle = color
        this.context.fill()
      },
      stroke: function(obj, color) {
        this.context.beginPath()
        this.path(obj)
        this.context.strokeStyle = color
        this.context.stroke()
      },
      scale: function () {
        // console.log('scale() called. this.canvas = ' + this.canvas)
        // this.width = document.documentElement.clientWidth
        // this.height = document.documentElement.clientHeight
        this.canvas.attr('width', this.width).attr('height', this.height)
        this.projection
          .scale((this.scaleFactor * Math.min(this.width, this.height)) / 2)
          .translate([this.width / 2, this.height / 2])
        this.render()
      },
      render: function () {
        console.log('render() called. this.water =')
        console.log(this.water)
        this.context.clearRect(0, 0, this.width, this.height)
        this.fill(this.water, this.colorWater)
        console.log('this.graticule = ')
        console.log(this.graticule)
        this.stroke(this.graticule, this.colorGraticule)
        this.fill(this.land, this.colorLand)

        if(this.point1Coord != null) {
          this.context.beginPath()
          this.context.fillStyle = "red";
          this.path({ type: "Point", coordinates: [this.point1Coord.GetLon_deg(), this.point1Coord.GetLat_deg()]})
          this.context.fill()
        }

        if(this.point2Coord != null) {
          this.context.beginPath()
          this.context.fillStyle = "red";
          this.path({ type: "Point", coordinates: [this.point2Coord.GetLon_deg(), this.point2Coord.GetLat_deg()]})
          this.context.fill()
        }

        if(this.point1Coord != null && this.point2Coord != null) {
          var oldLineWidth = this.context.lineWidth
          var line = {
            type: "MultiLineString",
            coordinates: [[
              [this.point1Coord.GetLon_deg(), this.point1Coord.GetLat_deg()],
              [this.point2Coord.GetLon_deg(), this.point2Coord.GetLat_deg()]
            ]]}
          this.context.beginPath()
          this.path(line)
          this.context.strokeStyle = "red"
          this.context.lineWidth = 3
          this.context.stroke()
          this.context.lineWidth = oldLineWidth
        }

        if(this.intermediatePointCoordinates) {
          this.context.beginPath()
          this.context.fillStyle = "orange";
          this.path({ type: "Point", coordinates:
              [this.intermediatePointCoordinates.GetLon_deg(), this.intermediatePointCoordinates.GetLat_deg()]})
          this.context.fill()
        }


      },
      dragstarted: function() {
        this.v0 = versor.cartesian(this.projection.invert(d3.mouse(window.document.getElementById("globe-container"))))
        this.r0 = this.projection.rotate()
        this.q0 = versor(this.r0)
      },
      dragged: function () {
        var v1 = versor.cartesian(this.projection.rotate(this.r0).invert(d3.mouse(window.document.getElementById("globe-container"))))
        var q1 = versor.multiply(this.q0, versor.delta(this.v0, v1))
        var r1 = versor.rotation(q1)
        this.projection.rotate(r1)
        self.render()
      },
      dragended: function () {
        // startRotation(rotationDelay)
      },
      isNumber (value) {
        console.log('isNumber() called with value = ' + value)
        return !isNaN(value)
      }
    },
    mounted () {
      // Configure calculator to default state now that
      // UI has been created
      // this.calc.init()

      if (window.MathJax) {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
      }

      this.canvas = d3.select('#globe-container').append('canvas')
        .attr('width', this.width)
        .attr('height', this.height)

      this.context = this.canvas.node().getContext('2d')
      this.projection = d3.geoOrthographic().precision(0.1)
      console.log('blah = ')
      console.log(d3.geoGraticule10())
      this.graticule = d3.geoGraticule10()
      this.path = d3.geoPath(this.projection).context(this.context)

      // feature() is from the topojson-client library (DO NOT ADD topojson AS A DEPENDENCY)
      this.land = feature(world110m, world110m.objects.land)
      this.countries = feature(world110m, world110m.objects.countries)
      // this.countryList = cList
      this.scale()

      self = this

      this.canvas
        .call(d3.drag()
          .on('start', this.dragstarted)
          .on('drag', this.dragged)
          .on('end', this.dragended)
        )


    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  input {
    width: 150px;
  }

</style>
