<template xmlns:v-on="http://www.w3.org/1999/xhtml">

  <div v-on:click="open()" id="calc-preview-container">

    <div id="image-wrapper"><img :src="imageUrl" id="image"></div>

    <div id="title">{{ title }}</div>

    <div id="description">{{ description }}</div>

    <div id="open-button"><ui-button color="primary" size="small">Open</ui-button></div>
  </div>

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
//      console.log('CalcPreview.mounted() called.')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /* The slow way */
  #calc-preview-container {

    width: 200px;
    height: 300px;

    margin: 10px;
    padding: 5px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    border-radius: 5px;
    border-color: #cdcdcd;
    border-width: 1px;
    border-style: solid;

    box-shadow: 0 2px 4px rgba(0,0,0,0.20);
    transition: box-shadow 0.3s ease-in-out;
  }

  /* Transition to a bigger shadow on hover */
  #calc-preview-container:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }

  #image-wrapper {
    /* This makes the image wrapper always the same height, even though the
    actual height of the image may differ slightly */
    height: 120px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  #image {
    max-width: 140px;
    max-height: 120px;

    width: auto;
    height: auto;
  }

  #title {
    font-size: 20px;
    font-weight: 500;
  }

  #description {
    font-size: 12px;
  }

  #open-button {
    margin-right: 10px;
    display: flex;
    justify-content: flex-end;
  }

</style>
