APP_MODULE

	.directive('loading', [function() {
		return {
			replace: true,
			scope: {
				loading: '='
			},
			templateUrl: '/app/components/loading/loading.html',
			link: function(scope, element) {

				scope.$watch('loading', function(val) {
					element.toggleClass('ng-hide', !val);
				});

			}
		}
	}]);