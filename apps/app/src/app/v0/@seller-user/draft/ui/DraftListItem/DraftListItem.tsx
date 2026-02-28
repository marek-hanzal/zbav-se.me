import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace DraftListItem {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		draftId: string;
	}
}

export const DraftListItem: FC<DraftListItem.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
