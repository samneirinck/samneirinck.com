const terminal = document.getElementsByTagName("main")[0];
const terminalContent = document.getElementsByClassName("terminal-content")[0];
const promptInput = document.getElementById("prompt");
const promptSection = document.getElementById("promptSection");

// Files generated from Hugo content (pages with file: true)
const files = {
	{{- range where .Site.RegularPages "Params.file" true }}
	'{{ .File.BaseFileName }}': `{{ .Content | htmlUnescape }}`,
	{{- end }}
};

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

function handleLs() {
	const items = Object.keys(files);
	return items.map(item => `<span class="ls-item">${item}</span>`).join('  ');
}

function handleCat(args) {
	if (!args[0]) {
		return 'cat: missing file operand';
	}

	const filename = args[0];
	const content = files[filename];

	if (!content) {
		return `cat: ${filename}: No such file or directory`;
	}

	return content;
}

document.getElementById("promptForm").addEventListener("submit", (event) => {
	const input = promptInput.value.trim().split(/\s+/);
	const command = input[0];
	const args = input.slice(1);

	const section = document.createElement("section");
	const cmd = document.createElement("h1");
	cmd.textContent = promptInput.value;
	section.appendChild(cmd);

	let output = '';

	switch (command) {
		case 'ls':
			output = handleLs(args);
			break;
		case 'cat':
			output = handleCat(args);
			break;
		{{- range where .Site.RegularPages "Section" "commands" }}
		case '{{ .Params.command }}':
			output = `{{ .Content | htmlUnescape }}`;
			break;
		{{- end }}
		default:
			output = `Unknown command: ${command}`;
	}

	const outputEl = document.createElement("div");
	outputEl.innerHTML = output;
	section.appendChild(outputEl);

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


