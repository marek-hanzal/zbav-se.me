/**
 * Create a deep clone of `liveRoot` and stamp runtime state
 * (form values, open, selected, canvas snapshot, etc.)
 * into the clone so its HTML reflects the current visual state.
 *
 * Intended for snapshotting a live DOM node into static HTML,
 * e.g. for ghost overlays with dangerouslySetInnerHTML.
 */
export function deepHtml(root: HTMLElement): HTMLElement {
	const cloneRoot = root.cloneNode(true) as HTMLElement;

	// --- INPUT ---
	{
		const live = root.querySelectorAll<HTMLInputElement>("input");
		const clone = cloneRoot.querySelectorAll<HTMLInputElement>("input");
		live.forEach((src, i) => {
			const dst = clone[i];
			if (!dst) {
				return;
			}

			// value (text/number/range/...)
			if (src.type !== "checkbox" && src.type !== "radio") {
				dst.setAttribute("value", src.value ?? "");
			}

			// checked (checkbox/radio)
			if (src.type === "checkbox" || src.type === "radio") {
				if (src.checked) {
					dst.setAttribute("checked", "");
				} else {
					dst.removeAttribute("checked");
				}
			}

			// indeterminate (visual state of checkbox)
			if (src.type === "checkbox") {
				if ((src as any).indeterminate) {
					dst.setAttribute("data-indeterminate", "true");
				} else {
					dst.removeAttribute("data-indeterminate");
				}
			}
		});
	}

	// --- TEXTAREA ---
	{
		const live = root.querySelectorAll<HTMLTextAreaElement>("textarea");
		const clone =
			cloneRoot.querySelectorAll<HTMLTextAreaElement>("textarea");
		live.forEach((src, i) => {
			const dst = clone[i];
			if (!dst) {
				return;
			}
			dst.textContent = src.value ?? "";
		});
	}

	// --- SELECT / OPTION ---
	{
		const live = root.querySelectorAll<HTMLSelectElement>("select");
		const clone = cloneRoot.querySelectorAll<HTMLSelectElement>("select");
		live.forEach((src, i) => {
			const dst = clone[i];
			if (!dst) {
				return;
			}

			const isMultiple = src.multiple;
			const selected = new Set(
				Array.from(src.options)
					.filter((o) => o.selected)
					.map((o) => o.value),
			);

			Array.from(dst.options).forEach((opt) => {
				if (isMultiple) {
					if (selected.has(opt.value)) {
						opt.setAttribute("selected", "");
					} else {
						opt.removeAttribute("selected");
					}
				} else {
					if (src.value === opt.value) {
						opt.setAttribute("selected", "");
					} else {
						opt.removeAttribute("selected");
					}
				}
			});
		});
	}

	// --- DETAILS ---
	{
		const live = root.querySelectorAll<HTMLDetailsElement>("details");
		const clone = cloneRoot.querySelectorAll<HTMLDetailsElement>("details");
		live.forEach((src, i) => {
			const dst = clone[i];
			if (!dst) {
				return;
			}
			if (src.open) {
				dst.setAttribute("open", "");
			} else {
				dst.removeAttribute("open");
			}
		});
	}

	// --- DIALOG ---
	{
		const live = root.querySelectorAll<HTMLDialogElement>("dialog");
		const clone = cloneRoot.querySelectorAll<HTMLDialogElement>("dialog");
		live.forEach((src, i) => {
			const dst = clone[i];
			if (!dst) {
				return;
			}
			if (src.open) {
				dst.setAttribute("open", "");
			} else {
				dst.removeAttribute("open");
			}
		});
	}

	// --- CANVAS → replace with IMG snapshot ---
	{
		const live = root.querySelectorAll<HTMLCanvasElement>("canvas");
		const clone = cloneRoot.querySelectorAll<HTMLCanvasElement>("canvas");
		live.forEach((src, i) => {
			const dst = clone[i];
			if (!dst) {
				return;
			}
			try {
				const dataUrl = src.toDataURL("image/png");
				const img = new Image();
				img.src = dataUrl;
				img.width = src.width;
				img.height = src.height;
				dst.replaceWith(img);
			} catch {
				// Tainted canvas cannot be read, leave the canvas as is
			}
		});
	}

	return cloneRoot;
}
