<template>
  <div className="map-container">
    <h1>Google Map App</h1>

      <div className="search-bar">
        <input v-model="customQuery" placeholder="Name of Location" @keyup.enter="searchCustomQuery" />
        <button @click="searchCustomQuery">Search</button>
      </div>
      <div>
        <h2>Time Zone Info</h2>
        <p>Time Zone: {{ lastMarker.timeZone }}</p>
        <p>Local Time: {{ lastMarker.localTime }}</p>
      </div>
      <div id="map"></div>


    <div>
      <h2>Search History</h2>
      <div>
        <button @click="deleteSelectedMarkers">Delete</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Index</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(marker, index) in displayedMarkers" :key="index">
            <td>
              <input type="checkbox" v-model="marker.selected" :value="marker" />
            </td>
            <td>{{ index + 1 + (currentPage -1)* 10}}</td>
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
      customQuery: '',
      currentPage: 1,
      pageSize: 10,
      lastMarker: { timeZone: '', localTime: '' },
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
      const toronto = new google.maps.LatLng(43.6532, -79.3832);

      this.infowindow = new google.maps.InfoWindow();
      this.map = new google.maps.Map(this.$el.querySelector('#map'), {
        center: toronto,
        zoom: 15,
        mapTypeId: 'roadmap', 
      });

      this.service = new google.maps.places.PlacesService(this.map);

    },
    searchCustomQuery() {
      this.request.query = this.customQuery;

      this.service.findPlaceFromQuery(this.request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          for (let i = 0; i < results.length; i++) {
            this.createMarker(results[i]);
          }

          this.map.setCenter(results[0].geometry.location);
          this.customQuery = '';
        }
      });
    },

    async createMarker(place) {
      if (!place.geometry || !place.geometry.location) return;

      const position = place.geometry.location;
      const marker = new google.maps.Marker({
        map: this.map,
        position: position,
      });

      marker.place = place;

      const { timeZone, localTime } = await this.getTimeZoneAndLocalTime(position.lat(), position.lng());

      const markerInfo = {
        latitude: position.lat(),
        longitude: position.lng(),
        query: this.request.query,
        selected: false,
      };

      this.lastMarker = { timeZone, localTime };
      this.markers.push(markerInfo);
    },

    async getTimeZoneAndLocalTime(lat, lng) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=AIzaSyBT-zccmJ_6zmyO5utOPC5b_eUBrTQL3AA`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.timeZoneId) {
            const timeZone = data.timeZoneId;
            const localTime = new Date().toLocaleString('en-US', { timeZone });
            return { timeZone, localTime };
          }
        }
      } catch (error) {
        console.error(error);
      }

      return { timeZone: '', localTime: '' };
    },


    deleteSelectedMarkers() {
      this.markers = this.markers.filter((marker) => !marker.selected);
    },

    renderTable(currentPage, pageSize) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      this.displayedMarkers = this.markers.slice(startIndex, endIndex);

      this.totalPages = Math.ceil(this.markers.length / pageSize);
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTable(this.currentPage, this.pageSize);
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.renderTable(this.currentPage, this.pageSize);
      }
    },

  },
};
</script>

<style>

button {
  background-color: #3498db;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
  max-height: 400px;
  overflow: auto;
}

th,
td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f0f0f0;
}

tr:nth-child(even) {
  background-color: #ecf0f1;
}

.map-container {
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  text-align: center;
  width: 100%;
  height: 100vh;
  padding: 20px 0;
  background-color: #F5F5DC;
  justify-content: center;
  align-items: center; 
}

.search-bar{
  display:flex;
  justify-content: center;
}

h1 {
  font-size: 28px;
  margin: 20px 0;
  color: #3498db;
}

#map{
  width: 75%;
  height: 400px;
  margin: 20px 0;
}

</style>
