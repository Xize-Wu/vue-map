<template>
  <h1>Accuenergy Code Test - Aster Wu</h1>
  <GoogleMap
    :api-key= apiKey
    style="width: 75%; height: 500px"
    :center="center"
    :zoom="15"
  >
    <Marker :options="{ position: center }" />
  </GoogleMap>
</template>

<script>
import { defineComponent } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";



export default defineComponent({
  components: { GoogleMap, Marker },
  setup() {
    const apiKey = import.meta.env.VUE_APP_GOOGLE_MAPS_API_KEY;

    const center = { lat: 43.793191, lng: -79.3323836 };

    return { center, apiKey };
  },
});
</script>