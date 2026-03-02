import { type FC, Suspense } from "react";
import { Data } from "~/app/v0/@buyer/feed/ui/FeedEditor/Data";
import { Pending } from "~/app/v0/@buyer/feed/ui/FeedEditor/Pending";

export namespace FeedEditor {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const FeedEditor: FC<FeedEditor.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
