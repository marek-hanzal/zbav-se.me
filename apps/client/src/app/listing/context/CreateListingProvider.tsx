import type { CurrencyList } from "@zbav-se.me/sdk";
import { type FC, type PropsWithChildren, useMemo } from "react";
import { CreateListingContext } from "~/app/listing/context/CreateListingContext";
import { createListingStore } from "~/app/listing/store/createListingStore";

export namespace CreateListingProvider {
	export interface Props extends PropsWithChildren {
		photoCountLimit: number;
		defaultCurrency: CurrencyList;
	}
}

export const CreateListingProvider: FC<CreateListingProvider.Props> = ({
	photoCountLimit,
	defaultCurrency,
	children,
}) => {
	const store = useMemo(
		() =>
			createListingStore({
				photoCountLimit,
				defaultCurrency,
			}),
		[
			photoCountLimit,
			defaultCurrency,
		],
	);

	return (
		<CreateListingContext value={store}>{children}</CreateListingContext>
	);
};
