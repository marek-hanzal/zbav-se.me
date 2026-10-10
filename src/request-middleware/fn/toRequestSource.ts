export function toRequestSource(headers: Headers) {
	const forwardedFor = headers.get("x-forwarded-for");

	if (forwardedFor) {
		const [first] = forwardedFor.split(",");

		if (first) {
			return first.trim();
		}
	}

	return "unknown";
}
