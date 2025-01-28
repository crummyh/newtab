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

function openInNewTab(url) {
  window.open(url, "_blank").focus();
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}


// COMMAND STUFF
// ----------------------

class Command {
  constructor(exe, help = "") {
    this.exe = exe;
    this.help = help;
  }

  runCommand(args) {
    if (args.includes("--help")) {
      this.printHelp();
    } else {
      let output = this.exe(args);
      return output;
    }
  }

  printHelp() {
    type(this.help);
  }
}

function hello(args) {
  type("Hello!");
}
const Hello = new Command(hello, "Says hello!");

function exit(args) {
  window.close();
}
const Exit = new Command(exit, "Closes the tab");

function clear(args) {
  term = document.getElementById("terminal");
  while (term.firstChild) {
    term.removeChild(term.lastChild);
  }
}
const Clear = new Command(clear, "Clears the display");

function mathCommand(args) {
  expresion = args.join(" ");
  try {
    eval("type(" + expresion + ")");
  } catch (err) {
    type(err.message);
  }
}
const MathCommand = new Command(
  mathCommand,
  "Prints the result of the expression. Uses JS eval",
);

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
const Search = new Command(search, "Search Google for text");

function shortcut(args) {
  let canvasLink = document.createElement("div");
  canvasLink.innerHTML = "Canvas";
  canvasLink.setAttribute(
    "onclick",
    "openInNewTab('https://nicolet.instructure.com/')",
  );
  canvasLink.setAttribute("class", "linkDiv");

  let skywardLink = document.createElement("div");
  skywardLink.innerHTML = "Skyward";
  skywardLink.setAttribute(
    "onclick",
    "openInNewTab('https://skyward.iscorp.com/scripts/wsisa.dll/WService=wsedunicolethswi/fwemnu01.w')",
  );
  skywardLink.setAttribute("class", "linkDiv");

  let enrichmentLink = document.createElement("div");
  enrichmentLink.innerHTML = "Enrichment";
  enrichmentLink.setAttribute(
    "onclick",
    "openInNewTab('https://login.enrichingstudents.com/')",
  );
  enrichmentLink.setAttribute("class", "linkDiv");

  let driveLink = document.createElement("div");
  driveLink.innerHTML = "Drive";
  driveLink.setAttribute(
    "onclick",
    "openInNewTab('https://drive.google.com/drive/u/0/home')",
  );
  driveLink.setAttribute("class", "linkDiv");

  let githubLink = document.createElement("div");
  githubLink.innerHTML = "Github";
  githubLink.setAttribute("onclick", "openInNewTab('https://github.com/')");
  githubLink.setAttribute("class", "linkDiv");

  let onshapeLink = document.createElement("div");
  onshapeLink.innerHTML = "Onshape";
  onshapeLink.setAttribute(
    "onclick",
    "openInNewTab('https://nicolet.onshape.com/')",
  );
  onshapeLink.setAttribute("class", "linkDiv");

  let terminal = document.getElementById("terminal");
  terminal.appendChild(canvasLink);
  terminal.appendChild(skywardLink);
  terminal.appendChild(enrichmentLink);
  terminal.appendChild(driveLink);
  terminal.appendChild(githubLink);
  terminal.appendChild(onshapeLink);
}
const Shortcut = new Command(shortcut, "Prints a list of quick links");

function font(args) {
  if (args) {
    if (args[0] == "jetbrains") {
      document.cookie = "font=jetbrains; Secure";
      document.body.setAttribute("class", "jetbrains-font");
    } else if (args[0] == "victor") {
      document.cookie = "font=victor; Secure";
      document.body.setAttribute("class", "victor-font");
    } else if (args[0] == "term") {
      document.cookie = "font=term; Secure";
      document.body.setAttribute("class", "vt323-font");
    } else if (args[0] == "reset") {
      document.cookie = "font=jetbrains; Secure";
      document.body.setAttribute("class", "jetbrains-font");
    } else {type("unknown font");}
  }
}
const Font = new Command(font, "Changes the font. Options: jetbrains, victor, term, & reset");

function echo(args) {
  if (args){
    type(args.join(" "));
  } else {
    type("error");
  }
}
const Echo = new Command(echo, "Same as UNIX echo but without the quotes and options");

function debugCommand(args) {
 if (args) {
    if (args[0] == "storage") {
      if (args[1] == "clear") {
        localStorage.clear()
      }
    }
  } else {
    type("No args specified");
  }
}
const DebugCommand = new Command(debugCommand, "Debug things. Don't use if you don't know what it does");

// Add more commands here

function help(args) {
  if (args.length > 0) {
    try {
      commandList[args[0]].printHelp();
    } catch {
      type("unknown command: " + commandList[args[0]]);
    }
  } else {
    for (let key in commandList) {
      type(key + ": " + commandList[key].help + "<br>");
    }
  }
}
const HelpCommand = new Command(help, "Prints help");

let commandList = {
  hello: Hello,
  exit: Exit,
  clear: Clear,
  math: MathCommand,
  search: Search,
  short: Shortcut,
  font: Font,
  echo: Echo,
  debug: DebugCommand,
  help: HelpCommand,
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
      for (let i = 0; i < terminal.children.length; i++) {
        terminal.children[i].setAttribute("contenteditable", false);
      }
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

function boot() {
  const fontCookieValue = document.cookie
  .split("; ")
  .find((row) => row.startsWith("font="))
  ?.split("=")[1];

  font(fontCookieValue);
}

window.onload = function () {
  boot();
  main();
};
