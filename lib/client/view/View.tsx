import type { PropsWithChildren } from "react";
import type { useView } from "./useView";

export namespace View {
	export interface Props<TPanel extends string, TProps extends object | unknown = unknown>
		extends PropsWithChildren {
		control: useView.Use<TPanel, TProps>;
	}
}

export const View = <TPanel extends string, TProps extends object | unknown = unknown>({
	children,
}: View.Props<TPanel, TProps>) => {
	return children;
};
