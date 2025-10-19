import { Tx, type useSnapperNav } from "@use-pico/client";
import { type FC, memo } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Condition } from "~/app/listing/ui/CreateListing/Condition/Condition";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { ConditionIcon } from "~/app/ui/icon/ConditionIcon";

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
				textTitle={"Condition - Overall (title)"}
				bottom={{
					next: hasCondition,
				}}
			>
				<Condition
					icon={ConditionIcon}
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
