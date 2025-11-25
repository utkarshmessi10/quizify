const fs = require('fs');
const path = require('path');

const quizzesFile = path.join(__dirname, '../data/quizzes.json');

class Quiz {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.title = data.title;
    this.description = data.description;
    this.questions = data.questions || [];
    this.duration = data.duration;
    this.difficulty = data.difficulty || 'medium';
    this.category = data.category;
    this.tags = data.tags || [];
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static getAllQuizzes() {
    try {
      const data = fs.readFileSync(quizzesFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static saveQuizzes(quizzes) {
    fs.writeFileSync(quizzesFile, JSON.stringify(quizzes, null, 2));
  }

  static async find(filter = {}) {
    const quizzes = this.getAllQuizzes();
    return quizzes.filter(quiz => {
      for (let key in filter) {
        if (quiz[key] !== filter[key]) return false;
      }
      return true;
    });
  }

  static async findById(id) {
    const quizzes = this.getAllQuizzes();
    return quizzes.find(quiz => quiz.id === id);
  }

  async save() {
    const quizzes = Quiz.getAllQuizzes();
    this.updatedAt = new Date();
    
    const existingIndex = quizzes.findIndex(quiz => quiz.id === this.id);
    if (existingIndex !== -1) {
      quizzes[existingIndex] = this;
    } else {
      quizzes.push(this);
    }
    
    Quiz.saveQuizzes(quizzes);
    return this;
  }

  async remove() {
    const quizzes = Quiz.getAllQuizzes();
    const filteredQuizzes = quizzes.filter(quiz => quiz.id !== this.id);
    Quiz.saveQuizzes(filteredQuizzes);
  }
}

module.exports = Quiz;
