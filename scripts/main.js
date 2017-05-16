var map;
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.7656821, lng : -72.7151063},
        zoom: 11
    });

    var marker = new google.maps.Marker({
        map: map,
        position: {lat: 41.7956603, lng: -72.5491068},
        title: "Randy's Wooster St. Pizza",
        animation: google.maps.Animation.BOUNCE,
        id: "Randy's"
    });
}