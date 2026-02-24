import type { EditorSheet } from "~/app/@buyer-user/feed/ui/EditorSheet";

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
