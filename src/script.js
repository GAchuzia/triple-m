class Addition {
  constructor() {
    this.name = "+";
    this.range = 10;
  }
  generate_problem() {
    this.num1 = Math.floor(Math.random() * this.range);
    this.num2 = Math.floor(Math.random() * this.range);
  }
  correct_result() {
    return this.num1 + this.num2;
  }
}

class Subtraction {
  constructor() {
    this.name = "-";
    this.range = 10;
  }
  generate_problem() {
    this.num1 = Math.floor(Math.random() * this.range);
    this.num2 = Math.floor(Math.random() * this.range);
  }
  correct_result() {
    return this.num1 - this.num2;
  }
}

class Multiplication {
  constructor() {
    this.name = "*";
    this.range = 10;
  }
  generate_problem() {
    this.num1 = Math.floor(Math.random() * this.range);
    this.num2 = Math.floor(Math.random() * this.range);
  }
  correct_result() {
    return this.num1 * this.num2;
  }
}

class Division {
  constructor() {
    this.name = "÷";
    this.range = 10;
  }
  generate_problem() {
    this.num1 = Math.floor(Math.random() * this.range);
    this.num2 = Math.floor(Math.random() * this.range);
  }
  correct_result() {
    return this.num1 / this.num2;
  }
}

function generate_question() {
  const operations = [new Addition(), new Subtraction(), new Multiplication()];
  const random_operation =
    operations[Math.floor(Math.random() * operations.length)];

  random_operation.generate_problem();
  const math_problem = `${random_operation.num1} ${random_operation.name} ${random_operation.num2}`;
  const correct_answer = random_operation.correct_result();
  document.getElementById("math-problem").textContent = math_problem;

  return correct_answer;
}

function check_user_input() {
  const user_answer = parseInt(
    document.getElementById("user-answer").value,
    10
  );
  const feedback_element = document.getElementById("feedback");
  const previous_correct_answer = feedback_element.getAttribute(
    "data-correct-answer"
  );
  let correct_answer;

  if (previous_correct_answer === null) {
    // First time, generate a new problem
    correct_answer = generate_question();
    feedback_element.setAttribute("data-correct-answer", correct_answer);
  } else {
    correct_answer = parseInt(previous_correct_answer, 10);
  }

  if (user_answer === correct_answer) {
    feedback_element.textContent = "Correct!";
    feedback_element.removeAttribute("data-correct-answer");
    document.getElementById("user-answer").value = "";
    generate_question();
  } else {
    setTimeout(10000);
    feedback_element.textContent = `Incorrect. Try again.`;
  }
}

// Save generated question to json format
