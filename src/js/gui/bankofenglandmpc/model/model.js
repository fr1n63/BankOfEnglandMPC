/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 05/07/2011
 * Time: 19:13
 * To change this template use File | Settings | File Templates.
 */
var gui = gui || {};
gui.bankofenglandmpc = gui.bankofenglandmpc || {};

(function ()
{
    gui.bankofenglandmpc.Model = Backbone.Model.extend({

        defaults: {

            decision: {},
            decisions: [],
            member: null,
            hoverMember: null,
            members : null
        },

        initialize: function()
		{

            this.bind("change:member", function(){
                var selectedMember = this.get("member");
            });
            this.bind("change:decision", function(){
                var selectedDecision = this.get("decision");
            });
            this.bind("change:hoverMember", function(){
                var selectedHoverMember = this.get("hoverMember");
            });
        },

        changeMember: function( member ){
            this.set({ member: member });
        },

        changeHoverMember: function( member ){
            this.set({ hoverMember: member });
        },

        changeDecision: function( decision ){
            this.set({ decision: decision });
            this.set({ hoverMember: null });
        },

        setMembers: function( members )
		{
            this.set({ members: members });
        },

        setDecisions: function( decisions )
		{
            this.set({ decisions: decisions });
        }
    });


	gui.bankofenglandmpc.Vote = Backbone.Model.extend({
    });

    gui.bankofenglandmpc.Votes = Backbone.Collection.extend({

		model: gui.bankofenglandmpc.Vote,

		comparator: function(vote)
		{
		  return Number(vote.get("member").get("seatID")) - (Number(vote.get("extentOfChange")) * 200);
		}
    });

	gui.bankofenglandmpc.Member = Backbone.Model.extend({
		initialize: function( )
		{
			this.id = this.attributes.memberID;
		}
    });

    gui.bankofenglandmpc.Members = Backbone.Collection.extend({

		model: gui.bankofenglandmpc.Member,

		comparator: function(member)
		{
		  return -Number(member.get("memberID")) + (Number(member.get("seatID")) * 200);
		}
    });

	gui.bankofenglandmpc.Decision = Backbone.Model.extend({

    });

    gui.bankofenglandmpc.Decisions = Backbone.Collection.extend({

		model: gui.bankofenglandmpc.Decision
    });
}());