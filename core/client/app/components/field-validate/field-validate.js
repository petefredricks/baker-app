APP_MODULE

	.directive('fieldValidate', [function() {

		return {
			restrict: 'A',
			link: function(scope, element, attrs) {

				var modelName = attrs['ngModel'];
				var errorMessage = $('<div>').addClass('error-message').insertAfter(element);

				scope.$watch('errors["' + modelName + '"]', function(val) {

					if (val === true) {
						val = element.prev('label').text() + ' is required';
					}

					errorMessage[0].innerHTML = val;

					element.parent().toggleClass('validation-error', !!val);

				});
			}
		}

	}]);