import { Tx, type useSnapperNav } from "@use-pico/client";
import { type FC, memo } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Condition } from "~/app/listing/ui/CreateListing/Condition/Condition";
import { LeftButton } from "~/app/listing/ui/CreateListing/LeftButton";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { ConditionIcon } from "~/app/ui/icon/ConditionIcon";
import { Title } from "~/app/ui/title/Title";

export namespace ConditionOverallWrapper {
	export interface Props {
		listingNav: useSnapperNav.Result;
	}
}

export const ConditionOverallWrapper: FC<ConditionOverallWrapper.Props> = memo(
	({ listingNav }) => {
		const useCreateListingStore = useCreateListingContext();
		const hasCondition = useCreateListingStore(
			(store) => store.hasCondition,
		);
		const condition = useCreateListingStore((state) => state.condition);
		const setCondition = useCreateListingStore(
			(state) => state.setCondition,
		);

		return (
			<ListingContainer
				listingNavApi={listingNav.api}
				bottom={{
					next: hasCondition,
				}}
			>
				<Title
					textTitle={
						hasCondition
							? `Condition - Overall [${condition}] (title)`
							: "Condition - Overall (title)"
					}
					left={<LeftButton listingNavApi={listingNav.api} />}
				/>

				<Condition
					icon={ConditionIcon}
					textTitle={"Condition - Overall (title)"}
					textDescription={"Condition - Overall (description)"}
					textHint={
						<Tx
							label={`Condition - Overall [${condition}] (hint)`}
						/>
					}
					value={condition}
					onChange={setCondition}
					limit={5}
				/>
			</ListingContainer>
		);
	},
);
