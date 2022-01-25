exports.getLogin = (req, res) => {
	// const isLoggedIn = req.get('Cookie').split('=')[1].trim() === 'true';
	console.log(req.session.isLoggedIn);
	res.render('auth/login', {
		pageTitle: 'Log In',
		path: '/login',
		isAuthenticated: false,
	});
};

exports.postLogin = (req, res) => {
	req.session.isLoggedIn = true;
	res.redirect('/');
};
