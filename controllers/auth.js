exports.getLogin = (req, res) => {
	// const isLoggedIn = req.get('Cookie').split('=')[1].trim() === 'true';
	res.render('auth/login', {
		pageTitle: 'Log In',
		path: '/login',
		isAuthenticated: false,
	});
};

exports.postLogin = (req, res) => {
	res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
	res.redirect('/');
};
