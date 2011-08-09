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
	gui.bankofenglandmpc.MembersView = Backbone.View.extend({

		initialize: function()
		{
			_.bindAll(this, "render", "showMember");

			this.circles = {};

			this.model.bind("change:member", this.showMember);

			this.render();
		},

		render: function()
		{
			// Compile the template using underscore
			// Load the compiled HTML into the Backbone "el"
			this.el.html(_.template($("#template_boempc_members").html(), {}));

			var item = _.template($("#template_boempc_membername").html());

			this.model.get("members").forEach(function(member)
			{
				if (member.id != 0)
				{
					var compiled = $(item(member.toJSON()));
					compiled.data("member", member);

					var paper = Raphael(_.last(compiled.find('.memberBullet')), 18, 18);

					var circle = paper.circle(9, 9, 8);
					circle.attr({
						"fill": member.get("colour"),
						"stroke-width": 0
					});

					this.circles[member.id] = circle;

					compiled.appendTo(this.$('.memberlist'));
				}

			}, this);
		},

		events: function()
		{
			var eventObj;

			if (Modernizr.touch)
			{
				eventObj = {
					'touchstart div[class="memberName"]' : "selectMember"
				}
			}
			else
			{
				eventObj = {
					'click div[class="memberName"]': "selectMember"
				}
			}
			return eventObj;
		}(),

		selectMember: function(event)
		{
			// Button clicked, you can access the element that was clicked with event.currentTarget
			this.model.changeMember($(event.currentTarget).data('member'));
			//this.model.changeDecision(null);
		},

		showMember: function ()
		{
			this.$('.memberdetail').empty();

			var member = this.model.get("member");

			if (member.id != 0)
			{
				var memberHtml = $(_.template($("#template_boempc_memberdetail").html(), member.toJSON()));

				memberHtml.css({ opacity: 0});
				memberHtml.animate({opacity: 1}, 300);

				memberHtml.appendTo(this.$('.memberdetail'));

				if (this.selectedCircle)
				{
					this.selectedCircle.attr({
						"stroke-width": 0
					});
				}
				this.selectedCircle = this.circles[member.id];

				this.selectedCircle.attr({
					"stroke-width": 1
				});
			}

		}
	});

}());
