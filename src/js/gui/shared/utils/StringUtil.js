/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 30/06/2011
 * Time: 12:19
 * To change this template use File | Settings | File Templates.
 */

var gui = gui || {};
gui.string = gui.string || {};

(function ()
{
    gui.string.stripQuotes = function(data)
    {
        if (data && data.charCodeAt(0) == 34)
        {
            return data.substr(1, data.length - 2);
        }
        return data;
    };

    gui.string.trim = function(str)
    {
        if (String.trim)
        {
            return String.trim(str);
        }

        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
}());