const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
    let errors = { email: '', password: '' };

    if (err.code === 11000) {
        console.log(err);
        errors.email = 'This email is already registered';
        return errors;
    };
    console.log(err);
    // validate errors
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
          errors[properties.path] = properties.message;
        });
    }

    if (err.message === 'incorrect email') errors.email = 'Email not registered';
    if (err.message === 'incorrect password') errors.password = 'Incorrect Password';
    return errors;
}

const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
};

module.exports.getAuthRegister = (req, res) => {
    res.send({ titie: "hellooooo"})
    // res.render('register');
}

module.exports.postAuthRegister = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwtToken', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({user: user._id});
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
};

module.exports.getAuthLogin = (req, res) => { 
    res.render('login');
};

module.exports.postAuthLogin = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwtToken', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
};

module.exports.getAuthLogout = (req, res) => {
    res.cookie('jwtToken', '', { maxAge: 1 });
    res.redirect('/login');
};

