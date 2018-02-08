angular.module('angular-util', [])

	.factory('Util', [
		'$rootScope',
		'$state',
		'$window',
		'$q',
		function($rootScope, $state, $window, $q) {

			var requestId = 1;

			return {
				convertTimeframe: function (timeframe) {
					var date = new Date();

					switch (timeframe) {
						case 'This Month':
							return {
								start: new Date(date.getFullYear(), date.getMonth(), 1),
								end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23,59,59,999)
							};
						case 'This Year':
							return {
								start: new Date(date.getFullYear(), 0, 1),
								end: new Date(date.getFullYear() + 1, 0, 0, 23,59,59,999)
							};
						case 'Last 30 days':
							return {
								start: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30, date.getHours(), date.getMinutes()),
								end: date
							};
						case 'Last Month':
							return {
								start: new Date(date.getFullYear(), date.getMonth() - 1, 1),
								end: new Date(date.getFullYear(), date.getMonth(), 0, 23,59,59,999)
							};
						case 'Last Year':
							return {
								start: new Date(date.getFullYear() - 1, 0, 1),
								end: new Date(date.getFullYear(), 0, 0, 23,59,59,999)
							};
						default:
							return {}
					}
				},

				removeByHashKey: function(hashKey, array) {

					if (!_.isArray(array)) {
						return;
					}

					var index = _.findIndex(
						array,
						function(item) {
							return item.$$hashKey === hashKey;
						}
					);

					array.splice(index, 1);
				},

				responseHandler: function(promise, done) {
					var self = this;
					var deferred = $q.defer();

					if (promise) {
						promise
							.success(function(data) {
								if (data.error) {
									done && done(data.error.message);
									deferred.reject(data.error.message)
								}
								else if (!data || !data.result) {
									done && done('Error with the response.');
									deferred.reject(data);
								}
								else {
									done && done(null, data.result);
									deferred.resolve(data.result);
								}
							})
							.error(function(data){
								self.handleError(data);
								done && done(data);
								deferred.reject(data);

							});
					}

					return deferred.promise;
				},

				rpcWrapper: function(method, params) {
					return {
						jsonrpc: '2.0',
						id: this.generateRequestId(),
						method: method,
						params: params || {}
					};
				},

				handleError: function (err) {

					// TODO: Add error message to login page

					switch (err) {
						case 'unauthorized':
							$state.go('public.login');
							break;
						case 'could not identify user.':
							$state.go('public.login');
							break;
						case 'must provide user id':
							$state.go('public.login', {reload: true});
							break;
					}
				},

				generateRequestId: function() {
					return ++requestId + '';
				},

				broadcast: function() {
					$rootScope.$broadcast.apply($rootScope, arguments);
				},

				objectToDate: function(obj) {
					var date = new Date();

					if (obj) {
						date.setDate(obj.day);
						date.setMonth(obj.month);
						date.setFullYear(obj.year);
						date.setHours(0,0,0,0);
					}

					return date;
				}
			};
		}]);
