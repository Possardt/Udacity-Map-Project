var map;
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
    stars: 5}
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
            title: pizzaPlaces[i].name,
            animation: google.maps.Animation.DROP,
            id: pizzaPlaces[i].id
        });
    }
}

function pizzaPlace(name, stars){
    var self = this;
    self.name = ko.observable(name);
    self.stars = ko.observable(stars);
};

function PizzaMapViewModel() {
    var self = this;

    self.pizzaPlaces = ko.observableArray([
        new pizzaPlace(pizzaPlaces[0].name, pizzaPlaces[0].stars),
        new pizzaPlace(pizzaPlaces[1].name, pizzaPlaces[1].stars),
        new pizzaPlace(pizzaPlaces[2].name, pizzaPlaces[2].stars)
    ]);
}

ko.applyBindings(new PizzaMapViewModel());
