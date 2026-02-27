import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace HomeMenuDraftLink {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

/**
 * Renders a dedicated home menu draft navigation link with domain-specific state handling.
 * Use it when the home menu draft destination should be shown conditionally in navigation.
 *
 * @see apps/app/src/app/@user/home/page/HomePage.tsx
 */
export const HomeMenuDraftLink: FC<HomeMenuDraftLink.Props> = ({ icon, ...props }) => {
	return (
		<Suspense fallback={<Pending iconUi={icon} />}>
			<Data
				_suspense={"I know"}
				icon={icon}
				{...props}
			/>
		</Suspense>
	);
};
