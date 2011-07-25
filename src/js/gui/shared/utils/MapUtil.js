/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 30/06/2011
 * Time: 12:19
 * To change this template use File | Settings | File Templates.
 */

var gui = gui || {};
gui.map = gui.map || {};

(function ()
{
    var guiArray = gui.array;

    //takes a placemark (in string format) from the kml and returns a lat lng array
    gui.map.parse_lat_lng_string = function (placemark)
    {
        return guiArray.numArray(placemark["Point"]["coordinates"].split(',', 2));
    };

    // Sets the map value of each layer item supplied in an array to supplied map
    gui.map.addGoogleMapLayers = function(layers, map)
    {
        _.each(layers, function (layer)
        {
            layer.setMap(map);
        });
    };

    // Sets the map value of each layer item supplied in an array to null
    gui.map.clearGoogleMapLayers = function(layers)
    {
        _.each(layers, function (layer)
        {
            layer.setMap(null);
        });
    };

    // Clears the maps layers and empties the array when done
    gui.map.deleteGoogleMapLayers = function(layers)
    {
        gui.map.clearGoogleMapLayers(layers);
        layers.length = 0;
    };

}());