import { SpinnerContainer } from "@use-pico/client/ui/container";
import { type FC, Suspense } from "react";
import { Data } from "./Data";

export namespace Content {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const Content: FC<Content.Props> = (props) => {
	return (
		<Suspense fallback={<SpinnerContainer />}>
			<Data
				_suspense={"I know"}
				data-ui={"Content"}
				{...props}
			/>
		</Suspense>
	);
};
