import type { PropsWithChildren } from "react";
import { getRootLogger } from "~/common/log/getRootLogger";
import { useRenderLogger } from "../log";
import type { useView } from "./useView";

export namespace View {
	export interface Props<TPanel extends string> extends PropsWithChildren {
		control: useView.Use<TPanel>;
	}
}

export const View = <TPanel extends string>({ children }: View.Props<TPanel>) => {
	useRenderLogger({
		logger: getRootLogger("View"),
		name: "View",
	});

	return children;
};
