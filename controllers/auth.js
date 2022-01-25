exports.getLogin = (req, res) => {
	const isLoggedIn = req.get('Cookie').split('=')[1].trim();
	res.render('auth/login', {
		pageTitle: 'Log In',
		path: '/login',
		isAuthenticated: isLoggedIn,
	});
};

exports.postLogin = (req, res) => {
	res.setHeader('Set-Cookie', 'loggedIn=true');
	res.redirect('/');
};
