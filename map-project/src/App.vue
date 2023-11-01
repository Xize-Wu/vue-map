<template>
  <div>
    <h1>Google Map App</h1>
    <div>
      <div id="map" style="width: 100%; height: 400px;"></div>
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
        query: 'Arsenal FC London',
        fields: ['name', 'geometry'],
      },
    };
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
      this.service.findPlaceFromQuery(this.request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          for (let i = 0; i < results.length; i++) {
            this.createMarker(results[i]);
          }

          this.map.setCenter(results[0].geometry.location);

          this.saveMarkers();
        }
      });
    },
    createMarker(place) {
      if (!place.geometry || !place.geometry.location) return;

      const marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
      });

      marker.place = place;

      this.markers.push(marker);
    },

    saveMarkers() {
      console.log("Auto-triggered saveMarkers");
      console.log(this.markers);
      console.log("Request object:");
      console.log(this.request);
    },
  },
};
</script>