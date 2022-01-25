const User = require('../models/user');

exports.getLogin = (req, res) => {
	res.render('auth/login', {
		pageTitle: 'Log In',
		path: '/login',
		isAuthenticated: false,
	});
};

exports.postLogin = (req, res) => {
	User.findById('61e581c3c10d8245f7e46d29')
		.then((user) => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			res.redirect('/');
		})
		.catch((err) => console.log(err));
};

exports.postLogout = (req, res) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};
