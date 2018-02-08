APP_MODULE
	.config([
		'$stateProvider',
		function($stateProvider) {

			// ROUTES

			$stateProvider
				.state('app', {
					abstract: true,
					templateUrl: '/app/abstract/app/app.html',
					controller: 'AppCtrl'
				})

				.state('app.signup', {
					url: '/signup',
					templateUrl: '/app/states/app/signup/signup.html',
					controller: 'AppSignupCtrl'
				});
		}
	]);
