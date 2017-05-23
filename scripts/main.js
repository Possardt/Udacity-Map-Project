var map;
var markers = [];
var pizzaPlaces = [
    {name: 'Randy\'s Wooster Street Pizza',
    position: {lat: 41.7656821, lng : -72.7151063},
    id: 'RandysOne',
    stars: 3 },
    {name: 'Sgt. Pepperoni',
    position: {lat: 41.8096455, lng: -72.2637633},
    id: 'SgtPeps',
    stars: 4},
    {name: 'Frank Pepe Pizzeria Napoletana',
    position: {lat: 41.5561578, lng: -72.784267},
    id: 'FrankPepe',
    stars: 5},
    {name: 'Camille\'s Wood Fired Pizza',
    position: {lat: 41.8592744, lng: -72.3590443},
    id: 'Camille',
    stars: 4.5},
    {name: 'Blaze Pizza',
    position: {lat: 41.8038787, lng: -72.244823},
    id: 'Blaze',
    stars: 3.5} 
];

function stopBouncing(){
    for(var i = 0; i < markers.length; i++){
        markers[i].setAnimation(null);
    }
};

function populateInfoWindow(marker, infowindow){
    stopBouncing();
    if(infowindow.marker !== marker){
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.addListener('closeclick',function(){
            infowindow.marker.setAnimation(null);
            //infowindow.setMarker(null);
        });
    }
};

function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.7456421, lng : -72.5551063},
        zoom: 11
    });

    var largeInfowindow = new google.maps.InfoWindow();

    for(var i = 0; i < pizzaPlaces.length; i++){
        var marker = new google.maps.Marker({
            map: map,
            position: pizzaPlaces[i].position,
            title: pizzaPlaces[i].name,
            animation: google.maps.Animation.DROP,
            id: pizzaPlaces[i].id
        });
        markers.push(marker);
        marker.addListener('click', function(){
            populateInfoWindow(this, largeInfowindow);
        });
    }

}

function pizzaPlace(name, stars){
    var self = this;
    self.name = ko.observable(name);
    self.stars = ko.observable(stars);
};

function isMarkerShown(marker, places){
    for(var i = 0; i < places.length; i++){
        if(marker.id === places[i].id){
            return true;
        }
    }
    return false;
}

function updateMarkers(fPlaces){
    for(var i = 0; i < markers.length; i++){
        if(isMarkerShown(markers[i], fPlaces)){
            markers[i].setMap(map);
        }else{
            markers[i].setMap(null);
        }
    }
};

function PizzaMapViewModel() {
    var self = this;

    self.pizzaPlaces = ko.observableArray([
        new pizzaPlace(pizzaPlaces[0].name, pizzaPlaces[0].stars),
        new pizzaPlace(pizzaPlaces[1].name, pizzaPlaces[1].stars),
        new pizzaPlace(pizzaPlaces[2].name, pizzaPlaces[2].stars),
        new pizzaPlace(pizzaPlaces[3].name, pizzaPlaces[3].stars)
    ]);

    self.Query = ko.observable('');

    self.searchResults = ko.computed(function() {
        var q = self.Query();
        filteredPlaces = pizzaPlaces.filter(function(p){
            return p.name.toLowerCase().indexOf(q) >= 0;
        });
        updateMarkers(filteredPlaces);
        return filteredPlaces;
    });
}

ko.applyBindings(new PizzaMapViewModel());
