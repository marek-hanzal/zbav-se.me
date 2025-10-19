import { Tx, type useSnapperNav } from "@use-pico/client";
import { type FC, memo } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Condition } from "~/app/listing/ui/CreateListing/Condition/Condition";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { AgeIcon } from "~/app/ui/icon/AgeIcon";

export namespace ConditionAgeWrapper {
	export interface Props {
		listingNav: useSnapperNav.Result;
	}
}

export const ConditionAgeWrapper: FC<ConditionAgeWrapper.Props> = memo(
	({ listingNav }) => {
		const useCreateListingStore = useCreateListingContext();
		const hasAge = useCreateListingStore((store) => store.hasAge);
		const age = useCreateListingStore((state) => state.age);
		const setAge = useCreateListingStore((state) => state.setAge);

		return (
			<ListingContainer
				listingNavApi={listingNav.api}
				textTitle={"Condition - Age (title)"}
				bottom={{
					next: hasAge,
				}}
			>
				<Condition
					icon={AgeIcon}
					textHint={<Tx label={`Condition - Age [${age}] (hint)`} />}
					value={age}
					onChange={setAge}
					limit={5}
				/>
			</ListingContainer>
		);
	},
);
