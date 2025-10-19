import { Tx, type useSnapperNav } from "@use-pico/client";
import { type FC, memo } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Condition } from "~/app/listing/ui/CreateListing/Condition/Condition";
import { LeftButton } from "~/app/listing/ui/CreateListing/LeftButton";
import { ListingProgress } from "~/app/listing/ui/CreateListing/ListingProgress";
import { NextButton } from "~/app/listing/ui/CreateListing/NextButton";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { AgeIcon } from "~/app/ui/icon/AgeIcon";
import { Title } from "~/app/ui/title/Title";

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
			<FlowContainer>
				<ListingProgress />

				<Title
					textTitle={
						hasAge
							? `Condition - Age [${age}] (title)`
							: "Condition - Age (title)"
					}
					left={<LeftButton listingNav={listingNav} />}
				/>

				<Condition
					icon={AgeIcon}
					textTitle={"Condition - Age (title)"}
					textDescription={"Condition - Age (description)"}
					textHint={<Tx label={`Condition - Age [${age}] (hint)`} />}
					value={age}
					onChange={setAge}
					limit={5}
				/>

				<BottomContainer>
					<div />

					<NextButton
						listingNav={listingNav}
						disabled={!hasAge}
					/>
				</BottomContainer>
			</FlowContainer>
		);
	},
);
