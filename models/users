const bcrypt = require('bcryptjs');

let users = [];

const createUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, username, password: hashedPassword };
    users.push(user);
    return user;
};

const findUserByUsername = (username) => {
    return users.find(user => user.username === username);
};

const findUserById = (id) => {
    return users.find(user => user.id === id);
};

module.exports = {
    createUser,
    findUserByUsername,
    findUserById
};
