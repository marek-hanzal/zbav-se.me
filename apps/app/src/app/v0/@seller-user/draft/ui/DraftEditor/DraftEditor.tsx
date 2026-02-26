import { type FC, Suspense } from "react";
import { Data } from "~/app/@seller-user/draft/ui/DraftEditor/Data";
import { Pending } from "~/app/@seller-user/draft/ui/DraftEditor/Pending";

export namespace DraftEditor {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const DraftEditor: FC<DraftEditor.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
