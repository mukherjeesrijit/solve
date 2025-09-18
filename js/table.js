// Table module for handling problems table
window.TableManager = {
  questions: [],

  // Initialize table with questions
  init(questions) {
    this.questions = questions;
    this.populateTable();
  },

  // Populate the problems table
  populateTable() {
    const tbody = document.getElementById('problems-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    this.questions.forEach((question, index) => {
      const row = this.createTableRow(question, index);
      tbody.appendChild(row);
    });

    this.renderMath();
  },

  // Create a table row for a question
  createTableRow(question, index) {
    const row = document.createElement('tr');
    
    // ID cell
    const idCell = document.createElement('td');
    idCell.innerHTML = `<strong>#${question.id}</strong>`;
    
    // Question cell
    const questionCell = document.createElement('td');
    questionCell.className = 'table-question';
    questionCell.innerHTML = this.truncateText(question.question, 10);
    
    // Difficulty cell
    const difficultyCell = document.createElement('td');
    const difficultyBadge = document.createElement('span');
    difficultyBadge.className = `difficulty-badge difficulty-${question.difficulty.toLowerCase()}`;
    difficultyBadge.textContent = question.difficulty;
    difficultyCell.appendChild(difficultyBadge);
    
    // Topic cell
    const topicCell = document.createElement('td');
    const topicBadge = document.createElement('span');
    topicBadge.className = 'topic-badge';
    topicBadge.textContent = question.topic;
    topicCell.appendChild(topicBadge);
    
    // Actions cell
    const actionsCell = document.createElement('td');
    actionsCell.className = 'table-actions';
    
    const solveBtn = document.createElement('button');
    solveBtn.className = 'action-btn btn-solve';
    solveBtn.textContent = 'Solve';
    solveBtn.onclick = () => this.solveQuestion(index);
    
    actionsCell.appendChild(solveBtn);
    
    // Append all cells to row
    row.appendChild(idCell);
    row.appendChild(questionCell);
    row.appendChild(difficultyCell);
    row.appendChild(topicCell);
    row.appendChild(actionsCell);
    
    return row;
  },

  // Truncate text for display in table
  truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  },

  // Handle solve button click
  solveQuestion(index) {
    // Switch to quiz tab
    window.App.switchTab('quiz');
    
    // Navigate to specific question
    if (window.QuizManager) {
      window.QuizManager.goToQuestion(index);
    }
  },

  // Filter table by difficulty
  filterByDifficulty(difficulty) {
    const filteredQuestions = difficulty === 'all' ? 
      this.questions : 
      this.questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    
    this.displayFilteredQuestions(filteredQuestions);
  },

  // Filter table by topic
  filterByTopic(topic) {
    const filteredQuestions = topic === 'all' ? 
      this.questions : 
      this.questions.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
    
    this.displayFilteredQuestions(filteredQuestions);
  },

  // Display filtered questions
  displayFilteredQuestions(questions) {
    const tbody = document.getElementById('problems-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    questions.forEach((question, index) => {
      const originalIndex = this.questions.indexOf(question);
      const row = this.createTableRow(question, originalIndex);
      tbody.appendChild(row);
    });

    this.renderMath();
  },

  // Re-render MathJax for table
  renderMath() {
    if (window.MathJax && window.MathJax.typesetPromise) {
      const tbody = document.getElementById('problems-table-body');
      if (tbody) {
        MathJax.typesetPromise([tbody]).catch(console.error);
      }
    }
  },

  // Get statistics
  getStatistics() {
    const stats = {
      total: this.questions.length,
      byDifficulty: {},
      byTopic: {}
    };

    this.questions.forEach(question => {
      // Count by difficulty
      const difficulty = question.difficulty;
      stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;

      // Count by topic
      const topic = question.topic;
      stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
    });

    return stats;
  },

  // Update table with new questions
  updateQuestions(questions) {
    this.questions = questions;
    this.populateTable();
  }
};
