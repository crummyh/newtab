// UTIL FUNCTIONS
// -----------------------

function pause(time) {
  // Pauses for `time` seconds
  return new Promise((resolve) => setTimeout(resolve, 1000 * Number(time)));
}

function type(msg, container = document.getElementById("terminal")) {
  // write msg to container (default terminal)
  container.innerHTML += msg;
}

// COMMAND STUFF
// ----------------------

class Command {
  constructor(exe) {
    this.exe = exe;
  }

  runCommand(args) {
    let output = this.exe(args);
    return output;
  }
}

function hello(args) {
  type("Hello!");
}
const Hello = new Command(hello);

function exit(args) {
  window.close();
}
const Exit = new Command(exit);

function clear(args) {
  term = document.getElementById("terminal");
  while (term.firstChild) {
    term.removeChild(term.lastChild);
  }
}
const Clear = new Command(clear);

function mathCommand(args) {
  expresion = args.join(" ");
  try {
    eval("type(" + expresion + ")");
  } catch (err) {
    type(err.message);
  }
}
const MathCommand = new Command(mathCommand);

function search(args) {
  question = args.join(" ");
  if (question) {
    googleUrl =
      "http://www.google.com.pk/search?btnG=1&pws=0&q=" +
      question.replace(" ", "+");
    window.location.href = googleUrl;
  } else {
    type("please enter a query");
  }
}
const Search = new Command(search);

let commandList = {
  hello: Hello,
  exit: Exit,
  clear: Clear,
  math: MathCommand,
  search: Search,
};

// INTERNAL FUNCTIONS
// ----------------------

async function input(pw) {
  return new Promise((resolve) => {
    const onKeyDown = (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        let result = event.target.textContent;
        resolve(result);
      }
    };

    let terminal = document.querySelector(".terminal");
    let input = document.createElement("div");
    input.setAttribute("id", "input");
    input.setAttribute("contenteditable", true);
    input.addEventListener("keydown", onKeyDown);
    if (terminal.lastElementChild) {
      terminal.lastElementChild.setAttribute("contenteditable", false);
    }
    terminal.appendChild(input);
    input.focus();
  });
}

function parse(userInput) {
  userInput = userInput.split(" ");
  let command = userInput[0];
  let args = userInput.slice(1);

  if (Object.keys(commandList).includes(command)) {
    commandList[command].runCommand(args);
  } else {
    type("unknown command");
  }
}

async function main() {
  let command = await input();
  parse(command);

  main();
}

window.onload = function () {
  main();
};
