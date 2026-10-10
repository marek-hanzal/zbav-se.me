import type { FC, PropsWithChildren } from "react";
import { VisibilityContext } from "~/visibility/context/VisibilityContext";
import type { createVisibilityStoreFn } from "~/visibility/fn/createVisibilityStoreFn";

export namespace VisibilityProvider {
	export interface Props extends PropsWithChildren {
		storeFn: createVisibilityStoreFn.Hook;
	}
}

export const VisibilityProvider: FC<VisibilityProvider.Props> = ({ children, storeFn }) => {
	return <VisibilityContext value={storeFn}>{children}</VisibilityContext>;
};
