/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 14/07/2011
 * Time: 08:33
 * To change this template use File | Settings | File Templates.
 */

var gui = gui || {};
gui.facebook = gui.facebook || {};

(function ()
{
	/*
		var params = {
			appId  : 'YOUR_APP_ID',
			status : true, // check login status
			cookie : true, // enable cookies to allow the server to access the session
			xfbml  : true  // parse XFBML
		}
	 */
	gui.facebook.Facebook = function(params)
	{
		var fbRoot = $('body').append('<div id="fb-root"></div>');

		var scope = this;
		window.fbAsyncInit = function()
		{
			FB.init(params);

			scope.getLoginStatus();
			FB.Event.subscribe('auth.login', function(response) {
				// do something with response.session
				console.log("Hello");
				console.log(response.session);
			});

			FB.Event.subscribe('auth.logout', function(response) {
				// do something with response
				console.log("Goodbye");
				console.log(response);
			});
		};

		var e = document.createElement('script');
		e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
		e.async = true;
		fbRoot.append(e);
	};

	gui.facebook.Facebook.prototype = {

		getLoginStatus:function ()
		{
			var scope = this;

			FB.getLoginStatus(function(response)
			{
				if (response.session)
				{
					// logged in and connected user, someone you know
					// Handled by event listener!
				}
				else
				{
					// no user session available, someone you dont know
					console.log("Goodbye");
					console.log(response);

					var loginLink = $('body').append('<a>Login to Facebook</a>');

					loginLink.click(function()
					{
						 scope.doLogin();
					})

				}
			});
		},

		doLogin:function ()
		{
			FB.login(function(response)
			{
				if (response.session)
				{
					// user successfully logged in
					// Handled by event listener!
				}
				else
				{
					// user cancelled login
					console.log("Goodbye");
					console.log(response);
				}
			});
		}
	}
}());

