const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersFile = path.join(__dirname, '../data/users.json');

class User {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static getAllUsers() {
    try {
      const data = fs.readFileSync(usersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  }

  static async findByEmail(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email === email);
  }

  static async findById(id) {
    const users = this.getAllUsers();
    return users.find(user => user.id === id);
  }

  async save() {
    const users = User.getAllUsers();
    
    // Hash password if it's new or modified
    if (this.password && !this.password.startsWith('$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    
    this.updatedAt = new Date();
    
    const existingIndex = users.findIndex(user => user.id === this.id);
    if (existingIndex !== -1) {
      users[existingIndex] = this;
    } else {
      users.push(this);
    }
    
    User.saveUsers(users);
    return this;
  }

  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
