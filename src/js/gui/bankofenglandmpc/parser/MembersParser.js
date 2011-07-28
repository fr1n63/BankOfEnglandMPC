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

    gui.bankofenglandmpc.MembersCsvParser = function()
    {
    };

    gui.bankofenglandmpc.MembersCsvParser.prototype =
	{

		parse: function (records)
        {
            var members = new gui.bankofenglandmpc.Members();
			_.each(records, function(record)
			{
				 members.add(new gui.bankofenglandmpc.Member(record));
			});

            return members;
        }

	};

}());
