<template>
  <div>
    <h1>Google Map App</h1>
    <div>
      <div>
        <input v-model="customQuery" placeholder="Name of Location" @keyup.enter="searchCustomQuery"/>
        <button @click="searchCustomQuery">Search</button>
      </div>
      <div id="map" style="width: 100%; height: 400px;"></div>
    </div>

    <div>
      <h2>Search History</h2>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Index</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(marker, index) in markers" :key="index">
            <td>
              <input type="checkbox" v-model="selectedMarkers" :value="marker" />
            </td>
            <td>{{ index + 1 }}</td>
            <td>{{ marker.query }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <button @click="prevPage" :disabled="currentPage === 1">←</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">→</button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      service: null,
      infowindow: null,
      markers: [],
      request: {
        query: '',
        fields: ['name', 'geometry'],
      },
      customQuery: '', // Data property for custom query input
      selectedMarkers: [], // Data property for selected markers
      currentPage: 1, // Data property for current page
      pageSize: 10, // Data property for the number of records per page
    };
  },
  computed: {
  displayedMarkers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.markers.slice(startIndex, endIndex);
  },
  totalPages() {
    return Math.ceil(this.markers.length / this.pageSize);
  },
},

  mounted() {
    window.initMap = this.initMap;

    // Error handler needed!
    if (typeof google !== 'undefined') {
      this.initMap();
      console.log("Fuiyoh! You have a functional Google Map API!");
    } else {
      console.log("Haiyaa... Google Map API has not been loaded. Is your API key valid?");
    }
  },
  methods: {
    initMap() {
      const sydney = new google.maps.LatLng(-33.867, 151.195);

      this.infowindow = new google.maps.InfoWindow();
      this.map = new google.maps.Map(this.$el.querySelector('#map'), {
        center: sydney,
        zoom: 15,
      });

      this.service = new google.maps.places.PlacesService(this.map);

    },
    createMarker(place) {
      if (!place.geometry || !place.geometry.location) return;

      const position = place.geometry.location;
      const marker = new google.maps.Marker({
        map: this.map,
        position: position,
      });

      marker.place = place;

      const markerInfo = {
        latitude: position.lat(),
        longitude: position.lng(),
        query: this.request.query,
      };

      this.markers.push(markerInfo);
    },
    searchCustomQuery() {
      // Set the request query to the customQuery value
      this.request.query = this.customQuery;

      // Trigger a new search with the custom query
      this.service.findPlaceFromQuery(this.request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          for (let i = 0; i < results.length; i++) {
            this.createMarker(results[i]);
          }

          this.map.setCenter(results[0].geometry.location);

          this.saveMarkers();
          this.customQuery = '';
        }
      });
    },

    saveMarkers() {
      console.log("Auto-triggered saveMarkers");
      console.log(this.markers);
    },
  },
};
</script>