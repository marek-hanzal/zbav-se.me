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
	term.brightBlack("%s\n", divider());
};

const printHeader = () => {
	term.clear();

	term.bold.brightWhite("Agent");
	term.brightBlack("  ·  ");
	term.bold.brightMagenta("zbav-se.me");
	term("\n");

	printDivider();

	term.brightBlack("Model   ");
	term.brightWhite("%s\n", model);

	term.brightBlack("Session ");
	term.brightWhite("%s\n", args.options.user ?? "local-terminal-chat");

	term.brightBlack("Příkazy ");
	term.brightYellow("/clear");
	term.brightBlack("  ");
	term.brightYellow("/help");
	term.brightBlack("  ");
	term.brightYellow("/exit");
	term("\n");

	term.brightBlack("Stream  ");
	term.brightWhite("Esc");
	term.brightBlack(" = stop odpovědi");
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
		term.green("👋 Končím.\n");
		term.grabInput(false);
		term.styleReset();

		// Malá pauza, aby si terminál stihl uklidit ruce od klávesnice.
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
	term.brightBlack("  > ");
	term.brightWhite("");

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
	term.brightBlack(" > ");
	term.brightWhite("%s", agentName);
	term.brightBlack(" chce spustit ");
	term.brightCyan("%s", toolName);
	term("\n");

	if (toolArguments.trim()) {
		term.brightBlack("args     ");
		term.brightWhite("%s\n", toolArguments);
	}

	term.brightYellow("approve? ");
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

		appState.activeAbortController = abortController;
		appState.streaming = true;

		const stream = await runner.run(CoreAgent, nextInput, {
			session,
			stream: true,
			signal: abortController.signal,
		});

		let wroteAnyText = false;

		term.bold.brightCyan("agent");
		term.brightBlack(" > ");

		const sink = new Writable({
			write(chunk, _encoding, callback) {
				wroteAnyText = true;
				term.brightWhite("%s", chunk.toString());
				callback();
			},
		});

		try {
			await pipeline(
				stream.toTextStream({
					compatibleWithNodeStreams: true,
				}),
				sink,
			);

			await stream.completed;
		} catch (error) {
			const aborted =
				abortController.signal.aborted || stream.cancelled || isAbortLikeError(error);

			if (!aborted) {
				throw error;
			}
		} finally {
			appState.streaming = false;
			appState.activeAbortController = null;
		}

		const wasAborted = abortController.signal.aborted || stream.cancelled;

		if (wasAborted) {
			if (!wroteAnyText) {
				term.brightBlack("[žádný text]\n");
			} else {
				term("\n");
			}

			term.brightRed("stream zastaven\n");
			return;
		}

		if (!wroteAnyText && stream.finalOutput != null) {
			term.brightWhite("%s", normalizeOutput(stream.finalOutput));
		}

		term("\n");

		if (!stream.interruptions?.length) {
			return;
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

	term.bold.brightWhite("Nápověda\n");
	term.brightBlack("  /clear");
	term.brightWhite("  smaže session a překreslí obrazovku\n");
	term.brightBlack("  /help");
	term.brightWhite("   zobrazí tenhle help\n");
	term.brightBlack("  /exit");
	term.brightWhite("   ukončí appku\n");
	term.brightBlack("  Esc");
	term.brightWhite("     během streamu zastaví odpověď agenta\n");
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
			term.green("🧹 Session smazána.\n\n");
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

		term.red("[chyba] %s\n\n", error instanceof Error ? error.message : String(error));
	}
}
