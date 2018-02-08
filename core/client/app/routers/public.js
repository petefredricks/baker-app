APP_MODULE
	.config([
		'$locationProvider',
		'$stateProvider',
		'$urlRouterProvider',
		function($locationProvider, $stateProvider, $urlRouterProvider) {

			$locationProvider.html5Mode(true);

			// Catch all for unknown routes
			$urlRouterProvider.otherwise('/404');

			// error routes
			$stateProvider
				.state('404', {
					url: '/404',
					templateUrl: '/app/states/shared/404/404.html'
				});
		}
	]);
