export const handleArrowNav = (e: React.KeyboardEvent<HTMLElement>) => {
	if (!e.key.startsWith("Arrow")) {
		return;
	}

	const direction = e.key.slice("Arrow".length);
	const datasetKey = `arrow${direction}` as const;
	const nextId = e.currentTarget.dataset[datasetKey];

	if (!nextId) {
		return;
	}

	const nextNode = document.getElementById(nextId);

	if (!nextNode) {
		return;
	}

	e.preventDefault();
	nextNode.focus();
};
