<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="calculator-container" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">

    <!-- LEFT-HAND SIDE PANE FOR ENTERING POINTS -->
    <div style="flex: 0 1 auto; width: 200px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <span style="font-weight: bold;">Points</span>
      <span style="font-size: 10px;">Enter point coordinates here<br>&lt;lat, lon&gt;:</span>
      <calc-textarea v-model="pointCoordinatesString" style="width: 100%; height: 200px;"></calc-textarea>

      <div class="spacer" style="height: 20px;"></div>

      <span style="font-weight: bold;">Arcs</span>
      <span style="font-size: 10px;">Enter arc start and end coordinates here<br>&lt;lat_start, lon_start, lat_end, lon_end&gt;:</span>
      <calc-textarea v-model="arcsString" style="width: 100%; height: 200px;"></calc-textarea>

      <div class="spacer" style="height: 20px;"></div>
      <button @click="clearAll" style="width: 100px; height: 40px;">Clear All</button>
    </div>

    <div class="spacer" style="width: 10px;"></div>

    <!-- RIGHT-HAND SIDE MAP -->
    <gmap-map
      :center="center"
      :zoom="2"
      style="flex: 1 1 auto; height: 100%;">
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"/>
      <gmap-polyline
        v-for="(arc, index) in arcs"
        :key="'a' + index.toString()"
        :path="arc.path"
        :options="{ geodesic: true }" />
    </gmap-map>

  </div>
</template>

<script>

  // 3D globe based of pen found at https://codepen.io/anon/pen/MQrzdp

  /* eslint-disable */


  import { Coordinate, CoordinateUnits, Geospatial } from 'src/misc/Geospatial/Geospatial'

  import CalcInput from 'src/misc/CalculatorEngineV3/CalcInput'
  import CalcSelect from 'src/misc/CalculatorEngineV3/CalcSelect'
  import CalcTextArea from 'src/misc/CalculatorEngineV3/CalcTextArea'

  export default {
    name: 'map-plotter', // This will show up in the URL
    components: { 'calc-input': CalcInput, CalcSelect, 'calc-textarea': CalcTextArea },
    data: function () {

      return {
        center: {lat: 10.0, lng: 10.0},
        // markers: [{
        //   position: {lat: 10.0, lng: 10.0}
        // }, {
        //   position: {lat: 11.0, lng: 11.0}
        // }],
        pointCoordinatesString: {
          dir: 'in',
          value: '20, -10\n20, 10',
          help: 'Enter the coordinates for one point per line.',
          validator: {
            state: 'ok',
            msg: 'Test'
          }
        },
        arcsString: {
          dir: 'in',
          value:
          '15,-20,5,-10\n' +
          '5,-10,5,10\n' +
          '5,10,15,20',
          help: 'Enter the start and end coordinates for one arc per line.',
          validator: {
            state: 'ok',
            msg: 'Test'
          }
        },
        selCoordinateUnit: 'Degrees'
      }
    },
    computed: {
      markers () {
        var points = []

        var coordArray = this.pointCoordinatesString.value.split('\n')
        var allPointsValid = true
        coordArray.map((coordString) => {
          console.log('coordString =')
          console.log(coordString)

          // Ignore empty lines
          if (coordString === '') return

          var pointCoord = new Coordinate()
          try {
            if (this.selCoordinateUnit === 'Degrees') {
              pointCoord.FromString(coordString, CoordinateUnits.DEGREES)
            } else if (this.selCoordinateUnit === 'Radians') {
              pointCoord.FromString(coordString, CoordinateUnits.RADIANS)
            }
          } catch (e) {
            allPointsValid = false
            return
          }
          points.push({
            position: {
              lat: pointCoord.GetLat_deg(),
              lng: pointCoord.GetLon_deg()
            }
          })
        })

        if (allPointsValid) {
          this.pointCoordinatesString.validator.state = 'ok'
          this.pointCoordinatesString.validator.msg = ''
        } else {
          this.pointCoordinatesString.validator.state = 'error'
          this.pointCoordinatesString.validator.msg = 'One or more points is not in the correct format.'
        }

        return points
      },
      arcs () {
        var arcs = []
        var arcsStringArray = this.arcsString.value.split('\n')
        var allPointsValid = true
        arcsStringArray.map((arcString) => {

          // Ignore a line which is empty
          if (arcString === '') return

          var arc = {}
          arc.path = []

          const numbers = arcString.split(',')
          console.log('numbers =')
          console.log(numbers)

          // Make sure there is just not one point (only one coordinate error will
          // be handled by the 'FromString' method call below)
          if (numbers.length === 2) allPointsValid = false

          for (var i = 0; i < numbers.length/2; i++) {
            var pointCoord = new Coordinate()
            const coordString = numbers[2*i] + ', ' + numbers[2*i + 1]
            console.log('coordString = ' + coordString)
            try {
              if (this.selCoordinateUnit === 'Degrees') {
                pointCoord.FromString(coordString, CoordinateUnits.DEGREES)
              } else if (this.selCoordinateUnit === 'Radians') {
                pointCoord.FromString(coordString, CoordinateUnits.RADIANS)
              }
            } catch (e) {
              console.log('ERROR')
              allPointsValid = false
              return
            }
            arc.path.push({ lat: pointCoord.GetLat_deg(), lng: pointCoord.GetLon_deg() })
            console.log('arc =')
            console.log(arc)
          }

          arcs.push(arc)

        })

        if (allPointsValid) {
          this.arcsString.validator.state = 'ok'
          this.arcsString.validator.msg = ''
        } else {
          this.arcsString.validator.state = 'error'
          this.arcsString.validator.msg = 'One or more arcs is not in the correct format.'
        }

        console.log('arcs = ')
        console.log(arcs)
        return arcs
      }
    },
    watch: {},
    methods: {
      clearAll () {
        // Clears all points and arcs from map (as well as from text boxes)
        this.pointCoordinatesString.value = ''
        this.arcsString.value = ''
      }
    },
    mounted () {
      // this.markers[0].position.lat = 50.0
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
