<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <md-card md-with-hover class="calc-preview">

    <md-card-media>
      <img :src="imageUrl" style="width: 160px;">

      <md-ink-ripple></md-ink-ripple>
    </md-card-media>

    <md-card-header>
      <div class="md-title">{{title}}</div>
      <!--<div class="md-subhead">Subtitle here</div>-->
    </md-card-header>

    <md-card-content>
      {{ description }}
    </md-card-content>


    <!--<md-button id="open-button" class="md-raised md-primary">Open</md-button>-->


    <md-card-actions>
      <md-button @click.native="open">Open</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>

  export default {
    name: 'calc-preview',
    props: {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      componentName: {
        type: String,
        required: true
      },
      imageUrl: {
        type: String,
        required: true
      }
    },
    components: {},
    computed: {},
    methods: {
      open () {
        console.log('open() called.')

        // Hide the overlay
        this.$store.commit('showCalculatorSelectionOverlay', {
          trueFalse: false
        })

        // Add calculator
        this.$store.commit('openCalculator', {
          name: this.title,
          componentName: this.componentName
        })
      }
    },
    mounted: () => {
      console.log('CalcPreview.mounted() called.')
//      console.log(this.description)
//      if (!this.description) {
//        throw new Error('A description must be passed to CalcPreview.')
//      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .calc-preview {
    width: 250px;
    height: 350px;
    margin: 15px;

  }

  #open-button {
    width: 70px;
  }

  div.md-card-header {
    padding: 0px !important;
  }

</style>
