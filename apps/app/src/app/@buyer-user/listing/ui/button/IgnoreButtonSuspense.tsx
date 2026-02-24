import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/listing/ui/button/ignore-button-suspense/Data";
import { Pending } from "~/app/@buyer-user/listing/ui/button/ignore-button-suspense/Pending";

export namespace IgnoreButtonSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const IgnoreButtonSuspense: FC<IgnoreButtonSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
