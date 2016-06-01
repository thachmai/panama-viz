function NameValue(name, value) { this.name = name; this.value = value; }

var panaClients = [
    new NameValue('Hong Kong', 37675),
    new NameValue('Switzerland', 34301),
    new NameValue('United Kingdom', 32682),
    new NameValue('Luxembourg', 15479),
    new NameValue('Panama', 8624),
    new NameValue('Pyprus', 7157),
    new NameValue('Uruguay', 5174),
    new NameValue('Isle of Man', 5058),
    new NameValue('Singapore', 4050),
    new NameValue('Russian Federation', 3541),
];
var panaMiddles = [
    new NameValue('Hong Kong', 2212),
    new NameValue('United Kingdom', 1924),
    new NameValue('Switzerland', 1223),
    new NameValue('Luxembourg', 405),
    new NameValue('Panama', 558),
    new NameValue('Uruguay', 298),
    new NameValue('Guatemala', 444),
    new NameValue('Brazil', 403),
    new NameValue('Ecuador', 324),
    new NameValue('United States', 617),
];
var panaHavens = [
    new NameValue('Hong Kong', 452),
    new NameValue('United Kingdom', 148),
    new NameValue('Panama', 48360),
    new NameValue('Virgin Islands, British', 113648),
    new NameValue('Bahamas', 15915),
    new NameValue('Seychelles', 15915),
    new NameValue('Niue', 9611),
    new NameValue('Samoa', 5307),
    new NameValue('British Indian Ocean Territory', 3253),
];
function dropdownHandler() {
    var value = d3.event.target.value;
    var pairs = (value === 'Clients' ? panaClients : (value === 'Middlemen' ? panaMiddles : panaHavens));
    console.log(pairs);
    var max = d3.max(pairs, p => p.value );
    var scale = d3.scale.linear().domain([0, max/2, max]).range(['#e0ecf4', '#9ebcda', '#8856a7']);

    countryColor = function (name) {
        var pair = pairs.find( p => p.name === name );
        return pair ? scale(pair.value) : '#EEE';
    };

    d3.event = null;
    redraw();
    makeScale(scale);
}
