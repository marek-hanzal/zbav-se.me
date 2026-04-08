import { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import {
	MemorySession,
	OpenAIProvider,
	Runner,
	setTracingDisabled,
	type Usage,
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

// const session = new MemorySession({
// 	sessionId: args.options.user ?? "local-terminal-chat",
// });

type UsageTotals = {
	requests: number;
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
};

type TurnStats = UsageTotals & {
	turn: number;
	elapsedMs: number;
	firstTokenMs: number | null;
	cancelled: boolean;
};

type ResumeState = Awaited<ReturnType<typeof runner.run>>["state"];
type UnknownRecord = Record<string, unknown>;

type ToolView = {
	id: string;
	name: string;
	agentName?: string;
	input?: unknown;
	output?: unknown;
};

const inputHistory: string[] = [];

const appState = {
	running: true,
	terminating: false,
	streaming: false,
	turn: 0,
	activeAbortController: null as AbortController | null,
	appUsage: {
		requests: 0,
		inputTokens: 0,
		outputTokens: 0,
		totalTokens: 0,
	} satisfies UsageTotals,
};

const divider = () => "─".repeat(Math.max(40, term.width - 2));

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

const formatMs = (value: number) => {
	if (value < 1_000) {
		return `${value}ms`;
	}

	return `${(value / 1_000).toFixed(1)}s`;
};

const usageFrom = (usage?: Usage | null): UsageTotals => ({
	requests: usage?.requests ?? 0,
	inputTokens: usage?.inputTokens ?? 0,
	outputTokens: usage?.outputTokens ?? 0,
	totalTokens: usage?.totalTokens ?? 0,
});

const addUsage = (target: UsageTotals, source: UsageTotals) => {
	target.requests += source.requests;
	target.inputTokens += source.inputTokens;
	target.outputTokens += source.outputTokens;
	target.totalTokens += source.totalTokens;
};

const clearCurrentLine = () => {
	term("\r\x1b[2K");
};

const printDivider = () => {
	term.brightWhite("%s\n", divider());
};

const printAppStats = () => {
	term.bold.brightWhite("App stats  ");
	term.brightBlack("turns ");
	term.white("%s", formatNumber(appState.turn));
	term.brightBlack("  ·  req ");
	term.white("%s", formatNumber(appState.appUsage.requests));
	term.brightBlack("  ·  in ");
	term.white("%s", formatNumber(appState.appUsage.inputTokens));
	term.brightBlack("  ·  out ");
	term.white("%s", formatNumber(appState.appUsage.outputTokens));
	term.brightBlack("  ·  total ");
	term.white("%s\n", formatNumber(appState.appUsage.totalTokens));
};

const printHeader = () => {
	term.clear();

	term.bgBrightWhite.black.bold(" Agent ");
	term.white(" ");
	term.brightBlack("-");
	term.white(" ");
	term.bold.brightMagenta("zbav-se.me");
	term("\n");

	printDivider();

	term.bold.brightWhite("Model      ");
	term.white("%s\n", model);

	term.bold.brightWhite("Session    ");
	term.white("%s\n", args.options.user ?? "local-terminal-chat");

	term.bold.brightWhite("Commands   ");
	term.brightYellow("/clear");
	term.white("  ");
	term.brightYellow("/help");
	term.white("  ");
	term.brightYellow("/exit");
	term("\n");

	term.bold.brightWhite("Interrupt  ");
	term.white("Press ");
	term.brightYellow("Esc");
	term.white(" to stop the current response");
	term("\n");

	printDivider();
	printAppStats();
	term("\n");
};

const printTurnStats = (stats: TurnStats) => {
	printDivider();

	term.bold.brightWhite("Turn stats ");
	term.brightBlack("turn ");
	term.white("%s", formatNumber(stats.turn));
	term.brightBlack("  ·  elapsed ");
	term.white("%s", formatMs(stats.elapsedMs));

	if (stats.firstTokenMs != null) {
		term.brightBlack("  ·  first token ");
		term.white("%s", formatMs(stats.firstTokenMs));
	}

	term.brightBlack("  ·  req ");
	term.white("%s", formatNumber(stats.requests));
	term.brightBlack("  ·  in ");
	term.white("%s", formatNumber(stats.inputTokens));
	term.brightBlack("  ·  out ");
	term.white("%s", formatNumber(stats.outputTokens));
	term.brightBlack("  ·  total ");
	term.white("%s", formatNumber(stats.totalTokens));

	if (stats.cancelled) {
		term.brightBlack("  ·  ");
		term.brightRed("stopped");
	}

	term("\n");
	printAppStats();
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

const isRecord = (value: unknown): value is UnknownRecord =>
	typeof value === "object" && value !== null;

const getString = (value: unknown, key: string): string | undefined => {
	if (!isRecord(value)) {
		return undefined;
	}

	const result = value[key];
	return typeof result === "string" ? result : undefined;
};

const getRecord = (value: unknown, key: string): UnknownRecord | undefined => {
	if (!isRecord(value)) {
		return undefined;
	}

	const result = value[key];
	return isRecord(result) ? result : undefined;
};

const maybeParseJsonString = (value: string): unknown => {
	const trimmed = value.trim();

	if (!trimmed) {
		return value;
	}

	const looksJson =
		(trimmed.startsWith("{") && trimmed.endsWith("}")) ||
		(trimmed.startsWith("[") && trimmed.endsWith("]")) ||
		(trimmed.startsWith('"') && trimmed.endsWith('"'));

	if (!looksJson) {
		return value;
	}

	try {
		return JSON.parse(trimmed);
	} catch {
		return value;
	}
};

const previewTextFrom = (value: unknown): string => {
	if (typeof value === "string") {
		const parsed = maybeParseJsonString(value);

		if (typeof parsed === "string") {
			return parsed;
		}

		try {
			return JSON.stringify(parsed, null, 2);
		} catch {
			return String(parsed);
		}
	}

	if (value == null) {
		return "[empty]";
	}

	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return String(value);
	}
};

const formatPreviewLines = (
	value: unknown,
	options?: {
		maxLines?: number;
		maxChars?: number;
		maxWidth?: number;
	},
): string[] => {
	const maxLines = options?.maxLines ?? 8;
	const maxChars = options?.maxChars ?? 1_200;
	const maxWidth = options?.maxWidth ?? Math.max(40, term.width - 14);

	let text = previewTextFrom(value);
	let charTruncated = false;

	if (text.length > maxChars) {
		text = `${text.slice(0, maxChars)}…`;
		charTruncated = true;
	}

	const rawLines = text.replace(/\t/g, "  ").split("\n");
	const lines = rawLines
		.slice(0, maxLines)
		.map((line) =>
			line.length > maxWidth ? `${line.slice(0, Math.max(1, maxWidth - 1))}…` : line,
		);

	if (rawLines.length > maxLines) {
		lines.push(`… +${rawLines.length - maxLines} more lines`);
	} else if (charTruncated) {
		lines.push("… output truncated");
	}

	return lines.length > 0
		? lines
		: [
				"[empty]",
			];
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
	let label = "thinking";

	const render = () => {
		if (!active) {
			return;
		}

		clearCurrentLine();
		term.bold.brightCyan("agent");
		term.white(" > ");
		term.brightYellow("%s ", frames[frameIndex]);
		term.bold.brightWhite("%s", label);

		frameIndex = (frameIndex + 1) % frames.length;
	};

	render();

	const timer = setInterval(render, 80);

	return {
		setLabel(nextLabel: string) {
			label = nextLabel;
		},
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

term.grabInput({});
term.on("key", onKey);

const askInput = async () => {
	term.bold.brightGreen("you");
	term.white(" > ");

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
	term.white(" > ");
	term.white("%s", agentName);
	term.white(" wants to run ");
	term.brightCyan("%s", toolName);
	term("\n");

	if (toolArguments.trim()) {
		term.bold.brightWhite("args");
		term.white("      ");
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

const extractCallId = (value: unknown): string | undefined =>
	getString(value, "callId") ?? getString(value, "call_id") ?? getString(value, "id");

const extractToolInput = (item: unknown, rawItem: unknown): unknown => {
	const args = getString(rawItem, "arguments");

	if (typeof args === "string") {
		return maybeParseJsonString(args);
	}

	if (isRecord(rawItem) && "input" in rawItem) {
		return rawItem.input;
	}

	if (isRecord(item) && "input" in item) {
		return item.input;
	}

	return undefined;
};

const extractToolOutput = (item: unknown, rawItem: unknown): unknown => {
	if (isRecord(item) && "output" in item) {
		return item.output;
	}

	if (isRecord(rawItem) && "output" in rawItem) {
		return rawItem.output;
	}

	if (isRecord(rawItem) && "result" in rawItem) {
		return rawItem.result;
	}

	return undefined;
};

const collectToolViews = (items: unknown[]): ToolView[] => {
	const views: ToolView[] = [];
	const byId = new Map<string, ToolView>();
	let anonymousCounter = 0;

	for (const item of items) {
		if (!isRecord(item)) {
			continue;
		}

		const type = getString(item, "type");
		const rawItem = getRecord(item, "rawItem");
		const agentName = getString(getRecord(item, "agent"), "name");

		if (type === "tool_call_item") {
			const id = extractCallId(rawItem) ?? `tool-${++anonymousCounter}`;
			let view = byId.get(id);

			if (!view) {
				view = {
					id,
					name:
						getString(rawItem, "name") ??
						getString(item, "name") ??
						`tool_${anonymousCounter}`,
				};

				byId.set(id, view);
				views.push(view);
			}

			view.agentName ??= agentName;

			const input = extractToolInput(item, rawItem);
			if (input !== undefined) {
				view.input = input;
			}

			continue;
		}

		if (type === "tool_call_output_item") {
			const id = extractCallId(rawItem) ?? `tool-${++anonymousCounter}`;
			let view = byId.get(id);

			if (!view) {
				view = {
					id,
					name:
						getString(rawItem, "name") ??
						getString(item, "name") ??
						`tool_${anonymousCounter}`,
				};

				byId.set(id, view);
				views.push(view);
			}

			view.agentName ??= agentName;

			const output = extractToolOutput(item, rawItem);
			if (output !== undefined) {
				view.output = output;
			}
		}
	}

	return views;
};

const printToolBlock = (view: ToolView, index: number) => {
	term.bold.brightMagenta("tool");
	term.brightBlack(" #");
	term.white("%s", String(index + 1));
	term.brightBlack("  ·  ");
	term.bold.brightCyan("%s", view.name);

	if (view.agentName) {
		term.brightBlack("  ·  ");
		term.white("%s", view.agentName);
	}

	term("\n");

	if (view.input !== undefined) {
		term.bold.brightWhite("  input\n");
		for (const line of formatPreviewLines(view.input)) {
			term.brightBlack("    │ ");
			term.white("%s\n", line);
		}
	}

	if (view.output !== undefined) {
		term.bold.brightWhite("  output\n");
		for (const line of formatPreviewLines(view.output)) {
			term.brightBlack("    │ ");
			term.white("%s\n", line);
		}
	}
};

const printToolViews = (items: unknown[]) => {
	const tools = collectToolViews(items);

	if (tools.length === 0) {
		return;
	}

	printDivider();
	term.bold.brightWhite("Tool calls\n");

	tools.forEach((tool, index) => {
		printToolBlock(tool, index);

		if (index < tools.length - 1) {
			term.brightBlack("  ");
			term.brightBlack("%s\n", "·".repeat(Math.max(10, term.width - 6)));
		}
	});
};

const streamAssistantOutput = async (input: string | ResumeState) => {
	let nextInput: string | ResumeState = input;

	while (appState.running) {
		const turnStartedAt = Date.now();
		const abortController = new AbortController();
		const thinking = createThinkingIndicator();

		let stream: Awaited<ReturnType<typeof runner.run>> | null = null;
		let wroteAnyText = false;
		let firstTokenMs: number | null = null;

		appState.activeAbortController = abortController;
		appState.streaming = true;

		try {
			stream = await runner.run(CoreAgent, nextInput, {
				session,
				stream: true,
				signal: abortController.signal,
			});

			const textSink = new Writable({
				write(chunk, _encoding, callback) {
					if (!wroteAnyText) {
						wroteAnyText = true;
						firstTokenMs = Date.now() - turnStartedAt;
						thinking.stop();

						term.bold.brightCyan("agent");
						term.white(" > ");
					}

					term.white("%s", chunk.toString());
					callback();
				},
			});

			await pipeline(
				stream.toTextStream({
					compatibleWithNodeStreams: true,
				}),
				textSink,
			);
		} catch (error) {
			const aborted =
				abortController.signal.aborted || stream?.cancelled || isAbortLikeError(error);

			if (!aborted) {
				thinking.stop();
				appState.streaming = false;
				appState.activeAbortController = null;
				throw error;
			}
		} finally {
			thinking.stop();

			if (stream) {
				try {
					await stream.completed;
				} catch (error) {
					const aborted =
						abortController.signal.aborted ||
						stream.cancelled ||
						isAbortLikeError(error);

					if (!aborted) {
						appState.streaming = false;
						appState.activeAbortController = null;
						throw error;
					}
				}
			}

			appState.streaming = false;
			appState.activeAbortController = null;
		}

		if (!stream) {
			return;
		}

		const wasCancelled = abortController.signal.aborted || stream.cancelled;
		const turnUsage = usageFrom(stream.runContext.usage);
		const turnElapsedMs = Date.now() - turnStartedAt;

		appState.turn += 1;
		addUsage(appState.appUsage, turnUsage);

		if (wasCancelled) {
			if (wroteAnyText) {
				term("\n");
			} else {
				term.bold.brightCyan("agent");
				term.white(" > ");
			}

			term.brightRed("[stream stopped]\n");
			printToolViews(stream.newItems as unknown[]);

			printTurnStats({
				turn: appState.turn,
				elapsedMs: turnElapsedMs,
				firstTokenMs,
				cancelled: true,
				...turnUsage,
			});

			return;
		}

		if (!wroteAnyText) {
			const fallback = normalizeOutput(stream.finalOutput);

			term.bold.brightCyan("agent");
			term.white(" > ");

			if (fallback) {
				term.white("%s\n", fallback);
			} else if (stream.interruptions?.length) {
				term.brightBlack("[waiting for approval]\n");
			} else {
				term.brightBlack("[no output]\n");
			}
		} else {
			term("\n");
		}

		printToolViews(stream.newItems as unknown[]);

		printTurnStats({
			turn: appState.turn,
			elapsedMs: turnElapsedMs,
			firstTokenMs,
			cancelled: false,
			...turnUsage,
		});

		if (!stream.interruptions?.length) {
			return;
		}

		const state = stream.state;

		for (const interruption of stream.interruptions) {
			const approved = await askApproval(
				interruption.agent.name,
				interruption.name ?? "unknown_tool",
				interruption.arguments ?? "",
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
	term.bold.brightWhite("  Ctrl+C");
	term.white("  Gracefully exit the app\n");
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
