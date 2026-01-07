const terminal = document.getElementsByTagName("main")[0];
const terminalContent = document.getElementsByClassName("terminal-content")[0];
const promptInput = document.getElementById("prompt");
const promptSection = document.getElementById("promptSection");
document.getElementById('closeTerminal').addEventListener('click', () => {
	terminal.classList.toggle('closed');
})
document.getElementById('minimizeTerminal').addEventListener('click', () => {
	terminal.classList.toggle('minimized');
})

document.getElementById('maximizeTerminal').addEventListener('click', () => {
	if (!document.fullscreenElement) {
		terminal.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
})

document.getElementById("promptForm").addEventListener("submit", (event) => {
	const input = promptInput.value.split(" ");
	const command = input[0];

	const section = document.createElement("section");
	const cmd = document.createElement("h1");
	cmd.textContent = input;
	section.appendChild(cmd);


	let output = null;
	switch (command) {
		case 'whoami':
			output = document.createElement("p");
			output.textContent = "Sam Neirinck - Software Engineer";
			break;
		default:
			output = document.createElement("p");
			output.textContent = `Unknown command: ${command}`;

	}
	if (output) {
		section.appendChild(output);




	}
	terminalContent.appendChild(section);
	scrollToBottom(terminalContent);
	
	promptInput.value = '';
	event.preventDefault();
});

function scrollToBottom(el) {
	requestAnimationFrame(() => {
		el.scrollTop = el.scrollHeight;
	});
}
