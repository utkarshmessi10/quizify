const fs = require('fs');
const path = require('path');

const attemptsFile = path.join(__dirname, '../data/attempts.json');

class Attempt {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.user = data.user;
    this.quiz = data.quiz;
    this.answers = data.answers || [];
    this.score = data.score;
    this.maxScore = data.maxScore;
    this.totalQuestions = data.totalQuestions;
    this.timeSpent = data.timeSpent;
    this.submittedAt = data.submittedAt || new Date();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static getAllAttempts() {
    try {
      const data = fs.readFileSync(attemptsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static saveAttempts(attempts) {
    fs.writeFileSync(attemptsFile, JSON.stringify(attempts, null, 2));
  }

  static async find(filter = {}) {
    const attempts = this.getAllAttempts();
    return attempts.filter(attempt => {
      for (let key in filter) {
        if (attempt[key] !== filter[key]) return false;
      }
      return true;
    });
  }

  static async findById(id) {
    const attempts = this.getAllAttempts();
    return attempts.find(attempt => attempt.id === id);
  }

  async save() {
    const attempts = Attempt.getAllAttempts();
    this.updatedAt = new Date();
    
    const existingIndex = attempts.findIndex(attempt => attempt.id === this.id);
    if (existingIndex !== -1) {
      attempts[existingIndex] = this;
    } else {
      attempts.push(this);
    }
    
    Attempt.saveAttempts(attempts);
    return this;
  }
}

module.exports = Attempt;
