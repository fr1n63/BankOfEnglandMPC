/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 30/06/2011
 * Time: 12:19
 * To change this template use File | Settings | File Templates.
 */

var gui = gui || {};
gui.array = gui.array || {};

(function ()
{
    //returns an array of numbers from an array of strings
    gui.array.numArray = function (string_array)
    {
        var num_array = [];
        for (var i = 0; i < string_array.length; i++)
        {
            num_array.push(Number(string_array[i]));
        }
        return num_array ;
    };

}());