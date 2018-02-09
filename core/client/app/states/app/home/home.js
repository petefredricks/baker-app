APP_MODULE
	.controller('AppHomeCtrl', [
		'$scope',
		'$state',
		'Validate',
		'User',
		function ($scope, $state, Validate, User) {

			$scope.login = {};

			$scope.checkNumber = function() {

				$scope.$emit('showPageLoading');
				$scope.errors = {};

				var phoneNumberValue = $scope.$eval('login.phone');

				if (!phoneNumberValue || !Validate.validatePhone(phoneNumberValue)) {
					$scope.errors['login.phone'] = 'Phone number is invalid';
				}

				if (!_.isEmpty($scope.errors)) {
					$scope.$emit('hidePageLoading');
					return;
				}

				User.authenticate($scope.login, function(err, data) {
					if (err) {

						if (err === '[BadParams] user does not exist') {
							$state.go('app.register', $scope.login);
							return;
						}

						if (err === '[Misc] check-in too quickly') {
							$state.go('app.dashboard', { failedCheckIn: true });
							return;
						}

						$scope.errorMessage = err;
						$scope.$emit('hidePageLoading');
					}
					else {
						$state.go('app.dashboard');
					}
				});
			};


		}
	]);
