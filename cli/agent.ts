import { OpenAIProvider, Runner, setTracingDisabled } from "@openai/agents";
import { cac } from "cac";
import { terminal as term } from "terminal-kit";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";
import { CoreAgent } from "~/user/assistant/CoreAgent";

setTracingDisabled(true);

const cli = cac("Agent Test");
cli.option("--user <email>", "User email");
cli.option("--prompt <your prompt>", "Ask agent whatever you need");
cli.help();

const args = cli.parse(process.argv, {
	run: false,
});

if (args.options.help) {
	process.exit(0);
}

type ChatRole = "user" | "assistant";

type ChatMessage = {
	role: ChatRole;
	text: string;
};

type RunnerConfig = ConstructorParameters<typeof Runner>[0];

const withMarkup = (markup: string) => (value: string) => {
	if (!process.stdout.isTTY || process.env.NO_COLOR) {
		return value;
	}

	return String(term.str(`${markup}${value}^:`));
};

const style = {
	bold: withMarkup("^+"),
	dim: withMarkup("^k"),
	green: withMarkup("^g"),
	cyan: withMarkup("^c"),
	white: withMarkup("^w"),
};

const trimPrompt = (value: string | undefined) => value?.trim() ?? "";

const isExitCommand = (value: string) => {
	const normalized = value.trim().toLowerCase();
	return (
		normalized === "/exit" ||
		normalized === "exit" ||
		normalized === "/quit" ||
		normalized === "quit"
	);
};

const printHeader = () => {
	console.log("");
	console.log(style.bold(style.cyan("Agent chat")));
	console.log(style.dim("Type your message and press Enter. Use Ctrl+C or /exit to quit."));
	console.log("");
};

const printMessage = (message: ChatMessage) => {
	const label = message.role === "user" ? "You" : "Agent";
	const labelStyle = message.role === "user" ? style.white : style.green;

	console.log(`${labelStyle(label)}: ${message.text}`);
};

const createRunner = () => {
	const aiConfig = ServerAiSchema.parse(process.env);

	const runnerConfig: RunnerConfig = {
		model: aiConfig.SERVER_AI_MODEL,
		modelProvider: new OpenAIProvider({
			baseURL: aiConfig.SERVER_AI_SERVER_URL,
			apiKey: aiConfig.SERVER_AI_TOKEN,
		}),
		tracingDisabled: true,
	};

	return new Runner(runnerConfig);
};

const readPrompt = async () => {
	process.stdout.write(`${style.cyan("You")}: `);
	const input = await term.inputField({
		cancelable: true,
	}).promise;
	process.stdout.write("\n");

	return trimPrompt(input);
};

const runTurn = async (input: string, previousResponseId?: string) => {
	const controller = new AbortController();

	return {
		controller,
		response: await runner.run(CoreAgent, input, {
			stream: true,
			previousResponseId,
			signal: controller.signal,
		}),
	};
};

const runner = createRunner();
const shouldRunInteractive =
	process.stdin.isTTY && process.stdout.isTTY && !trimPrompt(args.options.prompt);
const initialPrompt = trimPrompt(args.options.prompt);

let activeController: AbortController | undefined;
let shuttingDown = false;
let escapeRequested = false;

term.grabInput({
	safe: true,
});

const abortActiveTurn = () => {
	if (!activeController || activeController.signal.aborted) {
		return;
	}

	escapeRequested = true;
	activeController.abort();
};

term.on("key", (key: string) => {
	if (key === "ESCAPE") {
		abortActiveTurn();
		return;
	}

	if (key === "CTRL_C") {
		void cleanupAndExit(130);
	}
});

const cleanupAndExit = async (code: number) => {
	if (shuttingDown) {
		process.exit(code);
	}

	shuttingDown = true;
	activeController?.abort();

	try {
		await term.asyncCleanup();
	} finally {
		process.exit(code);
	}
};

process.once("SIGINT", () => {
	void cleanupAndExit(130);
});

process.once("SIGTERM", () => {
	void cleanupAndExit(143);
});

const sendTurn = async (input: string, previousResponseId?: string) => {
	const { controller, response } = await runTurn(input, previousResponseId);
	activeController = controller;

	try {
		printMessage({
			role: "user",
			text: input,
		});

		process.stdout.write(`${style.green("Agent")}: `);

		const textStream = response.toTextStream({
			compatibleWithNodeStreams: true,
		});
		let wroteText = false;

		try {
			for await (const chunk of textStream) {
				wroteText = true;
				process.stdout.write(String(chunk));
			}

			if (!wroteText) {
				const finalOutput = response.finalOutput;

				if (typeof finalOutput === "string" && finalOutput.trim().length > 0) {
					process.stdout.write(finalOutput);
				}
			}

			process.stdout.write("\n");

			await response.completed;

			if (escapeRequested) {
				process.stdout.write(style.dim("[aborted]"));
				process.stdout.write("\n");
				return response.lastResponseId;
			}

			if (response.error) {
				throw response.error;
			}
		} catch (error) {
			if (!escapeRequested) {
				throw error;
			}

			process.stdout.write(style.dim("[aborted]"));
			process.stdout.write("\n");
		}

		return response.lastResponseId;
	} finally {
		activeController = undefined;
		escapeRequested = false;
		controller.abort();
	}
};

const runOneShot = async () => {
	const input = initialPrompt;

	if (!input) {
		console.error("Missing --prompt. Use interactive mode in a TTY or pass a prompt.");
		process.exit(1);
	}

	await sendTurn(input);
};

const runInteractive = async () => {
	printHeader();

	let previousResponseId: string | undefined;
	let queuedPrompt: string | undefined = initialPrompt;

	while (true) {
		const input = queuedPrompt ?? (await readPrompt());
		queuedPrompt = undefined;

		if (!input) {
			if (escapeRequested) {
				escapeRequested = false;
				process.stdout.write(style.dim("[aborted]"));
				process.stdout.write("\n");
			}

			continue;
		}

		if (isExitCommand(input)) {
			await cleanupAndExit(0);
			return;
		}

		previousResponseId = await sendTurn(input, previousResponseId);
	}
};

if (shouldRunInteractive) {
	await runInteractive();
} else {
	await runOneShot();
}
