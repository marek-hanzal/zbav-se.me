import { type FC, useId } from "react";
import { useToastContext } from "./useToastContext";

export namespace Toaster {
	export interface Props {
		foo?: boolean;
	}
}

export const Toaster: FC<Toaster.Props> = () => {
	const useToastStore = useToastContext();
	const $store = useToastStore();
	const getVisible = useToastStore((store) => store.getVisible);
	const toastId = useId();

	return (
		<div>
			{getVisible().map((toast) => {
				return toast.render({
					store: $store,
					toastId,
					toast,
				});
			})}
		</div>
	);
};
