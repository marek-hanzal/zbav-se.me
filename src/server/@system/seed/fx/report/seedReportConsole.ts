import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { terminal as term } from "terminal-kit";
import type { SeedCoreReportSchema } from "~/server/@system/seed/fx/report/SeedCoreReportSchema";
import type { SeedInteractionReportSchema } from "~/server/@system/seed/fx/report/SeedInteractionReportSchema";

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
	yellow: withMarkup("^y"),
	blue: withMarkup("^b"),
	cyan: withMarkup("^c"),
	white: withMarkup("^w"),
};

const padRight = (value: string, length: number) => value.padEnd(length, " ");
const padLeft = (value: string, length: number) => value.padStart(length, " ");

const withTableRows = (tables: Record<string, number>) => {
	const rows = Object.entries(tables).sort(([a], [b]) => a.localeCompare(b));
	const keyWidth = Math.max(...rows.map(([key]) => key.length), "table".length);
	const valueWidth = Math.max(...rows.map(([, value]) => String(value).length), "count".length);

	return [
		`${style.dim(padRight("table", keyWidth))}  ${style.dim(padLeft("count", valueWidth))}`,
		...rows.map(
			([key, value]) =>
				`${style.white(padRight(key, keyWidth))}  ${style.cyan(padLeft(String(value), valueWidth))}`,
		),
	];
};

const printTable = (tables: Record<string, number>) => {
	for (const line of withTableRows(tables)) {
		console.log(line);
	}
};

const withInlineItems = (tables: Record<string, number>, max = 6) =>
	Object.entries(tables)
		.sort(([a], [b]) => a.localeCompare(b))
		.slice(0, max)
		.map(([key, value]) => `${style.white(key)}=${style.cyan(String(value))}`);

const withReportHeader = (title: string) => {
	console.log("");
	console.log(style.bold(style.blue(`[SEED] ${title}`)));
	console.log(style.dim("-".repeat(Math.max(title.length + 7, 24))));
};

const withReportCommon = (input: { user: string; userId: string; count: number }) => {
	console.log(`${style.dim("user")}:    ${style.white(input.user)}`);
	console.log(`${style.dim("userId")}:  ${style.white(input.userId)}`);
	console.log(`${style.dim("count")}:   ${style.yellow(String(input.count))}`);
};

export const printSeedCoreReport = (report: SeedCoreReportSchema.Type) => {
	withReportHeader("core report");
	withReportCommon(report);
	console.log("");
	console.log(style.bold(style.green("[DONE] generated core rows in this run")));
	printTable(report.tables);
	console.log("");
	console.log(style.bold(style.blue("[TOTAL] overall core rows after this run")));
	printTable(report.totals);
};

export const printSeedInteractionReport = (report: SeedInteractionReportSchema.Type) => {
	withReportHeader("interaction report");
	withReportCommon(report);
	console.log(`${style.dim("executed")}:${style.yellow(` ${report.executed}`)}`);
	console.log("");
	console.log(style.bold(style.green("[DONE] generated interaction rows in this run")));
	printTable(report.tables);
	console.log("");
	console.log(style.bold(style.blue("[TOTAL] overall interaction rows after this run")));
	printTable(report.totals);
};

export const withInlineCounts = (tables: Record<string, number>, max = 6) => {
	const items = withInlineItems(tables, max);
	const rest = Object.keys(tables).length - items.length;
	const suffix = rest > 0 ? ` ${style.dim(`(+${rest} more)`)}` : "";
	return `${items.join(", ")}${suffix}`;
};

const withGeneratedCount = (tables: Record<string, number>) =>
	Object.values(tables).reduce((acc, value) => acc + Number(value || 0), 0);

export const toSeedBenchmarkJsonl = ({
	kind,
	count,
	tables,
	runtimeMs,
}: {
	kind: "core" | "interaction";
	count: number;
	tables: Record<string, number>;
	runtimeMs: number;
}) => {
	const generatedCount = withGeneratedCount(tables);
	const safeGeneratedCount = Math.max(1, generatedCount);
	const runtimePerGeneratedRowMs = Number((runtimeMs / safeGeneratedCount).toFixed(3));

	return JSON.stringify({
		stamp: new Date().toISOString(),
		kind,
		count,
		generatedCount,
		runtimePerGeneratedRowMs,
	});
};

export const appendSeedBenchmarkJsonl = ({
	kind,
	count,
	tables,
	runtimeMs,
	filePath = "benchmark.jsonl",
}: {
	kind: "core" | "interaction";
	count: number;
	tables: Record<string, number>;
	runtimeMs: number;
	filePath?: string;
}) => {
	const line = toSeedBenchmarkJsonl({
		kind,
		count,
		tables,
		runtimeMs,
	});

	appendFileSync(resolve(process.cwd(), filePath), `${line}\n`, "utf8");

	return line;
};
