APP_MODULE
	.controller('AppRegisterCtrl', [
		'$scope',
		'$state',
		'$stateParams',
		'Validate',
		'User',
		function ($scope, $state, $stateParams, Validate, User) {

			$scope.register = {};

			if ($stateParams.phone) {
				$scope.register.phone = $stateParams.phone;
			}

			$scope.create = function() {

				$scope.$emit('showPageLoading');
				$scope.errors = {};

				var emailValue = $scope.$eval('register.email');
				var phoneNumberValue = $scope.$eval('register.phone');

				var validateField = [
					'register.nameFirst',
					'register.nameLast'
				];

				_.each(validateField, function(currentField) {
					if (!$scope.$eval(currentField)) {
						$scope.errors[currentField] = true;
					}
				});

				if (!emailValue || !Validate.validateEmail(emailValue)) {
					$scope.errors['register.email'] = 'Email is invalid';
				}

				if (!phoneNumberValue || !Validate.validatePhone(phoneNumberValue)) {
					$scope.errors['register.phone'] = 'Phone number is invalid';
				}

				if (!_.isEmpty($scope.errors)) {
					$scope.$emit('hidePageLoading');
					return;
				}

				User.create($scope.register, function(err, data) {
					if (err) {
						$scope.errorMessage = err;
						$scope.$emit('hidePageLoading');
					}
					else {
						$state.go('app.dashboard', data);
					}
				});
			};
		}
	]);
