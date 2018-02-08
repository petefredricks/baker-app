APP_MODULE
	.factory('User', [
		'API',
		'$q',
		function (API, $q) {

			var currentUser = {};

			function authenticate(params, done) {
				API.post('user.authenticate', params, done);
			}

			function create(params, done) {
				API.post('user.create', params, done);
			}

			function load() {
				var deferred = $q.defer();

				API.post('user.getProfile').then(
					function (data) {
						currentUser = data;
						deferred.resolve(data);
					},
					function (err) {
						deferred.reject(err);
					});

				return deferred.promise;
			}

			return {
				authenticate: authenticate,
				create: create,
				load: load
			};
		}
	]);
