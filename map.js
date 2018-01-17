var markers = [];

function initMap() {
    var defaultPosition = {lat: -16.7022998021961, lng: -49.26475524902344};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: defaultPosition
    });    

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        map.setCenter(pos);
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            draggable: true
        });
        markers.push(marker);

        fillLocationFields(pos);
    
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    map.addListener('click', event => {
        placeMarkerAndPanTo(event.latLng, map);
        fillLocationFields({lat: event.latLng.lat(), lng: event.latLng.lng()});
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
      });
      
}
function placeMarkerAndPanTo(latLng, map) {
    clearMarker(null);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
    markers.push(marker);
    map.panTo(latLng);
}

function clearMarker(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
