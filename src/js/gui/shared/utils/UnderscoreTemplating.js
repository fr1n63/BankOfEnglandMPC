/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 06/07/2011
 * Time: 10:28
 * To change this template use File | Settings | File Templates.
 */

var gui = gui || {};
gui.underscore = gui.underscore || {};

(function ()
{

    //    Apply the supplied template to the supplied div, using the contents of the supplied div as
    //    the data source - tag names are used as variables. All tags/variables should be lower case.
    //
    //    <div id="myDiv">
    //          <my_title>My Title</my_title>
    //          <my_other_var>My Value</my_other_var>
    //    </div>
    //
    //    Would apply to a template like:
    //
    //    <script type="text/template" id="myTemplate">
    //          <h1><%= my_title %></h1>
    //          <p><%= my_other_var %></p>
    //    </script>

    gui.underscore.applyTemplateFromTags = function(div, template)
    {
        var variables = {};

        $(div).children().each(function()
        {
            variables[this.tagName.toLowerCase()] = $(this).html();
        });

        try
        {
            // Compile the template using underscore
            $(div).html(_.template($(template).html(), variables));

        }
        catch(err)
        {
            alert('Attempting to apply template "' + template + '" to div "' + div + '" failed\n\nError: ' + err);
        }
    };

}());