import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace HomeMenuDraftLink {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const HomeMenuDraftLink: FC<HomeMenuDraftLink.Props> = ({
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
