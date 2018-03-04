<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="calculator-container" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">

    <!-- LEFT-HAND SIDE PANE FOR ENTERING POINTS -->
    <div style="flex: 0 1 auto; width: 200px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <span style="font-weight: bold;">Points</span>
      <span style="font-size: 10px;">Enter point coordinates here<br>&lt;lat, lon&gt;:</span>
      <textarea v-model="pointCoordinatesString" style="width: 100%; height: 200px;"></textarea>

      <div class="spacer" style="height: 20px;"></div>

      <span style="font-weight: bold;">Arcs</span>
      <span style="font-size: 10px;">Enter arc start and end coordinates here<br>&lt;lat_start, lon_start, lat_end, lon_end&gt;:</span>
      <textarea v-model="arcsString" style="width: 100%; height: 200px;"></textarea>

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
        :path="arc.path"
        :options="{ geodesic: true }" />
    </gmap-map>

  </div>
</template>

<script>

  // 3D globe based of pen found at https://codepen.io/anon/pen/MQrzdp

  /* eslint-disable */


  import { Coordinate, CoordinateUnits, Geospatial } from 'src/misc/Geospatial/Geospatial'

  // import CalcInput from 'src/misc/CalculatorEngineV3/CalcInput'
  import CalcInput from 'src/misc/CalculatorEngineV3/CalcInput'
  import CalcSelect from 'src/misc/CalculatorEngineV3/CalcSelect'


  export default {
    name: 'map-plotter', // This will show up in the URL
    components: { CalcInput, CalcSelect },
    data: function () {

      return {
        center: {lat: 10.0, lng: 10.0},
        // markers: [{
        //   position: {lat: 10.0, lng: 10.0}
        // }, {
        //   position: {lat: 11.0, lng: 11.0}
        // }],
        pointCoordinatesString: '20, -10\n20, 10',
        arcsString:
          '15,-20,5,-10\n' +
          '5,-10,5,10\n' +
          '5,10,15,20',
        selCoordinateUnit: 'Degrees'
      }
    },
    computed: {
      markers () {
        var points = []

        var coordArray = this.pointCoordinatesString.split('\n')
        coordArray.map((coordString) => {
          console.log('coordString =')
          console.log(coordString)
          var pointCoord = new Coordinate()
          try {
            if (this.selCoordinateUnit === 'Degrees') {
              pointCoord.FromString(coordString, CoordinateUnits.DEGREES)
            } else if (this.selCoordinateUnit === 'Radians') {
              pointCoord.FromString(coordString, CoordinateUnits.RADIANS)
            }
          } catch (e) {
            return
          }
          points.push({
            position: {
              lat: pointCoord.GetLat_deg(),
              lng: pointCoord.GetLon_deg()
            }
          })
        })

        return points
      },
      arcs () {
        var arcs = []
        var arcsStringArray = this.arcsString.split('\n')
        arcsStringArray.map((arcString) => {
          var arc = {}
          arc.path = []

          const numbers = arcString.split(',')
          console.log('numbers =')
          console.log(numbers)

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
              return
            }
            arc.path.push({ lat: pointCoord.GetLat_deg(), lng: pointCoord.GetLon_deg() })
            console.log('arc =')
            console.log(arc)
          }

          arcs.push(arc)

        })

        console.log('arcs = ')
        console.log(arcs)
        return arcs
      }
    },
    watch: {},
    methods: {
      clearAll () {
        // Clears all points and arcs from map (as well as from text boxes)
        this.pointCoordinatesString = ''
        this.arcsString = ''
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
