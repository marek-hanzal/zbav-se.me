import { type FC, memo } from "react";
import { Condition } from "~/app/listing/ui/CreateListing/Condition/Condition";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";

export const ConditionAgeWrapper: FC = memo(() => {
	return (
		<ListingContainer textTitle={"Condition - Age (title)"}>
			<Condition
				textHint={(value) => `Condition - Age [${value}] (hint)`}
				value={0}
				onChange={() => {}}
			/>
		</ListingContainer>
	);
});
