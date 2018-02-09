APP_MODULE
	.filter('nextTime', [
		'$filter',
		function ($filter) {
			return function (input, format) {
				var dateFilter = $filter('date');
				var d = moment(input).add(5, 'minutes').toDate();
				return dateFilter(d, format);
			}
		}
	]);