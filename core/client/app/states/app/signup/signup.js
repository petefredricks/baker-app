APP_MODULE
	.controller('AppSignupCtrl', [
		'$scope',
		'$state',
		function ($scope, $state) {

			var phoneValid = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})\s*$/;

			$scope.login = {};

			$scope.checkNumber = function() {

				$scope.$emit('showPageLoading');
				$scope.errors = {};

				var phoneNumber = $scope.$eval('login.phone');

				if (!phoneNumber || !phoneValid.test(phoneNumber)) {
					$scope.errors['login.phone'] = 'Phone number is invalid';
				}

				if (!_.isEmpty($scope.errors)) {
					$scope.$emit('hidePageLoading');
					return;
				}

				//Order.createOrder($scope.order, function(err, data) {
				//	if (err) {
				//		$scope.$emit('hidePageLoading');
				//		$scope.processingAlerts.push({type: 'danger', msg: err});
				//		$window.scrollTo(0,0);
				//	}
				//	else {
				//		Cart.clearCart();
				//		$state.go('store.confirmation', data)
				//	}
				//});
			};


		}
	]);
