APP_MODULE

	.factory('API', [
		'$q',
		'$http',
		'$timeout',
		'Util',
		'config',
		function($q, $http, $timeout, Util, config) {

			var apiHost = config.platformUrl;
			var cache = {};

			return {
				post: function(method, params, done) {
					var url = apiHost + '/rpc';

					if (typeof params === 'function') {
						done = params;
						params = undefined;
					}

					if (typeof done !== 'function') {
						done = angular.noop();
					}

					if (config.debug) {
						url += '?' + method;
					}

					var httpConfig = {
						withCredentials: true
					};

					var wrapper = Util.rpcWrapper(method, params);
					var request = $http.post(url, wrapper, httpConfig);

					return Util.responseHandler(request, done);
				},

				postWithCache: function(method, params, done) {

					var deferred = $q.defer();
					var cached = cache[method];

					if (cached) {

						if (typeof params === 'function') {
							done = params;
						}

						// call the callback if there is one
						done && done(null, cached);

						// resolve the deferred after the promise is returned
						$timeout(function() {
							deferred.resolve(cached);
						});

						return deferred.promise;

					}

					return this.post.apply(this, arguments).then(
						function(result) {
							cache[method] = result;
							return result;
						});

				}
			};
		}
	]);

