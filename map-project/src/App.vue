<template>
  <h1>Google Map App</h1>
  <div>
    <div id="map" style="width: 75%; height: 500px"></div>
    <input id="pac-input" ref="searchInput" type="text" placeholder="Search for a location" />
  </div>
  <GoogleMap api-key="AIzaSyBT-zccmJ_6zmyO5utOPC5b_eUBrTQL3AA" :center="center" :zoom="15">
    <Marker :options="{ position: center }" />
  </GoogleMap>
</template>


<script>
import { defineComponent, ref, onMounted } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";

export default defineComponent({
  components: { GoogleMap, Marker },
  setup() {
    const center = ref({ lat: -33.8688, lng: 151.2195 });

    onMounted(() => {
      const mapElement = document.querySelector("#map");
      const searchInputElement = document.getElementById("pac-input");
      const searchBox = new google.maps.places.SearchBox(searchInputElement);
      const markers = [];

      const map = new google.maps.Map(mapElement, {
        center: center.value,
        zoom: 13,
        mapTypeId: "roadmap",
      });

      map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInputElement);

      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        markers.forEach((marker) => {
          marker.setMap(null);
        });

        markers.length = 0;
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
          }

          const icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
          };

          markers.push(
            new google.maps.Marker({
              map,
              icon,
              title: place.name,
              position: place.geometry.location,
            })
          );

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });

        map.fitBounds(bounds);
      });
    });

    return { center };
  },
});
</script>
