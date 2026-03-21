export const sh = (cmd: string[], cwd: string, hint: string) => {
	const proc = Bun.spawnSync({
		cmd,
		cwd,
		stdout: "pipe",
		stderr: "pipe",
	});
	const stderr = new TextDecoder().decode(proc.stderr).trim();
	const stdout = new TextDecoder().decode(proc.stdout).trim();

	if (proc.exitCode !== 0) {
		throw new Error(`${hint}\n${stderr}`.trim());
	}

	return {
		stdout,
	};
};
