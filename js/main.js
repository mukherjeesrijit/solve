// Main application controller
window.App = {
  initialized: false,

  // Initialize the application
  async init() {
    if (this.initialized) return;

    try {
      console.log('Initializing Quiz App...');
      
      // Setup tab navigation
      this.setupTabNavigation();
      
      // Load questions
      await this.loadQuestions();
      
      this.initialized = true;
      console.log('Quiz App initialized successfully!');
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError('Failed to load the quiz application. Please refresh the page.');
    }
  },

  // Load questions and initialize modules
  async loadQuestions() {
    try {
      // Load questions using DataManager
      const questions = await window.DataManager.loadQuestions();
      
      if (!questions || questions.length === 0) {
        throw new Error('No questions loaded');
      }

      // Initialize quiz and table modules
      window.QuizManager.init(questions);
      window.TableManager.init(questions);
      
      console.log(`Loaded ${questions.length} questions successfully`);
      
    } catch (error) {
      console.error('Error loading questions:', error);
      throw error;
    }
  },

  // Setup tab navigation
  setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tab = e.target.getAttribute('data-tab');
        if (tab) {
          this.switchTab(tab);
        }
      });
    });

    // Setup random button
    const randomBtn = document.getElementById('random-btn');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => this.showRandomQuestion());
    }
  },

  // Show random question
  showRandomQuestion() {
    const questions = window.DataManager.getAllQuestions();
    if (questions.length === 0) {
      this.showError('No questions available for random selection.');
      return;
    }

    // Generate random index
    const randomIndex = Math.floor(Math.random() * questions.length);
    
    // Switch to quiz tab and show random question
    this.switchTab('quiz');
    
    // Update active tab button (remove active from all, don't add to random)
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.tab-btn[data-tab="quiz"]').classList.add('active');
    
    // Navigate to random question
    if (window.QuizManager) {
      window.QuizManager.goToQuestion(randomIndex);
    }

    console.log(`Showing random question: ${randomIndex + 1} of ${questions.length}`);
  },

  // Switch between tabs
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      }
    });

    // Show/hide tab content
    const quizTab = document.getElementById('quiz-tab');
    const tableTab = document.getElementById('table-tab');

    if (quizTab && tableTab) {
      quizTab.classList.toggle('active', tabName === 'quiz');
      tableTab.classList.toggle('active', tabName === 'table');
    }

    console.log(`Switched to ${tabName} tab`);
  },

  // Show error message
  showError(message) {
    const quizContent = document.getElementById("quiz-content");
    if (quizContent) {
      quizContent.innerHTML = `
        <div style="text-align: center; color: #ef4444; padding: 2rem;">
          <h3>⚠️ Error</h3>
          <p>${message}</p>
          <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Reload Page
          </button>
        </div>
      `;
    }
  },

  // Refresh data
  async refreshData() {
    try {
      console.log('Refreshing data...');
      await this.loadQuestions();
      console.log('Data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh data:', error);
      this.showError('Failed to refresh data. Please try again.');
    }
  },

  // Get app statistics
  getStats() {
    if (!window.DataManager || !window.TableManager) {
      return null;
    }

    return {
      totalQuestions: window.DataManager.getTotalQuestions(),
      tableStats: window.TableManager.getStatistics(),
      userAnswers: window.QuizManager ? Object.keys(window.QuizManager.getUserAnswers()).length : 0
    };
  }
};

// Auto-initialize when DOM is ready and MathJax is loaded
document.addEventListener('DOMContentLoaded', () => {
  // If MathJax is not configured to auto-start, start manually
  if (!window.MathJax || !window.MathJax.startup) {
    window.App.init();
  }
  // Otherwise, MathJax startup.ready will call App.init()
});

// Expose to global scope for debugging
window.App = App;