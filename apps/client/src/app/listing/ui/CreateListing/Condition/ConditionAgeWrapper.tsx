import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Tx,
	type useSnapperNav,
} from "@use-pico/client";
import { type FC, memo } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Condition } from "~/app/listing/ui/CreateListing/Condition/Condition";
import { ListingProgress } from "~/app/listing/ui/CreateListing/ListingProgress";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Title } from "~/app/ui/title/Title";

export namespace ConditionAgeWrapper {
	export interface Props {
		listingNavApi: useSnapperNav.Api;
	}
}

export const ConditionAgeWrapper: FC<ConditionAgeWrapper.Props> = memo(
	({ listingNavApi }) => {
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
							? `Condition - Age [${age}] (label)`
							: "Condition - Age (title)"
					}
					right={
						<Button
							iconEnabled={ArrowLeftIcon}
							iconPosition={"left"}
							tone={"secondary"}
							theme={"light"}
							onClick={() => {
								listingNavApi.prev();
							}}
						/>
					}
				/>

				<Condition
					icon={"icon-[hugeicons--package-process]"}
					textTitle={"Condition - Age (title)"}
					textDescription={"Condition - Age (description)"}
					textHint={<Tx label={`Condition - Age [${age}] (hint)`} />}
					value={age}
					onChange={setAge}
					limit={5}
				/>

				<BottomContainer>
					<Button
						iconEnabled={ArrowRightIcon}
						iconPosition={"right"}
						disabled={!hasAge}
						tone={"secondary"}
						theme={"dark"}
						onClick={() => {
							listingNavApi.next();
						}}
						size={"lg"}
					/>
				</BottomContainer>
			</FlowContainer>
		);
	},
);
