/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 05/07/2011
 * Time: 16:55
 * To change this template use File | Settings | File Templates.
 */

var gui = gui || {};
gui.bankofenglandmpc = gui.bankofenglandmpc || {};

(function ()
{
    gui.bankofenglandmpc.HeaderView = Backbone.View.extend({

        initialize: function()
        {
			_.bindAll(this, "render", "showDecision");
			this.model.bind("change:decision", this.showDecision);

            // Set the variables

			var date = new Date();
			this.defaultVariables = {
                title: "Bank of England Members",
                description: "Some description copy about the interactive",
                month: date.getMonthName(),
                year: date.getFullYear(),
                article_url: ""
            };

            this.render(this.defaultVariables);
        },

        render: function(variables)
        {
            // Compile the template using underscore
            // Load the compiled HTML into the Backbone "el"
            var headerHtml = this.el.html(_.template($("#template_boempc_header").html(), variables));

			headerHtml.css({ opacity: 0});
			headerHtml.animate({opacity: 1}, 300);
        },

		showDecision:function()
		{
			var decision = this.model.get("decision");
			var variables = (decision) ? decision.toJSON() : this.defaultVariables;
			if (decision)
			{
				variables.title = decision.get("result") + " at " + decision.get("new_rate") + "%";
			}
            this.render(variables);
		}
    });

}());
