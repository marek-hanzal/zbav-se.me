import { type FC, memo } from "react";
import { Condition } from "~/app/listing/ui/CreateListing/Condition/Condition";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";

export const ConditionOverallWrapper: FC = memo(() => {
	return (
		<ListingContainer textTitle={"Condition - Overall (title)"}>
			<Condition
				textHint={(value) => `Condition - Overall [${value}] (hint)`}
				value={0}
				onChange={() => {}}
			/>
		</ListingContainer>
	);
});
