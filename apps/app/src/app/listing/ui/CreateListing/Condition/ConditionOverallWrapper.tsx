import { type FC, memo } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Condition } from "~/app/listing/ui/CreateListing/Condition/Condition";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";

export const ConditionOverallWrapper: FC = memo(() => {
	const useCreateListingStore = useCreateListingContext();
	const hasCondition = useCreateListingStore((store) => store.hasCondition);
	const condition = useCreateListingStore((state) => state.condition);
	const setCondition = useCreateListingStore((state) => state.setCondition);

	return (
		<ListingContainer
			textTitle={"Condition - Overall (title)"}
			bottom={{
				next: hasCondition,
			}}
		>
			<Condition
				textHint={(value) => `Condition - Overall [${value}] (hint)`}
				value={condition}
				onChange={setCondition}
			/>
		</ListingContainer>
	);
});
