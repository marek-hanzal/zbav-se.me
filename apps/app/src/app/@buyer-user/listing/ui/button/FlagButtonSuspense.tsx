import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/listing/ui/button/FlagButtonSuspense/Data";
import { Pending } from "~/app/@buyer-user/listing/ui/button/FlagButtonSuspense/Pending";

export namespace FlagButtonSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const FlagButtonSuspense: FC<FlagButtonSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
