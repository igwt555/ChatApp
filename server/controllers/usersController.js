const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) return res.json({ msg: 'Username already exists', status: false });
        const emailCheck = await User.findOne({ email });
        if (emailCheck) return res.json({ msg: 'Email already exists', status: false });
        const hashedPwd = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPwd,
        });
        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.json({ msg: 'Incorrect username or password', status: false });
        const isPwdValid = await bcrypt.compare(password, user.password);
        if (!isPwdValid) return res.json({ msg: 'Incorrect username or password', status: false });
        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (ex) {
        next(ex);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            'email',
            'username',
            'avatarImage',
            '_id',
        ]);
        return res.json(users);
    } catch (ex) {
        next(ex);
    }
}

module.exports.addChatUser = async (req, res, next) => {
    try {
        if (User.find({ chatUserList: { $elemMatch: { $eq: req.body.addUser } } })) {
            return res.json({status: true, notNew: true});
        }
        User.updateOne(
            { username: req.body.currentUser },
            { $addToSet: { chatUserList: [req.body.addUser] } },
            (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Adding User successful!');
                }
            }
        )
        return res.json({ status: true });
    } catch (ex) {
        next(ex);
    }
}
