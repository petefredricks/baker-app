APP_MODULE
	.config([
		'$stateProvider',
		function($stateProvider) {

			// HELPERS
			var getCurrentUser = ['User', '$state', function (User, $state) {

				// request to server to get user profile
				return User.load().then(
					// success
					function(user) {
						return user;
					},
					// failure
					function() {
						return $state.go('app.home');
					});

			}];

			// ROUTES

			$stateProvider
				.state('app', {
					abstract: true,
					templateUrl: '/app/abstract/app/app.html',
					controller: 'AppCtrl'
				})

				.state('app.home', {
					url: '/',
					templateUrl: '/app/states/app/home/home.html',
					controller: 'AppHomeCtrl'
				})

				.state('app.register', {
					url: '/register',
					templateUrl: '/app/states/app/register/register.html',
					controller: 'AppRegisterCtrl',
					params: {
						phone: null
					}
				})

				.state('app.dashboard', {
					url: '/dashboard',
					templateUrl: '/app/states/app/dashboard/dashboard.html',
					controller: 'AppDashboardCtrl',
					params: {
						failedCheckIn: false
					},
					resolve: {
						currentUser: getCurrentUser
					}
				});
		}
	]);
