APP_MODULE
	.factory('Validate', [
		function () {

			var phoneValid = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})\s*$/;
			var emailValid = /\S+@\S+\.\S+/;

			function validateEmail(email) {
				return emailValid.test(email)
			}

			function validatePhone(phoneNumber) {
				return phoneValid.test(phoneNumber)
			}

			return {
				validateEmail: validateEmail,
				validatePhone: validatePhone
			};
		}
	]);
