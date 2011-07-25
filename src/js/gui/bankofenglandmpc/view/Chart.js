/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 13/07/2011
 * Time: 18:45
 * To change this template use File | Settings | File Templates.
 */
var gui = gui || {};
gui.bankofenglandmpc = gui.bankofenglandmpc || {};

(function ()
{
	//returns an array of numbers from an array of strings
	gui.bankofenglandmpc.Chart = function (elem, paddingLeft, paddingRight)
	{
		this.elem = elem;
		this.$ = $(elem);
		this.paddingLeft = paddingLeft || 0;
		this.paddingRight = paddingRight || 0;
		this.width = this.$.width();
		this.height = this.$.height();
		this.stepSize = 10;

		this.paper = Raphael(this.elem, this.width, this.height);
	};

	gui.bankofenglandmpc.Chart.prototype = {
		plot: function (data, minY, maxY)
		{
			if (data.length < 2)
			{
				return;
			}

			this.data = data;

			var yRange = maxY - minY;
			var yMultiplier = this.height / yRange;

			this.stepSize = (this.width - this.paddingLeft - this.paddingRight) / (data.length - 1);
			this.midPointY =  (yRange * 0.5) + minY;

			var pathArray = [];

			var xPos;
			var yPos;

			var markerLine;

			_.each(data, function(value)
			{
				xPos = this.stepSize * Number(value[0]) + this.paddingLeft;
				yPos = this.height - ((Number(value[1]) - minY) * yMultiplier);
				pathArray.push("L" + xPos + " " + yPos);

				this.paper.path("M" + xPos + " 0L" + xPos + " " + this.height).attr({
							"stroke":"#CCCCCC",
							"stroke-width" : 1,
							"stroke-dasharray" : "- "
						});

			}, this);

			pathArray[0] = pathArray[0].replace("L", "M");

			var line = this.paper.path(pathArray.join("")).attr({
						stroke:"#666666"
					});

			this.renderAxis(minY, maxY);

			return this;
		},

		renderAxis:function(minY, maxY)
		{

			var max = this.paper.text(0, 0, this.formatAxisLabel(maxY.toString())).attr({
				"text-anchor":"start",
				"font-size":14,
				"fill": "#666666"
			});

			max.attr({"y" : max.getBBox().height * 0.5});

			var min = this.paper.text(0, 0, this.formatAxisLabel(minY.toString())).attr({
				"text-anchor":"start",
				"font-size":14,
				"fill": "#666666"
			});

			min.attr({"y" : this.height - min.getBBox().height * 0.5});
		},

		formatAxisLabel: function (value)
		{
			return (value == 0) ? value.toString() : value.toString() + "%";
		},

		highlight:function (decision, index)
		{
			if (!this.highlightBox)
			{
				this.highlightBox = this.paper.rect(0, 1, this.paddingLeft * 2 - 2, this.height - 2).attr({
							"stroke":"#333333",
							"stroke-width" : 1,
							"stroke-dasharray" : "- ",
							"x": (index * this.stepSize) + 1,
							"opacity": 0
						});

				this.label = this.paper.text(0, 0, "0%").attr({
					"font-size":12,
					"fill": "#666666",
					"y":20
				});
			}

			var scope = this;

			if (decision)
			{
				 this.highlightBox.animate({
						"x": (index * this.stepSize) + 1,
						"opacity": 1
					}, 500, "<>").onAnimation(function()
					{
						var yValue = scope.data[Math.round((this.attrs.x / scope.stepSize))][1];
						scope.label.attr({
							"text": yValue + "%",
							"x" : (this.attrs.x + scope.paddingLeft),
							"y" : (yValue < scope.midPointY) ? scope.height * 0.3 : scope.height * 0.7
						});
					});
				this.label.animateWith(this.highlightBox, {
						"opacity": 1
					}, 500);
			}
			else
			{
				this.highlightBox.animate({
						"opacity": 0
					}, 500);
				this.label.animateWith(this.highlightBox, {
						"opacity": 0
					}, 500);
			}

		}

	}

}());