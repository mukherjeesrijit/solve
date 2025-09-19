// Quiz module for handling quiz functionality
window.QuizManager = {
  currentQuestionIndex: 0,
  userAnswers: {},
  questions: [],

  // Initialize quiz
  init(questions) {
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.setupEventListeners();
    this.updateTotalQuestions();
    this.renderCurrentQuestion();
    this.showNavigation();
  },

  // Setup event listeners
  setupEventListeners() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
      prevBtn.onclick = () => this.previousQuestion();
    }
    if (nextBtn) {
      nextBtn.onclick = () => this.nextQuestion();
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isQuizActive()) {
        if (e.key === 'ArrowLeft') {
          this.previousQuestion();
        } else if (e.key === 'ArrowRight') {
          this.nextQuestion();
        }
      }
    });
  },

  // Check if quiz tab is active
  isQuizActive() {
    const quizTab = document.getElementById('quiz-tab');
    return quizTab && quizTab.classList.contains('active');
  },

  // Update total questions display
  updateTotalQuestions() {
    const totalElement = document.getElementById('total-q');
    if (totalElement) {
      totalElement.textContent = this.questions.length;
    }
  },

  // Show navigation
  showNavigation() {
    const navigation = document.getElementById('navigation');
    if (navigation) {
      navigation.style.display = 'flex';
    }
  },

  // Render current question
  renderCurrentQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    if (!question) return;

    const quizContent = document.getElementById("quiz-content");
    if (!quizContent) return;

    const card = this.createQuestionCard(question);
    quizContent.innerHTML = '';
    quizContent.appendChild(card);

    this.updateNavigation();
    this.renderMath();
  },

  // Create question card HTML
  createQuestionCard(question) {
    const card = document.createElement("div");
    card.className = "question-card";

    // Header
    const header = this.createQuestionHeader(question);
    card.appendChild(header);

    // Question text
    const questionText = document.createElement("div");
    questionText.className = "question-text";
    questionText.innerHTML = question.question;
    card.appendChild(questionText);

    // Options
    const options = this.createOptions(question);
    card.appendChild(options);

    // Action buttons
    const actionButtons = this.createActionButtons(question);
    card.appendChild(actionButtons);

    return card;
  },

  // Create question header
  createQuestionHeader(question) {
    const header = document.createElement("div");
    header.className = "question-header";
    
    const questionNumber = document.createElement("div");
    questionNumber.className = "question-number";
    questionNumber.textContent = question.id; // Show actual question ID instead of index
    
    const meta = document.createElement("div");
    meta.className = "question-meta";
    
    const difficultyBadge = document.createElement("span");
    difficultyBadge.className = `difficulty-badge difficulty-${question.difficulty.toLowerCase()}`;
    difficultyBadge.textContent = question.difficulty;
    
    const topicBadge = document.createElement("span");
    topicBadge.className = "topic-badge";
    topicBadge.textContent = question.topic;
    
    meta.appendChild(difficultyBadge);
    meta.appendChild(topicBadge);
    header.appendChild(questionNumber);
    header.appendChild(meta);

    return header;
  },

  // Create options
  createOptions(question) {
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";

    for (const [key, value] of Object.entries(question.options)) {
      const label = document.createElement("label");
      label.className = "option-label";
      
      const isSelected = this.userAnswers[question.id] === key;
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${question.id}`;
      input.value = key;
      input.checked = isSelected;

      const optionText = document.createElement("span");
      optionText.className = "option-text";
      optionText.innerHTML = `<strong>${key}:</strong> ${value}`;

      input.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.userAnswers[question.id] = key;
        }
      });

      label.appendChild(input);
      label.appendChild(optionText);
      optionsDiv.appendChild(label);
    }

    return optionsDiv;
  },

  // Create action buttons
  createActionButtons(question) {
    const actionButtons = document.createElement("div");
    actionButtons.className = "action-buttons";

    const checkBtn = document.createElement("button");
    checkBtn.className = "btn btn-primary";
    checkBtn.textContent = "Check Answer";
    checkBtn.onclick = () => this.checkAnswer(question.id, question.answer);

    actionButtons.appendChild(checkBtn);
    return actionButtons;
  },

  // Check answer
  checkAnswer(questionId, correctAnswer) {
    const selectedAnswer = this.userAnswers[questionId];
    
    if (!selectedAnswer) {
      alert("Please select an answer");
      return;
    }
    
    if (selectedAnswer === correctAnswer) {
      alert("✅ Correct! Well done!");
    } else {
      alert(`❌ Incorrect. The correct answer is ${correctAnswer}`);
    }
  },

  // Navigate to next question
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
    }
  },

  // Navigate to previous question
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
    }
  },

  // Go to specific question by index
  goToQuestion(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
      this.renderCurrentQuestion();
    }
  },

  // Update navigation buttons and progress
  updateNavigation() {
    const currentElement = document.getElementById('current-q');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (currentElement) {
      currentElement.textContent = this.currentQuestionIndex + 1;
    }

    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
    }
  },

  // Re-render MathJax
  renderMath() {
    if (window.MathJax && window.MathJax.typesetPromise) {
      const quizContent = document.getElementById("quiz-content");
      if (quizContent) {
        MathJax.typesetPromise([quizContent]).catch(console.error);
      }
    }
  },

  // Get user's answers
  getUserAnswers() {
    return this.userAnswers;
  },

  // Reset quiz
  reset() {
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    if (this.questions.length > 0) {
      this.renderCurrentQuestion();
    }
  }
};