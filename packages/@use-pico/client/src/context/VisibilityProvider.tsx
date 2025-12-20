import type { FC, PropsWithChildren } from "react";
import type { useElementVisibility } from "../hook";
import { VisibilityContext } from "./VisibilityContext";

export namespace VisibilityProvider {
	export interface Props extends PropsWithChildren {
		state: useElementVisibility.Result;
	}
}

export const VisibilityProvider: FC<VisibilityProvider.Props> = ({ children, state }) => {
	return <VisibilityContext value={state}>{children}</VisibilityContext>;
};
