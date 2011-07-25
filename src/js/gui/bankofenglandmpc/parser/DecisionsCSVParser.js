/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 07/07/2011
 * Time: 10:43
 * To change this template use File | Settings | File Templates.
 */

var gui = gui || {};
gui.bankofenglandmpc = gui.bankofenglandmpc || {};

(function ()
{
    var string = gui.string;

    gui.bankofenglandmpc.DecisionsCsvParser = function(members)
    {
		this.members = members;
    };

    gui.bankofenglandmpc.DecisionsCsvParser.prototype = new gui.data.BaseCsvParser();

	_.extend(gui.bankofenglandmpc.DecisionsCsvParser.prototype, {

		buildData: function (records)
        {
			// Shift off the description row - we don't need it.
            records.shift();

			var decisions = new gui.bankofenglandmpc.Decisions();
		   	var decision;

			var votes;
			var vote;
			var voteType;
			var rawVote;

			_.each(records, function(monthlyResult)
			{
				votes = monthlyResult.votes = {
					r: new gui.bankofenglandmpc.Votes(),
					h: new gui.bankofenglandmpc.Votes(),
					l: new gui.bankofenglandmpc.Votes()
				};

				// Loop through the members, assigning correct Member objects to the vote, and separate
				// the type/extent values.

				for (var i = 1; i < 10; i++)
				{
					rawVote = monthlyResult["m_" + i].split(",");
					if (rawVote.length != 2)
					{
						rawVote = [0, 0];

					}

					voteType = rawVote[1] == 0 ? votes.h : rawVote[1] > 0 ? votes.r : votes.l;
					vote = new gui.bankofenglandmpc.Vote({
						id: i,
						member: this.members.get(rawVote[0]),
						extentOfChange: rawVote[1]
					});

					voteType.add(vote);

					delete monthlyResult["m_" + i];
				}

				decision = new gui.bankofenglandmpc.Decision(monthlyResult);
				decisions.add(decision);

				if (decisions.length > 11)
				{
					decisions.remove(decisions.at(0));
				}

			}, this);

            return decisions;
        }
	});

}());
