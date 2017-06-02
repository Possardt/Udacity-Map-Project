var map;
var markers = [];
var pizzaPlacesOriginal = [
    {name: 'Randy\'s Wooster Street Pizza',
    position: {lat: 41.7656821, lng : -72.7151063},
    id: '17198207',
    stars: 3 },
    {name: 'Sgt. Pepperoni',
    position: {lat: 41.8096455, lng: -72.2637633},
    id: '17199083',
    stars: 4},
    {name: 'Frank Pepe Pizzeria Napoletana',
    position: {lat: 41.5561578, lng: -72.784267},
    id: '17197345',
    stars: 5},
    {name: 'Camille\'s Wood Fired Pizza',
    position: {lat: 41.8592744, lng: -72.3590443},
    id: '17199802',
    stars: 4.5},
    {name: 'Blaze Pizza',
    position: {lat: 41.8038787, lng: -72.244823},
    id: '18256728',
    stars: 3.5}
];

function stopBouncing(){
    for(var i = 0; i < markers.length; i++){
        markers[i].setAnimation(null);
    }
}

function populateInfoWindow(marker, infowindow){
    stopBouncing();
    if(infowindow.marker != marker){
        infowindow.marker = marker;
        infowindow.setContent('<h3>' + marker.title + '</h3>' + marker.zomato);
        if(marker.zomato === null){
            getZomatoRating(marker,infowindow);
            infowindow.setContent('<h3>' + marker.title + '</h3><br/><div style="text-align:center"><img src=\"loading_pizza.gif\"></div>');
        }else{
            infowindow.setContent('<h3>' + marker.title + '</h3>Zomato Rating: ' + marker.zomato);
        }
        infowindow.open(map, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.addListener('closeclick',function(){
            infowindow.marker.setAnimation(null);
        });
    }
}

//XHR call to get zomato rating that gets displayed in infowindow
function getZomatoRating(marker, iw){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + marker.id, true);
    xhr.setRequestHeader("user-key", "2513ead54fc4765f6ad315bab0284084");
    xhr.onreadystatechange = function(response){
        if(this.readyState === 4){
            if(this.status === 200){
                marker.zomato = JSON.parse(response.target.responseText).user_rating.aggregate_rating;
                iw.setContent('<h3>' + marker.title + '</h3>Zomato Rating: ' + marker.zomato);
            }else{
                alert('Unable to fetch information from Zomato.');
            }
        }
    };
    xhr.onerror = function(){
        alert('Network error occurred.');
    };
    xhr.send();
}

//Google map's init method, set in callback in script tag
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.7456421, lng : -72.5551063},
        zoom: 11
    });

    var largeInfowindow = new google.maps.InfoWindow();

    for(var i = 0; i < pizzaPlacesOriginal.length; i++){
        var marker = new google.maps.Marker({
            map: map,
            position: pizzaPlacesOriginal[i].position,
            title: pizzaPlacesOriginal[i].name,
            animation: google.maps.Animation.DROP,
            id: pizzaPlacesOriginal[i].id,
            zomato: null
        });
        markers.push(marker);
        marker.addListener('click', function(){
            populateInfoWindow(this, largeInfowindow);
        });
        marker.openInfoWindow = function(){
            populateInfoWindow(this, largeInfowindow);
        };
    }

}


//Marker utility functions
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
            markers[i].setVisible(true);
        }else{
            markers[i].setVisible(false);
        }
    }
}

function findMarker(name){
    for(var i = 0; i < markers.length; i++){
        if(markers[i].title === name){
            return markers[i];
        }
    }
}


//Knockout viewmodel setup
function PizzaPlace(name, stars){
    var self = this;
    self.name = name;
    self.stars = stars;
    self.show = ko.observable(true);
}

function PizzaMapViewModel() {
    var self = this;

    self.pizzaPlaces = ko.observableArray([
        new PizzaPlace(pizzaPlacesOriginal[0].name, pizzaPlacesOriginal[0].stars),
        new PizzaPlace(pizzaPlacesOriginal[1].name, pizzaPlacesOriginal[1].stars),
        new PizzaPlace(pizzaPlacesOriginal[2].name, pizzaPlacesOriginal[2].stars),
        new PizzaPlace(pizzaPlacesOriginal[3].name, pizzaPlacesOriginal[3].stars),
        new PizzaPlace(pizzaPlacesOriginal[4].name, pizzaPlacesOriginal[4].stars)
    ]);

    self.Query = ko.observable('');

    self.searchResults = ko.computed(function() {
        var q = self.Query();
        filteredPlaces = pizzaPlacesOriginal.filter(function(p){
            return p.name.toLowerCase().indexOf(q) >= 0;
        });
        updateMarkers(filteredPlaces);
        return filteredPlaces;
    });

    self.showInfoWindow = function(place){
        findMarker(place.name).openInfoWindow();
    };
}

ko.applyBindings(new PizzaMapViewModel());

$(document).ready(function(){
    //listener for collapsing the places menu
    $('.collapse').on('click', function(){
        $('.chev').toggleClass('rotate');
        $('.places-nav').toggleClass('move-up');
    });

    $('.places-row').on('click', function(){
        if($(window).width() < 762){
            $('.chev').toggleClass('rotate');
            $('.places-nav').toggleClass('move-up');
        }
    });
});