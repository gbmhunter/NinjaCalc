<template xmlns:v-on="http://www.w3.org/1999/xhtml">

  <router-link tag="div" :to="'/tool/' + componentName" id="calc-preview-container">

    <div id="image-wrapper"><img :src="imageUrl" id="image"></div>
    <div style="height: 5px;"></div>
    <!-- The combined height of the title and description is fixed, but the description may be bigger
    or smaller in this div depending on how many lines the header takes up -->
    <div id="title-and-description" style="height: 150px; overflow-y: hidden;">
      <div id="title" style="font-size: 20px; font-weight: bold; text-align: center;">{{ title }}</div>
      <div style="height: 5px;"></div>
      <div id="description"
           style="font-size: 12px; text-align: left; padding: 0px 4px 0px 4px;">{{ description }}</div>
    </div>

    <div id="open-button">
      <ui-button color="primary" size="small">Open</ui-button></div>
  </router-link>

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
  methods: {},
  mounted: () => {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /* The slow way */
  #calc-preview-container {

    /* Width and height sets the dimensions for each
    calculator preview.*/
    width: 200px;
    height: 300px;

    margin: 10px;
    padding: 5px;

    position: relative;
    /*display: flex;*/
    /*flex-direction: column;*/
    /*justify-content: space-around;*/

    border-radius: 5px;
    border-color: #cdcdcd;
    border-width: 1px;
    border-style: solid;

    box-shadow: 0 2px 4px rgba(0,0,0,0.20);
    transition: box-shadow 0.3s ease-in-out;

    /* Giving the calculator preview objects a background color
    makes the move transition applied to them look better (when one slides over another,
    you can't see them both) */
    background-color: white;
  }

  /* Transition to a bigger shadow on hover */
  #calc-preview-container:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }

  div#image-wrapper {
    /* This makes the image wrapper always the same height, even though the
    actual height of the image may differ slightly */
    height: 120px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  #image {
    max-width: 190px;
    max-height: 120px;

    width: auto;
    height: auto;
  }

  div#open-button {

    /* Position button at bottom right */
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

</style>
