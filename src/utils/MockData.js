// Rich dataset of SAT questions and agent onboarding scenarios

export const SAT_TOPICS = {
  // Math Topics
  LINEAR_EQUATIONS: "Linear Equations",
  SYSTEMS_EQUATIONS: "Systems of Equations",
  QUADRATICS: "Quadratic & Exponential Functions",
  GEOMETRY: "Circle & Coordinate Geometry",
  
  // Reading & Writing Topics
  WORDS_IN_CONTEXT: "Words in Context",
  COMMAND_EVIDENCE: "Command of Evidence",
  GRAMMAR_SYNTAX: "Standard English Conventions"
};

export const MOCK_QUESTIONS = [
  // Linear Equations (Math)
  {
    id: "m_lin_easy",
    topic: SAT_TOPICS.LINEAR_EQUATIONS,
    difficulty: "Easy",
    question: "If 3x + 7 = 19, what is the value of 2x - 3?",
    options: [
      "A) 1",
      "B) 5",
      "C) 9",
      "D) 12"
    ],
    correctAnswer: 1, // B
    scaffold: [
      "Let's isolate the variable term. Subtract 7 from both sides of the first equation to find 3x.",
      "Now solve for x by dividing both sides of 3x = 12 by 3. What is x?",
      "Now substitute your value of x (which is 4) into the expression 2x - 3. That gives 2(4) - 3."
    ],
    explanation: "First, solve for x in the equation 3x + 7 = 19. Subtracting 7 from both sides gives 3x = 12. Dividing by 3 yields x = 4. Substitute x = 4 into the second expression: 2(4) - 3 = 8 - 3 = 5. Therefore, the correct answer is B."
  },
  {
    id: "m_lin_med",
    topic: SAT_TOPICS.LINEAR_EQUATIONS,
    difficulty: "Medium",
    question: "A service provider charges a one-time fee of $45 plus $18 per hour for repair services. If a customer paid a total of $153, how many hours of repair services did the provider perform?",
    options: [
      "A) 5 hours",
      "B) 6 hours",
      "C) 8.5 hours",
      "D) 9 hours"
    ],
    correctAnswer: 1, // B
    scaffold: [
      "Think about how to model the charge. The total cost is (one-time fee) + (hourly rate × number of hours). Can you set up this equation?",
      "Using the equation 45 + 18h = 153, subtract 45 from both sides to find the cost of just the hourly work.",
      "Now we have 18h = 108. Divide 108 by 18 to isolate the number of hours, h."
    ],
    explanation: "Let h represent the number of hours of repair services. The total cost is represented by the equation 45 + 18h = 153. Subtracting 45 from both sides gives 18h = 108. Dividing by 18 yields h = 6. The correct answer is B."
  },
  {
    id: "m_lin_hard",
    topic: SAT_TOPICS.LINEAR_EQUATIONS,
    difficulty: "Hard",
    question: "A line in the xy-plane passes through the points (-2, 5) and (4, -7). If the line has equation y = mx + b, where m and b are constants, what is the value of m + b?",
    options: [
      "A) -1",
      "B) 1",
      "C) 2",
      "D) -3"
    ],
    correctAnswer: 0, // A
    scaffold: [
      "First, find the slope (m) of the line using the slope formula: m = (y2 - y1) / (x2 - x1). Use points (-2, 5) and (4, -7).",
      "With m = -2, substitute one point (e.g., (4, -7)) into y = mx + b to solve for the y-intercept b. So, -7 = -2(4) + b.",
      "After finding b = 1, sum m and b: (-2) + 1. What is the value?"
    ],
    explanation: "First, find the slope m = (-7 - 5) / (4 - (-2)) = -12 / 6 = -2. Next, use the slope m = -2 and point (4, -7) in y = mx + b to find b: -7 = -2(4) + b => -7 = -8 + b => b = 1. Therefore, m + b = -2 + 1 = -1. The correct answer is A."
  },

  // Systems of Equations (Math)
  {
    id: "m_sys_med",
    topic: SAT_TOPICS.SYSTEMS_EQUATIONS,
    difficulty: "Medium",
    question: "Consider the system of equations:\n2x - y = 8\nx + 3y = 11\nWhat is the value of x + y?",
    options: [
      "A) 3",
      "B) 5",
      "C) 7",
      "D) 9"
    ],
    correctAnswer: 2, // C
    scaffold: [
      "You can solve this using substitution or elimination. For instance, from the first equation, we can write y = 2x - 8.",
      "Substitute y = 2x - 8 into the second equation: x + 3(2x - 8) = 11. Distribute the 3 and combine like terms.",
      "This gives 7x - 24 = 11. Add 24 to both sides and solve for x. Once you get x = 5, find y and compute x + y."
    ],
    explanation: "From the first equation, y = 2x - 8. Substitute into the second equation: x + 3(2x - 8) = 11 => x + 6x - 24 = 11 => 7x = 35 => x = 5. Now find y: y = 2(5) - 8 = 2. Thus, x + y = 5 + 2 = 7. The correct answer is C."
  },
  {
    id: "m_sys_hard",
    topic: SAT_TOPICS.SYSTEMS_EQUATIONS,
    difficulty: "Hard",
    question: "In the system of equations below, k is a constant. For what value of k will the system have infinitely many solutions?\n3x - 5y = 12\n9x - ky = 36",
    options: [
      "A) 5",
      "B) 10",
      "C) 15",
      "D) 20"
    ],
    correctAnswer: 2, // C
    scaffold: [
      "For a system of linear equations to have infinitely many solutions, the two equations must represent the same line (they must be multiples of each other).",
      "Notice that the constant term in the second equation (36) is 3 times the constant term in the first equation (12). So, multiply the entire first equation by 3.",
      "Multiplying 3x - 5y = 12 by 3 gives 9x - 15y = 36. Now compare this with 9x - ky = 36 to find k."
    ],
    explanation: "For a system of linear equations to have infinitely many solutions, the equations must be equivalent. Multiplying the first equation by 3 gives 3(3x - 5y) = 3(12) => 9x - 15y = 36. Comparing this to the second equation 9x - ky = 36, we see that k must equal 15. The correct answer is C."
  },

  // Words in Context (Reading)
  {
    id: "r_words_easy",
    topic: SAT_TOPICS.WORDS_IN_CONTEXT,
    difficulty: "Easy",
    question: "Although the scientist's theories were initially met with skepticism, recent empirical evidence has ________ her hypotheses, convincing even her most vocal critics.",
    options: [
      "A) questioned",
      "B) vindicated",
      "C) complicated",
      "D) discarded"
    ],
    correctAnswer: 1, // B
    scaffold: [
      "Look at the transition word 'Although'. This sets up a contrast between the initial skepticism and the recent effect of empirical evidence.",
      "If the evidence convinced 'even her most vocal critics', it must have proved her theories correct or justified them.",
      "Which option means 'proven correct' or 'justified/defended against skepticism'?"
    ],
    explanation: "The word 'Although' signals a contrast between the initial skepticism and the later acceptance. The fact that the evidence convinced critics means it supported or justified her theories. 'Vindicated' means to clear of accusation, blame, or doubt, or to prove to be correct. Therefore, it fits the blank perfectly. The correct answer is B."
  },
  {
    id: "r_words_med",
    topic: SAT_TOPICS.WORDS_IN_CONTEXT,
    difficulty: "Medium",
    question: "The director's latest film is remarkably ________; it weaves together multiple disparate narrative threads into a cohesive and emotionally resonant whole without ever feeling cluttered or chaotic.",
    options: [
      "A) redundant",
      "B) disjointed",
      "C) adroit",
      "D) pedantic"
    ],
    correctAnswer: 2, // C
    scaffold: [
      "The clue is after the semicolon: it 'weaves together multiple disparate narrative threads into a cohesive... whole' successfully without clutter.",
      "This implies the director is highly skilled, clever, or adept at handling complex structures.",
      "Let's review the definitions: 'redundant' means repetitive; 'disjointed' means disconnected; 'adroit' means clever or skillful; 'pedantic' means overly academic or detailed. Choose the best fit."
    ],
    explanation: "The second half of the sentence describes the director's skill in managing complex narratives. 'Adroit' means clever or skillful in using the hands or mind, which describes this ability. 'Disjointed' would contradict the 'cohesive whole' descriptor, and 'redundant' or 'pedantic' do not fit the positive context. The correct answer is C."
  },

  // Circle Geometry (Math)
  {
    id: "m_geom_hard",
    topic: SAT_TOPICS.GEOMETRY,
    difficulty: "Hard",
    question: "In the xy-plane, the equation of a circle is x² + y² - 6x + 8y = -9. What is the area of the circle?",
    options: [
      "A) 16π",
      "B) 25π",
      "C) 9π",
      "D) 4π"
    ],
    correctAnswer: 0, // A
    scaffold: [
      "To find the area, we need the radius (r) of the circle. We must rewrite the given equation in standard form: (x - h)² + (y - k)² = r².",
      "Complete the square for the x terms: x² - 6x => (x - 3)² - 9. Complete the square for the y terms: y² + 8y => (y + 4)² - 16.",
      "Substitute these back: (x - 3)² - 9 + (y - 4)² - 16 = -9. Move the constants (-9 and -16) to the right side of the equation to find r², and then area = πr²."
    ],
    explanation: "Complete the square for both x and y. Grouping terms: (x² - 6x) + (y² + 8y) = -9. Add (6/2)² = 9 and (8/2)² = 16 to both sides: (x² - 6x + 9) + (y² + 8y + 16) = -9 + 9 + 16 => (x - 3)² + (y + 4)² = 16. In standard circle form, r² = 16. The area of the circle is A = πr² = 16π. The correct answer is A."
  }
];

