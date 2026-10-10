export function sleepFn(ms: number) {
	return new Promise((rFn) => setTimeout(rFn, ms));
}
