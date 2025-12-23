import type { FC, PropsWithChildren } from "react";
import type { createVisibilityStore } from "../store/createVisibilityStore";
import { VisibilityContext } from "./VisibilityContext";

export namespace VisibilityProvider {
	export interface Props extends PropsWithChildren {
		store: createVisibilityStore.Hook;
	}
}

export const VisibilityProvider: FC<VisibilityProvider.Props> = ({ children, store }) => {
	return <VisibilityContext value={store}>{children}</VisibilityContext>;
};
