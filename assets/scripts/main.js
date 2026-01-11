const terminal = document.getElementsByTagName("main")[0];
const terminalContent = document.getElementsByClassName("terminal-content")[0];
const promptInput = document.getElementById("prompt");
const promptSection = document.getElementById("promptSection");

// Files generated from Hugo content (pages with file: true)
const files = {
	{{- range where .Site.RegularPages "Params.file" true }}
	'{{ with .Params.displayName }}{{ . }}{{ else }}{{ .File.BaseFileName }}{{ end }}': `{{ .Content | htmlUnescape }}`,
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

function handleLs(args) {
	const showAll = args.includes('-a');
	let items = Object.keys(files);

	if (!showAll) {
		items = items.filter(item => !item.startsWith('.'));
	}

	if (items.length === 0) {
		return '';
	}

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
		case 'clear':
			terminalContent.innerHTML = '';
			promptInput.value = '';
			event.preventDefault();
			return;
		{{- range where .Site.RegularPages "Params.command" "!=" "" }}
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

// Tab completion
const commands = ['cat', 'clear', 'help', 'ls', 'whoami'];
let lastTabTime = 0;
let lastTabInput = '';

function getCompletions(input) {
	const parts = input.split(/\s+/);
	const command = parts[0];
	const partial = parts[parts.length - 1];

	// If we're still typing the command (no space yet)
	if (parts.length === 1) {
		return commands.filter(cmd => cmd.startsWith(partial));
	}

	// Commands that take file arguments
	const fileCommands = ['cat'];
	if (fileCommands.includes(command)) {
		const fileNames = Object.keys(files);
		return fileNames.filter(file => file.startsWith(partial));
	}

	return [];
}

function showCompletions(completions) {
	const section = document.createElement("section");
	const cmd = document.createElement("h1");
	cmd.textContent = promptInput.value;
	section.appendChild(cmd);

	const outputEl = document.createElement("div");
	outputEl.innerHTML = completions.map(item => `<span class="ls-item">${item}</span>`).join('  ');
	section.appendChild(outputEl);

	terminalContent.appendChild(section);
	scrollToBottom(terminalContent);
}

function handleTabCompletion() {
	const input = promptInput.value;
	const completions = getCompletions(input);
	const now = Date.now();
	const isDoubleTab = (now - lastTabTime < 500) && (input === lastTabInput);

	lastTabTime = now;
	lastTabInput = input;

	if (completions.length === 1) {
		// Single match - complete it
		const parts = input.split(/\s+/);
		parts[parts.length - 1] = completions[0];
		promptInput.value = parts.join(' ');
	} else if (completions.length > 1) {
		// Multiple matches - find common prefix
		const commonPrefix = completions.reduce((prefix, item) => {
			while (!item.startsWith(prefix)) {
				prefix = prefix.slice(0, -1);
			}
			return prefix;
		}, completions[0]);

		const parts = input.split(/\s+/);
		if (commonPrefix.length > parts[parts.length - 1].length) {
			parts[parts.length - 1] = commonPrefix;
			promptInput.value = parts.join(' ');
		} else if (isDoubleTab) {
			// Double-tab with no further prefix - show all completions
			showCompletions(completions);
		}
	}
}

promptInput.addEventListener('keydown', (event) => {
	if (event.key === 'Tab') {
		event.preventDefault();
		handleTabCompletion();
	}
});


