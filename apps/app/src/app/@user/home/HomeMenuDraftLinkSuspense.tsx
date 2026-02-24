import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "~/app/@user/home/home-menu-draft-link-suspense/Data";
import { Pending } from "~/app/@user/home/home-menu-draft-link-suspense/Pending";

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
