import { useContext } from "react";
import { CreateListingContext } from "~/app/listing/context/CreateListingContext";

export const useCreateListingContext = () => {
	const context = useContext(CreateListingContext);

	if (!context) {
		throw new Error("CreateListingContext not found");
	}

	return context;
};
