import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

/**
 * Renders a dedicated home menu draft navigation link with domain-specific state handling.
 * Use it when the home menu draft destination should be shown conditionally in navigation.
 *
 * @see apps/app/src/app/@user/home/page/HomePage.tsx
 */
export namespace DraftLink {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const DraftLink: FC<DraftLink.Props> = (props) => {
	return (
		<Suspense fallback={<Pending {...props} />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
