let markers = [];

function initMap() {
    const defaultPosition = { lat: -16.7022998021961, lng: -49.26475524902344 };
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: defaultPosition
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            hideLonlatWarning();
            map.setCenter(pos);

            let marker = new google.maps.Marker({
                position: pos,
                map: map,
                draggable: true
            });
            showPickedLonlat();
            markers.push(marker);

            fillLocationFields(pos);
        });
    }

    map.addListener('click', event => {
        placeMarker(event.latLng, map);
        fillLocationFields({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });
    });
}

function placeMarker(latLng, map) {
    clearMarker(null);
    let marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
    hideLonlatWarning();
    showPickedLonlat();
    markers.push(marker);
}

function clearMarker(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}