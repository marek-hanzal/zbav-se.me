import type { EditorSheet } from "~/app/v0/@buyer-user/feed/ui/EditorSheet";

export const toDetailHandlers = (
	setView: (view: EditorSheet.Views) => void,
): {
	onSettled(): void;
	onCancel(): void;
} => {
	return {
		onSettled: () => setView("detail"),
		onCancel: () => setView("detail"),
	};
};
