exports.getLogin = (req, res) => {
	res.render('auth/login', {
		pageTitle: 'Log In',
		path: '/login',
		isAuthenticated: req.isLoggedIn,
	});
};

exports.postLogin = (req, res) => {
	req.isLoggedIn = true;
	res.redirect('/');
};
