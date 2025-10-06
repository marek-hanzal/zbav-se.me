import { type FC, type PropsWithChildren, useMemo } from "react";
import { CreateListingContext } from "~/app/listing/context/CreateListingContext";
import { createListingStore } from "~/app/listing/store/createListingStore";

export namespace CreateListingProvider {
	export interface Props extends PropsWithChildren {
		photoCountLimit: number;
	}
}

export const CreateListingProvider: FC<CreateListingProvider.Props> = ({
	photoCountLimit,
	children,
}) => {
	const store = useMemo(
		() =>
			createListingStore({
				photoCountLimit,
			}),
		[
			photoCountLimit,
		],
	);

	return (
		<CreateListingContext value={store}>{children}</CreateListingContext>
	);
};
