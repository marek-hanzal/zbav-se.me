import { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import {
	MemorySession,
	OpenAIProvider,
	Runner,
	type RunState,
	setTracingDisabled,
} from "@openai/agents";
import { cac } from "cac";
import * as terminalKit from "terminal-kit";
import { match, P } from "ts-pattern";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";
import { CoreAgent } from "~/user/assistant/CoreAgent";

setTracingDisabled(true);

const term = terminalKit.terminal;

const cli = cac("agent-chat");
cli.option("--user <email>", "User email");
cli.option("--model <name>", "Override model");
cli.help();

const args = cli.parse(process.argv, {
	run: false,
});

if (args.options.help) {
	process.exit(0);
}

const aiConfig = ServerAiSchema.parse(process.env);
const model = args.options.model ?? aiConfig.SERVER_AI_MODEL;

const runner = new Runner({
	model,
	modelProvider: new OpenAIProvider({
		baseURL: aiConfig.SERVER_AI_SERVER_URL,
		apiKey: aiConfig.SERVER_AI_TOKEN,
	}),
	tracingDisabled: true,
});

const session = new MemorySession({
	sessionId: args.options.user ?? "local-terminal-chat",
});

const inputHistory: string[] = [];

const appState = {
	running: true,
	streaming: false,
	terminating: false,
	activeAbortController: null as AbortController | null,
};

const divider = () => "─".repeat(Math.max(32, term.width - 4));

const printDivider = () => {
	term.brightWhite("%s\n", divider());
};

const clearCurrentLine = () => {
	term("\r\x1b[2K");
};

const printHeader = () => {
	term.clear();

	term.bold.brightWhite("Agent");
	term.brightWhite(" ");
	term.brightBlack("-");
	term.brightWhite(" ");
	term.bold.brightMagenta("zbav-se.me");
	term("\n");

	printDivider();

	term.bold.brightWhite("Model   ");
	term.white("%s\n", model);

	term.bold.brightWhite("Session ");
	term.white("%s\n", args.options.user ?? "local-terminal-chat");

	term.bold.brightWhite("Commands");
	term.white("  ");
	term.brightYellow("/clear");
	term.white("  ");
	term.brightYellow("/help");
	term.white("  ");
	term.brightYellow("/exit");
	term("\n");

	term.bold.brightWhite("Stream  ");
	term.white("Press ");
	term.brightYellow("Esc");
	term.white(" to stop the current response");
	term("\n");

	printDivider();
	term("\n");
};

const normalizeOutput = (value: unknown): string => {
	if (typeof value === "string") {
		return value;
	}

	if (value == null) {
		return "";
	}

	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return String(value);
	}
};

const isAbortLikeError = (error: unknown): boolean => {
	if (!(error instanceof Error)) {
		return false;
	}

	return error.name === "AbortError" || /abort|aborted|cancelled|canceled/i.test(error.message);
};

const createThinkingIndicator = () => {
	const frames = [
		"⠋",
		"⠙",
		"⠹",
		"⠸",
		"⠼",
		"⠴",
		"⠦",
		"⠧",
		"⠇",
		"⠏",
	];
	let frameIndex = 0;
	let active = true;

	const render = () => {
		if (!active) {
			return;
		}

		clearCurrentLine();
		term.bold.brightCyan("agent");
		term.brightWhite(" > ");
		term.brightYellow("%s ", frames[frameIndex]);
		term.bold.brightWhite("thinking");

		frameIndex = (frameIndex + 1) % frames.length;
	};

	render();

	const timer = setInterval(render, 80);

	return {
		stop() {
			if (!active) {
				return;
			}

			active = false;
			clearInterval(timer);
			clearCurrentLine();
		},
	};
};

const terminate = async (exitCode = 0) => {
	if (appState.terminating) {
		return;
	}

	appState.terminating = true;
	appState.running = false;

	if (appState.activeAbortController && !appState.activeAbortController.signal.aborted) {
		appState.activeAbortController.abort();
	}

	term.removeListener("key", onKey);

	try {
		term("\n");
		printDivider();
		term.green("Goodbye.\n");
		term.grabInput(false);
		term.styleReset();

		await new Promise((resolve) => setTimeout(resolve, 30));

		term.processExit(exitCode);
	} catch {
		process.exit(exitCode);
	}
};

const onKey = (name: string) => {
	if (name === "CTRL_C") {
		void terminate(0);
		return;
	}

	if (
		appState.streaming &&
		appState.activeAbortController &&
		(name === "ESCAPE" || name === "ESC")
	) {
		if (!appState.activeAbortController.signal.aborted) {
			appState.activeAbortController.abort();
		}
	}
};

process.on("SIGINT", () => {
	void terminate(0);
});

process.on("SIGTERM", () => {
	void terminate(0);
});

term.grabInput({
	mouse: false,
});
term.on("key", onKey);

const askInput = async () => {
	term.bold.brightGreen("you");
	term.brightWhite(" > ");

	const input = await term.inputField({
		echo: true,
		history: inputHistory,
		autoCompleteHint: false,
		cancelable: false,
	}).promise;

	term("\n");

	return input;
};

