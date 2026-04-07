import { OpenAIProvider, Runner, setTracingDisabled } from "@openai/agents";
import { cac } from "cac";
import { terminal as term } from "terminal-kit";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";
import { CoreAgent } from "~/user/assistant/CoreAgent";

setTracingDisabled(true);

const cli = cac("Agent Test");
cli.option("--user <email>", "User email");
cli.option("--model <name>", "Override the AI model");
cli.help();

const args = cli.parse(process.argv, {
	run: false,
});

if (args.options.help) {
	process.exit(0);
}

type RunnerConfig = ConstructorParameters<typeof Runner>[0];

const withMarkup = (markup: string) => (value: string) => {
	if (!process.stdout.isTTY || process.env.NO_COLOR) {
		return value;
	}

	return String(term.str(`${markup}${value}^:`));
};

const style = {
	title: withMarkup("^+^c"),
	agent: withMarkup("^g"),
	user: withMarkup("^w"),
	accent: withMarkup("^c"),
	muted: withMarkup("^k"),
	error: withMarkup("^r"),
};

const trimOption = (value: string | undefined) => value?.trim() ?? "";

const isExitCommand = (value: string) => {
	const normalized = value.trim().toLowerCase();
	return (
		normalized === "/exit" ||
		normalized === "exit" ||
		normalized === "/quit" ||
		normalized === "quit"
	);
};

const createSeparator = () => style.muted("------------------------------------------------");

const printHeader = () => {
	console.log("");
	console.log(style.title("zbav-se.me agent"));
	console.log(createSeparator());
	console.log(
		style.muted(
			"Enter a message, then press Enter. Esc stops the current reply. Ctrl+C exits.",
		),
	);
	console.log("");
};

const createRunner = () => {
	const aiConfig = ServerAiSchema.parse(process.env);
	const model = trimOption(args.options.model) || aiConfig.SERVER_AI_MODEL;

	const runnerConfig: RunnerConfig = {
		model,
		modelProvider: new OpenAIProvider({
			baseURL: aiConfig.SERVER_AI_SERVER_URL,
			apiKey: aiConfig.SERVER_AI_TOKEN,
		}),
		tracingDisabled: true,
	};

	return new Runner(runnerConfig);
};

const runner = createRunner();

let activeController: AbortController | undefined;
let shuttingDown = false;
let escapeRequested = false;

term.grabInput({
	safe: true,
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

process.once("SIGINT", () => {
	void cleanupAndExit(130);
});

process.once("SIGTERM", () => {
	void cleanupAndExit(143);
});

const readPrompt = async () => {
	process.stdout.write(`${style.user("You")} ${style.muted("›")} `);
	const input = await term.inputField({
		cancelable: true,
		style: term.white,
	}).promise;
	process.stdout.write("\n");

	return trimOption(input);
};

const runTurn = async (input: string, previousResponseId?: string) => {
	const controller = new AbortController();

	const response = await runner.run(CoreAgent, input, {
		stream: true,
		previousResponseId,
		signal: controller.signal,
	});

	return {
		controller,
		response,
	};
};

const printAbortNotice = () => {
	console.log(style.muted("[aborted]"));
};

const sendTurn = async (input: string, previousResponseId?: string) => {
	const { controller, response } = await runTurn(input, previousResponseId);
	activeController = controller;

	try {
		process.stdout.write(`${style.agent("Agent")} ${style.muted("›")} `);

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
				printAbortNotice();
				return response.lastResponseId;
			}

			if (response.error) {
				throw response.error;
			}
		} catch (error) {
			if (!escapeRequested) {
				throw error;
			}

			printAbortNotice();
		}

		return response.lastResponseId;
	} finally {
		activeController = undefined;
		escapeRequested = false;
		controller.abort();
	}
};

const runInteractive = async () => {
	if (!process.stdin.isTTY || !process.stdout.isTTY) {
		console.error("This CLI is interactive only. Run it in a TTY.");
		process.exit(1);
	}

	printHeader();

	let previousResponseId: string | undefined;

	while (true) {
		const input = await readPrompt();

		if (!input) {
			if (escapeRequested) {
				escapeRequested = false;
				printAbortNotice();
			}

			continue;
		}

		if (isExitCommand(input)) {
			await cleanupAndExit(0);
			return;
		}

		console.log(createSeparator());
		previousResponseId = await sendTurn(input, previousResponseId);
		console.log("");
	}
};

await runInteractive();
