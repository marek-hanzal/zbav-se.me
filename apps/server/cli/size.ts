import { promises as fs } from "node:fs";
import * as path from "node:path";

type Row = {
	stamp: string; // ISO timestamp
	files: number; // number of regular files
	bytes: number; // total size in bytes
};

const CONFIG = {
	root: ".vercel",
	reportNdjson: "bundle.size.ndjson",
} as const;

async function exists(p: string) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}

// Recursively sum sizes of regular files; ignore dirs and special files/symlinks.
async function countAllBytes(root: string): Promise<{
	files: number;
	bytes: number;
}> {
	let files = 0;
	let bytes = 0;

	async function walk(dir: string): Promise<void> {
		let entries: import("node:fs").Dirent[];
		try {
			entries = await fs.readdir(dir, {
				withFileTypes: true,
			});
		} catch {
			return;
		}
		for (const e of entries) {
			const p = path.join(dir, e.name);
			if (e.isDirectory()) {
				await walk(p);
			} else if (e.isFile()) {
				try {
					const st = await fs.stat(p);
					files += 1;
					bytes += st.size;
				} catch {
					// ignore unreadable/transient files
				}
			}
		}
	}

	await walk(root);
	return {
		files,
		bytes,
	};
}

function nowIso() {
	return new Date().toISOString();
}

async function ensureReportFiles() {
	if (!(await exists(CONFIG.reportNdjson))) {
		await fs.writeFile(CONFIG.reportNdjson, "", "utf8");
	}
}

function fmt(n: number) {
	const mb = (n / (1024 * 1024)).toFixed(2);
	return `${mb} MB`;
}

async function main() {
	if (!(await exists(CONFIG.root))) {
		console.error(`Missing ${CONFIG.root}/ — build/export first.`);
		process.exit(2);
	}

	const { files, bytes } = await countAllBytes(CONFIG.root);
	const row: Row = {
		stamp: nowIso(),
		files,
		bytes,
	};

	await ensureReportFiles();
	await fs.appendFile(
		CONFIG.reportNdjson,
		`${JSON.stringify(row)}
`,
		"utf8",
	);

	console.log(`\t Bundle size – files=${files} size=${fmt(bytes)}`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