const askApproval = async (agentName: string, toolName: string, toolArguments: string) => {
	printDivider();

	term.bold.brightYellow("approval");
	term.brightWhite(" > ");
	term.white("%s", agentName);
	term.white(" wants to run ");
	term.brightCyan("%s", toolName);
	term("\n");

	if (toolArguments.trim()) {
		term.bold.brightWhite("args    ");
		term.white("%s\n", toolArguments);
	}

	term.bold.brightYellow("approve? ");

	const approved = await term.yesOrNo({
		yes: [
			"y",
			"Y",
			"ENTER",
		],
		no: [
			"n",
			"N",
		],
		echoYes: "yes",
		echoNo: "no",
	}).promise;

	term("\n");

	return approved;
};

const streamAssistantOutput = async (input: string | RunState) => {
	let nextInput: string | RunState = input;

	while (appState.running) {
		const abortController = new AbortController();
		const thinking = createThinkingIndicator();

		appState.activeAbortController = abortController;
		appState.streaming = true;

		let stream: Awaited<ReturnType<typeof runner.run>> | null = null;

		let wroteAnyText = false;
		let startedOutput = false;

		try {
			stream = await runner.run(CoreAgent, nextInput, {
				session,
				stream: true,
				signal: abortController.signal,
			});

			const sink = new Writable({
				write(chunk, _encoding, callback) {
					if (!startedOutput) {
						startedOutput = true;
						thinking.stop();
						term.bold.brightCyan("agent");
						term.brightWhite(" > ");
					}

					wroteAnyText = true;
					term.white("%s", chunk.toString());
					callback();
				},
			});

			await pipeline(
				stream.toTextStream({
					compatibleWithNodeStreams: true,
				}),
				sink,
			);

			await stream.completed;
		} catch (error) {
			const aborted =
				abortController.signal.aborted || stream?.cancelled || isAbortLikeError(error);

			if (!aborted) {
				thinking.stop();
				throw error;
			}
		} finally {
			thinking.stop();
			appState.streaming = false;
			appState.activeAbortController = null;
		}

		const wasAborted = abortController.signal.aborted || stream?.cancelled;

		if (wasAborted) {
			if (!startedOutput) {
				term.bold.brightCyan("agent");
				term.brightWhite(" > ");
			} else {
				term("\n");
			}

			term.brightRed("[stream stopped]");
			term("\n");
			return;
		}

		if (!stream) {
			term.bold.brightCyan("agent");
			term.brightWhite(" > ");
			term.brightRed("[stream failed]");
			term("\n");
			return;
		}

		if (!wroteAnyText && stream.finalOutput != null) {
			term.bold.brightCyan("agent");
			term.brightWhite(" > ");
			term.white("%s", normalizeOutput(stream.finalOutput));
			startedOutput = true;
		}

		if (!stream.interruptions?.length) {
			if (!startedOutput) {
				term.bold.brightCyan("agent");
				term.brightWhite(" > ");
				term.brightBlack("[no output]");
			}

			term("\n");
			return;
		}

		if (!startedOutput) {
			term.bold.brightCyan("agent");
			term.brightWhite(" > ");
			term.brightBlack("[waiting for approval]");
			term("\n");
		} else {
			term("\n");
		}

		const state = stream.state;

		for (const interruption of stream.interruptions) {
			const approved = await askApproval(
				interruption.agent.name,
				interruption.name,
				interruption.arguments,
			);

			if (approved) {
				state.approve(interruption);
				term.green("approved\n");
			} else {
				state.reject(interruption);
				term.red("rejected\n");
			}
		}

		printDivider();
		nextInput = state;
	}
};

const printHelp = () => {
	printDivider();

	term.bold.brightWhite("Help\n");
	term.bold.brightWhite("  /clear");
	term.white("  Clear the current session and redraw the screen\n");
	term.bold.brightWhite("  /help ");
	term.white("  Show this help\n");
	term.bold.brightWhite("  /exit ");
	term.white("  Exit the app\n");
	term.bold.brightWhite("  Esc   ");
	term.white("  Stop the current streaming response\n");
};

const handleInput = async (input: string) => {
	const trimmed = input.trim();

	if (!trimmed) {
		return;
	}

	await match(trimmed)
		.with(P.union("/exit", "/quit"), async () => {
			await terminate(0);
		})
		.with("/clear", async () => {
			await session.clearSession();
			printHeader();
			term.green("Session cleared.\n\n");
		})
		.with("/help", async () => {
			printHelp();
		})
		.otherwise(async (prompt) => {
			inputHistory.push(prompt);
			printDivider();
			await streamAssistantOutput(prompt);
			term("\n");
		});
};

printHeader();

while (appState.running) {
	try {
		const input = await askInput();

		if (!appState.running) {
			break;
		}

		if (typeof input !== "string") {
			continue;
		}

		await handleInput(input);
	} catch (error) {
		if (appState.terminating) {
			break;
		}

		term.red("[error] %s\n\n", error instanceof Error ? error.message : String(error));
	}
}
