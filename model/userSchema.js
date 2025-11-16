const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide valid email'],
    },
    password: {
        type: String,
        select: false,
    },
    role: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.is_valid_password = async function (user_password) {
    return await bcrypt.compare(user_password, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
    this.passwordResetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return this.passwordResetToken;
};

const user = mongoose.model('User', userSchema);
module.exports = user;
