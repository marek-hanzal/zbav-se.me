import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace Preview {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const Preview: FC<Preview.Props> = ({ uploadId, ...props }) => {
	if (!uploadId) {
		return null;
	}

	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				uploadId={uploadId}
				{...props}
			/>
		</Suspense>
	);
};
