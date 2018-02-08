var APP_MODULE = angular.module('app-framework',
	[
		'ngSanitize',
		'ui.router',
		'templates-app',
		'angular-util',
		'ui.bootstrap'
	])

	.run([
		'$rootScope',
		'$state',
		'$window',
		'Util',
		'config',
		function ($rootScope, $state, $window, Util, config) {

			$rootScope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState, fromParams) {

				if (toState.redirectTo) {
					ev.preventDefault();
					$state.go(toState.redirectTo, toParams)
				}

				$window.scrollTo(0,0);
				hideLoading();

			});

			$rootScope.$on('$stateChangeError', function(ev, toState, toParams, fromState, fromParams, error) {

				hideLoading();

				Util.handleError(error);

			});

			$rootScope.$on('$stateChangeStart', showLoading);

			$rootScope.$on('showPageLoading', showLoading);
			$rootScope.$on('hidePageLoading', hideLoading);

			function showLoading() {
				$rootScope.showPageLoading = true;
			}

			function hideLoading() {
				$rootScope.showPageLoading = false;
			}
		}
	]);