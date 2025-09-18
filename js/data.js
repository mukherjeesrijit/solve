// Data module for handling question data
window.DataManager = {
  questions: [],
  
  // Sample questions as fallback
  sampleQuestions: [
    {
      "id": 44,
      "topic": "Probability",
      "difficulty": "Medium",
      "questionType": "single",
      "question": "At a large university, the probability that a student takes Calculus and Statistics in the same semester is $0.0125$. The probability that a student takes Statistics is $0.125$. Find the probability that a student is taking Calculus, given that he or she is taking Statistics.",
      "options": {
        "A": "$0.0125$",
        "B": "$0.0100$",
        "C": "$0.1000$",
        "D": "$0.4500$"
      },
      "answer": "C"
    },
    {
      "id": 45,
      "topic": "Probability",
      "difficulty": "Easy",
      "questionType": "single",
      "question": "If $A$ and $B$ are two events, the probability of occurrence of either $A$ or $B$ is given as:",
      "options": {
        "A": "$P(A)+P(B)$",
        "B": "$P(A \\cup B)$",
        "C": "$P(A \\cap B)$",
        "D": "$P(A) P(B)$"
      },
      "answer": "B"
    },
    {
      "id": 46,
      "topic": "Probability",
      "difficulty": "Hard",
      "questionType": "single",
      "question": "A box contains 12 balls: 5 red, 4 blue, and 3 green. If 3 balls are drawn without replacement, what is the probability that all three balls are of different colors?",
      "options": {
        "A": "$\\frac{60}{220}$",
        "B": "$\\frac{1}{11}$",
        "C": "$\\frac{3}{11}$",
        "D": "$\\frac{60}{165}$"
      },
      "answer": "C"
    }
  ],

  // Load questions from JSON file or use sample data
  async loadQuestions() {
    try {
      console.log('Loading questions from problems.json...');
      
      try {
        const response = await fetch('problems.json');
        if (response.ok) {
          const data = await response.json();
          this.questions = data;
          console.log(`Successfully loaded ${this.questions.length} questions from problems.json`);
          return this.questions;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (fetchError) {
        console.warn('Could not load problems.json:', fetchError.message);
        console.log('Using sample data instead...');
        this.questions = this.sampleQuestions;
        return this.questions;
      }
    } catch (error) {
      console.error('Error in loadQuestions:', error);
      throw new Error(`Failed to load questions: ${error.message}`);
    }
  },

  // Get all questions
  getAllQuestions() {
    return this.questions;
  },

  // Get question by index
  getQuestionByIndex(index) {
    if (index >= 0 && index < this.questions.length) {
      return this.questions[index];
    }
    return null;
  },

  // Get question by ID
  getQuestionById(id) {
    return this.questions.find(q => q.id === id);
  },

  // Get total number of questions
  getTotalQuestions() {
    return this.questions.length;
  },

  // Validate question structure
  validateQuestion(question) {
    const required = ['id', 'topic', 'difficulty', 'question', 'options', 'answer'];
    return required.every(field => question.hasOwnProperty(field));
  },

  // Get questions by difficulty
  getQuestionsByDifficulty(difficulty) {
    return this.questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  },

  // Get questions by topic
  getQuestionsByTopic(topic) {
    return this.questions.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
  }
};