import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace HomeMenuDraftLinkSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const HomeMenuDraftLinkSuspense: FC<HomeMenuDraftLinkSuspense.Props> = ({
	icon,
	...props
}) => {
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
