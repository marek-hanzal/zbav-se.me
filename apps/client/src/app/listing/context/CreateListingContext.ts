import { createContext } from "react";
import { createListingStore } from "~/app/listing/store/createListingStore";

export const CreateListingContext = createContext(
	createListingStore({
		photoCountLimit: 10,
		defaultCurrency: "CZK",
	}),
);
