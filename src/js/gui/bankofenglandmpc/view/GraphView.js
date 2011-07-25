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
    gui.bankofenglandmpc.GraphView = Backbone.View.extend({

        initialize: function()
        {
            _.bindAll(this, "render", "showDecision");

			this.model.bind("change:decision", this.showDecision);

            this.render();
        },

        render: function()
        {
            // Compile the template using underscore
            // Load the compiled HTML into the Backbone "el"
            this.el.html(_.template($("#template_boempc_graph").html(), {}));

			var d1 = [];

			var i = 0;
			this.model.get("decisions").forEach(function(decision)
			{
				  d1.push([i, decision.get("new_rate")]);
				i++;
			}, this);

			this.chart = new gui.bankofenglandmpc.Chart(this.$('.graphPanel')[0], 20, 20).plot(d1, 0, 2);
        },

		showDecision: function ()
		{
			var decision = this.model.get("decision");

			var index = this.model.get("decisions").indexOf(this.model.get("decision"));

			this.chart.highlight(decision, index);

		}
    });

}());
