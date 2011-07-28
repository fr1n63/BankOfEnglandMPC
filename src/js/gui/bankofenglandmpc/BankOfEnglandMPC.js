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
    gui.bankofenglandmpc.BankOfEnglandMPC = Backbone.View.extend({

		initialize: function ()
        {
			this.membersUrl = this.options.membersUrl;
			this.decisionsUrl = this.options.decisionsUrl;

            _.bind(this, "render", "membersLoaded");

			this.model = new gui.bankofenglandmpc.Model();

			var membersLoadedFunc = function(response, success)
			{
				this.membersLoaded(response, success);
			};
			membersLoadedFunc = _.bind(membersLoadedFunc, this);

            $.ss(this.membersUrl).send(membersLoadedFunc);

        },

		membersLoaded:function(response, success)
		{
			if (success)
			{
				var parser = new gui.bankofenglandmpc.MembersCsvParser();
				this.model.setMembers(parser.parse(response));

				var decisionsLoadedFunc = function(response, success)
				{
					this.decisionsLoaded(response, success);
				};
				decisionsLoadedFunc = _.bind(decisionsLoadedFunc, this);

				$.ss(this.decisionsUrl).send(decisionsLoadedFunc);
			}
		},

		decisionsLoaded:function(response, success)
		{
			if (success)
			{
				var parser = new gui.bankofenglandmpc.DecisionsCsvParser(this.model.get("members"));
				this.model.setDecisions(parser.parse(response));
				this.render();
			}
		},


        render: function ()
        {
            // Compile the template using underscore
            // Load the compiled HTML into the Backbone "el"
            this.el.html(_.template($("#template_boempc_baseView").html(), {}));

            new gui.bankofenglandmpc.HeaderView({
                el: $("#boempc_header"),
                model: this.model
            });

            new gui.bankofenglandmpc.MembersView({
                el: $("#boempc_members"),
                model: this.model
            });

            new gui.bankofenglandmpc.ResultsView({
                el: $("#boempc_results"),
                model: this.model
            });

            new gui.bankofenglandmpc.GraphView({
                el: $("#boempc_graph"),
                model: this.model
            });
        }

    });

}());
