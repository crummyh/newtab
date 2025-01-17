function pause(s = 1) {
    return new Promise(resolve => setTimeout(resolve, 1000 * Number(s)));
}

async function type(text) {

    let queue = text.split("");
    let container = document.querySelector(".terminal")

    container.textContent = text;

    await pause(0.1);
    return;
}

async function parse(input) {

    // Only allow words, separated by space
	let matches = String(input).match(/^(\w+(?:(?:\s|-)\w+)*)$/);

	if (!matches) {
		throw new Error("Invalid command");
	}
	let command = matches[1];
	let args = matches[2];

    let module;

    // Try to import the command function
    try {
        module = import(`./commands/${command}.js`);
    } catch (e) {
        console.error(e);

        if (e instanceof TypeError) {
            type(`command not found: ${command}`)
            e.message = `Unknown command: ${command}`;
            type("Command not found")
        }
		else {
			e.message = "Error while executing command";
		}
		throw e;
    }

    // Show any output if the command exports any
	await type(module.output);
	await pause();

	// Execute the command (default export)
	await module.default?.(args);

	return;
}

async function input(pw) {
    return new Promise(resolve => {
        const onKeyDown = event => {
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
        terminal.appendChild(input);
        input.focus();
    });
}

async function main() {
    let command = await input()
    await parse(command);

    main();
}

window.onload = function() {
    main();
  };
  