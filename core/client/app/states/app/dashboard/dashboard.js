APP_MODULE
	.controller('AppDashboardCtrl', [
		'$scope',
		'$stateParams',
		'currentUser',
		function ($scope, $stateParams, currentUser) {

			$scope.currentUser = currentUser;

			if ($stateParams.failedCheckIn) {
				alert('No points earned: It has not been 5 minutes since last check-in.')
			}

		}
	]);
