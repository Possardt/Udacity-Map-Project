var map;
var pizzaPlaces = [
    {title: 'Randy\'s',
    position: {lat: 41.7656821, lng : -72.7151063},
    id: 'RandysOne' }
];

function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.7656821, lng : -72.7151063},
        zoom: 11
    });
    for(var i = 0; i < pizzaPlaces.length; i++){
        new google.maps.Marker({
            map: map,
            position: pizzaPlaces[i].position,
            title: pizzaPlaces[i].title,
            animation: google.maps.Animation.DROP,
            id: pizzaPlaces[i].id
        });
    }
}