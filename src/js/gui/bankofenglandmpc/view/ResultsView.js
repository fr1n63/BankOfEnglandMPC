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
	gui.bankofenglandmpc.ResultsView = Backbone.View.extend({

		initialize: function()
		{
			_.bindAll(this, "render", "renderVote", "showMember", "showHoverMember", "selectMember", "showDecision", "mouseOver", "mouseOut");

			this.circles = {};

			this.model.bind("change:member", this.showMember);
			this.model.bind("change:hoverMember", this.showHoverMember);
			this.model.bind("change:decision", this.showDecision);
			this.render();

			this.delegateEvents(this.events());
		},

		render: function()
		{
			// Compile the template using underscore
			// Load the compiled HTML into the Backbone "el"
			this.el.html(_.template($("#template_boempc_results").html(), {}));

			var item = _.template($("#template_boempc_monthtable").html());

			this.model.get("decisions").forEach(function(decision)
			{
				var fixedDecision = decision.toJSON();
				fixedDecision.change = fixedDecision.change == 0 ? "-" : fixedDecision.change + "pt";

				var compiled = $(item(fixedDecision));
				compiled.data({decision:decision});

				compiled.find('.resultLabel').addClass('bg' + fixedDecision.result);

				this.renderVote(decision.get("votes").r, 'raise').appendTo(compiled.find('.raise')[0]);
				this.renderVote(decision.get("votes").h, 'hold').appendTo(compiled.find('.hold')[0]);
				this.renderVote(decision.get("votes").l, 'lower').appendTo(compiled.find('.lower')[0]);


				compiled.appendTo(this.$('.months'));

			}, this);

		},

		renderVote: function(votes, type)
		{
			var ul = $('<ul></ul>');

			votes.forEach(function(vote)
			{
				var member = vote.get("member");
				var li = $('<li></li>').data({member:member});

				var circleArray = this.circles[member.id] ? this.circles[member.id] : this.circles[member.id] = [];

				var paper = Raphael(li[0], 20, 20);

				var icon;

				switch (type)
				{
					case 'raise':
						icon = paper.path("M1 17L10 3L19 17L1 17");
						break;
					case 'hold':
						icon = paper.circle(10, 10, 9);
						break;
					case 'lower':
						icon = paper.path("M1 3L10 17L19 3L1 3");
						break;
				}

				icon.attr({
					"fill": member.get("colour"),
					"stroke-width": 0
				});

				circleArray.push(icon);

				ul.append(li);
			}, this);

			return ul;
		},

		events: function()
		{
			var eventObj;

			if (Modernizr.touch)
			{
				eventObj = {
					"touchstart .month" : "selectMonth",
					"touchstart li" : "selectMember"
				}
			}
			else
			{
				eventObj = {
					"click .month" : "selectMonth",
					"mouseenter .month" : "mouseOver",
					"mouseleave .month" : "mouseOut",
					"click li" : "selectMember"
				}
			}
			return eventObj;
		},

		selectMember: function(event)
		{
			this.model.changeDecision($(event.currentTarget).closest('.month').data('decision'));
			this.model.changeMember($(event.currentTarget).data('member'));
			this.model.changeHoverMember($(event.currentTarget).data('member'));

			event.stopPropagation();
		},

		mouseOver: function(event)
		{
			var month = $(event.currentTarget).closest('.month');
			month.prepend('<div class="over"></div>');
		},

		mouseOut: function(event)
		{
			this.$('.over').remove();
		},

		selectMonth: function(event)
		{
			// Button clicked, you can access the element that was clicked with event.currentTarget
			this.model.changeDecision($(event.currentTarget).data('decision'));

		},

		showMember: function ()
		{
			if (this.model.get("member") != this.model.get("hoverMember"))
			{
				this.$('.callout').remove();
			}

			var member = this.model.get("member");

			if (this.memberArray)
			{
				_.each(this.memberArray, function(circle)
				{
					circle.attr({
						"stroke-width": 0
					});
				});
			}

			this.memberArray = this.circles[member.id];

			if (member.id != 0)
			{
				_.each(this.memberArray, function(circle)
				{
					circle.attr({
						"stroke-width": 1
					});
				})
			}
		},

		showHoverMember: function ()
		{
			this.$('.callout').remove();

			var member = this.model.get("hoverMember");
			var decision = this.model.get("decision");

			if (member)
			{
				var tooltip = new gui.bankofenglandmpc.ResultsToolTip(this.el, this.currentMonth, member, decision);
				tooltip.render();
			}

		},

		showDecision: function ()
		{
			this.$('.callout').remove();

			var model = this.model;
			var decision = model.get("decision");

			var firstTime = true;

			if (this.currentMonth)
			{
				this.currentMonth.animate({opacity:0.5}, 300);

				if (!Modernizr.touch)
				{
					this.currentMonth.find('li').unbind('mouseenter').unbind('mouseleave');
				}
				firstTime = false;
			}

			_.each(this.$('.month'), function(month)
			{
				var $month = $(month);

				if ($month.data('decision') == decision)
				{
					this.currentMonth = $month;

					$month.animate({opacity:1}, 300);
					if (!Modernizr.touch)
					{
						$month.find('li').mouseenter(function(event)
								{
									model.changeHoverMember($(event.currentTarget).data('member'));
								}).mouseleave(function(event)
								{
									model.changeHoverMember(null);
								});
					}
				} else if (firstTime)
				{
					$month.animate({opacity:0.5}, 300);
				}
			}, this);
		}
	});

	gui.bankofenglandmpc.ResultsToolTip = function(container, target, member, decision)
	{
		this.container = container;
		this.target = target;
		this.member = member;
		this.decision = decision;
	};

	gui.bankofenglandmpc.ResultsToolTip.prototype =
	{
		render: function()
		{
			var variables;

			var direction = (this.target.position().left > 400) ? "left" : "right";

			var xPos = this.target.position().left + ((direction == "left") ? -130 : this.target.width());
			var yPos;

			if (this.member.id == 0)
			{
				variables = {
					name:"No member information available",
					extentOfChange:""
				};
				yPos = this.target.height() * 0.5;

			}
			else
			{
				var votes = this.decision.get('votes');
				var vote = votes.r.get(this.member.id) || votes.h.get(this.member.id) || votes.l.get(this.member.id);
				var voteAmount = vote.get('extentOfChange');

				var voteLabel;
				if (voteAmount == 0)
				{
					voteLabel = "voted to hold";
				}
				else if (voteAmount > 0)
				{
					voteLabel = "voted for a raise of " + voteAmount + "%";
				}
				else
				{
					voteLabel = "voted for a lowering of " + voteAmount + "%";
				}
				variables = {
					name:this.member.get('name'),
					extentOfChange:voteLabel
				};

				_.each(this.target.find('li'), function(li)
				{
					var $li = $(li);

					if ($li.data('member') == this.member)
					{
						yPos = $li.position().top;
					}

				}, this);
			}

			var item = _.template($("#template_boempc_callout").html(), variables);

			var $item = $(item);
			$item.css({opacity:0, top:yPos, left:xPos + ((direction == "left")? -10 : 10)});
			$item.addClass(direction);
			$item.animate({left:xPos, opacity:1}, 300);

			var paper = Raphael($item.find('.arrow')[0], 10, 18);
			var arrowPath = (direction == "left") ? "M10 9L0 0L0 18L10 9" : "M0 9L10 0L10 18L0 9";
			var arrow = paper.path(arrowPath);
			arrow.attr({
				"fill": "#666666",
				"stroke-width": 0
			});

			$item.appendTo(this.container);

		}
	};
}());
