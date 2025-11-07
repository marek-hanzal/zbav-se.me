import type { Toast } from "./Toast";
import { useToastContext } from "./useToastContext";

export const useToast = () => {
	const useToastStore = useToastContext();
	const $toast = useToastStore((store) => store.toast);
	const $pull = useToastStore((store) => store.pull);

	return (toast: Toast) => {
		$toast(toast);
		$pull();
	};
};
