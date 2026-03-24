export function shOptional(cmd: string[]) {
	const proc = Bun.spawnSync({
		cmd,
		stdout: "pipe",
		stderr: "pipe",
	});

	if (proc.exitCode !== 0) {
		return null;
	}

	return {
		proc,
		stdout: new TextDecoder().decode(proc.stdout).trim(),
	} as const;
}
