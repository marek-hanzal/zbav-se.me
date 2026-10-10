import type { FC, PropsWithChildren } from "react";
import { VisibilityContext } from "~/visibility/context/VisibilityContext";
import type { createVisibilityStore } from "~/visibility/fn/createVisibilityStore";

export namespace VisibilityProvider {
	export interface Props extends PropsWithChildren {
		store: createVisibilityStore.Hook;
	}
}

export const VisibilityProvider: FC<VisibilityProvider.Props> = ({ children, store }) => {
	return <VisibilityContext value={store}>{children}</VisibilityContext>;
};
