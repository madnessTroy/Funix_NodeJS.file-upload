const User = require('../models/user');

exports.getLogin = (req, res) => {
	res.render('auth/login', {
		pageTitle: 'Log In',
		path: '/login',
		isAuthenticated: false,
	});
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		isAuthenticated: false,
	});
};

exports.postLogin = (req, res) => {
	User.findById('61e581c3c10d8245f7e46d29')
		.then((user) => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save((err) => {
				res.redirect('/');
			});
		})
		.catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				return res.redirect('/signup');
			}
			const user = new User({ email, password, cart: { items: [] } });
			return user.save();
		})
		.then(() => {
			res.redirect('/login');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postLogout = (req, res) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};
