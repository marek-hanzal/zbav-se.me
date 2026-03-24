export function sh(cmd: string[], hint: string) {
	const proc = Bun.spawnSync({
		cmd,
		stdout: "pipe",
		stderr: "pipe",
	});
	const stdout = new TextDecoder().decode(proc.stdout).trim();
	const stderr = new TextDecoder().decode(proc.stderr).trim();

	if (proc.exitCode !== 0) {
		throw new Error(`${hint}\n${stderr}`.trim());
	}

	return {
		proc,
		stdout,
	} as const;
}
