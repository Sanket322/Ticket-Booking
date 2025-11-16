const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../model/userSchema');

const catchAsync = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendMail');

const create_user_token = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1d',
    });
};

const set_token_cookie = (id, res) => {
    token = create_user_token(id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    return res.cookie('jwt', token, cookieOptions);
};

exports.register = catchAsync(async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return next(new AppError('Email and Password are mandatory', 400));
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return next(new AppError('Email already exists, please go for login.', 409));
    }

    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    set_token_cookie(user._id, res);

    return res.status(200).json({
        message: 'success',
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    if (!email || !req.body.password) {
        return next(new AppError('Email and Password are mandatory', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new AppError('Please Signup first', 401));
    }

    const is_valid_password = await user.is_valid_password(req.body.password);
    if (!is_valid_password) {
        return next(new AppError('Invalid Password', 401));
    }

    set_token_cookie(user._id, res);

    return res.status(200).json({
        message: 'success',
    });
});

exports.logout = (req, res) => {
    console.log('called');
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
    });
};

exports.forget_password = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError("User doesn't exist.", 404));
    }

    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!'), 500);
    }
});

exports.reset_password = catchAsync(async (req, res, next) => {
    const { token, password } = req.body;
    if (!password || !token) {
        return next(new AppError('Please provide password and token', 400));
    }

    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new AppError('Invalid or expired token', 400));
    }

    user.password = req.body.password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save({ validateBeforeSave: false });

    set_token_cookie(user._id, res);

    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully',
    });
});