export const ONBOARDING_DIALOGUE = [
  {
    step: 0,
    text: "Hi there! I am Ace, your adaptive SAT Prep & Personalized Study Coach AI agent. I am designed to build a custom study routine, target your exact weaknesses, and guide you step-by-step to score high. Let's start: What is your target SAT Score?",
    suggestions: ["1400+", "1500+", "1600 (Perfect Score!)", "Improve my current score by 150+ points"]
  },
  {
    step: 1,
    text: "Great goal! Setting the bar high is the first step. How many hours a week can you dedicate to studying with me?",
    suggestions: ["2-4 hours", "5-8 hours", "10+ hours (Intensive)"]
  },
  {
    step: 2,
    text: "Excellent. Let's figure out where to focus our efforts. Which SAT section do you struggle with the most?",
    suggestions: ["Math (Algebra, Geometry)", "Reading & Writing (Grammar, Context)", "Both equally (I need a full diagnostic)"]
  },
  {
    step: 3,
    text: "Got it. I've updated your Knowledge Graph and generated a personalized study plan for you. Check out the Dashboard to see your goals, or start solving SAT questions in the SAT Prep Workspace!",
    suggestions: ["Go to Dashboard", "Start Practicing Now"]
  }
];

export const INITIAL_MASTERY = [
  { topic: SAT_TOPICS.LINEAR_EQUATIONS, score: 45, status: "Focus Area" },
  { topic: SAT_TOPICS.SYSTEMS_EQUATIONS, score: 50, status: "Focus Area" },
  { topic: SAT_TOPICS.QUADRATICS, score: 30, status: "Focus Area" },
  { topic: SAT_TOPICS.GEOMETRY, score: 25, status: "Focus Area" },
  { topic: SAT_TOPICS.WORDS_IN_CONTEXT, score: 65, status: "Developing" },
  { topic: SAT_TOPICS.COMMAND_EVIDENCE, score: 60, status: "Developing" },
  { topic: SAT_TOPICS.GRAMMAR_SYNTAX, score: 75, status: "Developing" }
];

export const INITIAL_PLAN_ITEMS = [
  { id: 1, title: "Diagnostic Test: Heart of Algebra", completed: false, priority: "High" },
  { id: 2, title: "Practice Words in Context (10 Qs)", completed: false, priority: "Medium" },
  { id: 3, title: "Circle Equations Review & Practice", completed: false, priority: "High" },
  { id: 4, title: "Weekly review with Coach Ace", completed: false, priority: "Low" }
];
