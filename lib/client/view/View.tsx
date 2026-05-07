import type { PropsWithChildren } from "react";
import type { useView } from "./useView";

export namespace View {
	export interface Props<TPanel extends string> extends PropsWithChildren {
		control: useView.Use<TPanel>;
	}
}

export const View = <TPanel extends string>({ children }: View.Props<TPanel>) => {
	return children;
};
