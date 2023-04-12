const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  priority: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "canceled"],
    default: "pending",
  },
  timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password should have a minimum 6 characters"],
  },
  tasks: [taskSchema],
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) return user;
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;