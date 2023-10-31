import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.config.productionTip = false
dotenv.config();
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;


const app = createApp(App);
app.use(VueGoogleMaps, {
  load: {
    key: googleMapsApiKey,
    libraries: 'places',
  }
});
app.mount('#app');
