import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	useSnapperNav,
} from "@use-pico/client";
import { type FC, useRef } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ConditionAge } from "~/app/listing/ui/CreateListing/Condition/ConditionAge";
import { ConditionOverall } from "~/app/listing/ui/CreateListing/Condition/ConditionOverall";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Title } from "~/app/ui/title/Title";

export namespace ConditionWrapper {
	export interface Props {
		listingNavApi: useSnapperNav.Api;
	}
}

export const ConditionWrapper: FC<ConditionWrapper.Props> = ({
	listingNavApi,
}) => {
	const useCreateListingStore = useCreateListingContext();
	const hasCondition = useCreateListingStore((store) => store.hasCondition);
	const hasAge = useCreateListingStore((store) => store.hasAge);

	const conditionSnapperRef = useRef<HTMLDivElement>(null);
	const conditionSnapperNav = useSnapperNav({
		containerRef: conditionSnapperRef,
		orientation: "horizontal",
		count: 2,
	});

	return (
		<FlowContainer>
			<Title textTitle={"Condition (title)"} />

			<Container
				ref={conditionSnapperRef}
				layout={"horizontal-full"}
				snap={"horizontal-start"}
				overflow={"horizontal"}
				gap={"md"}
			>
				<ConditionOverall />

				<ConditionAge />
			</Container>

			<BottomContainer>
				<Button
					iconEnabled={ArrowLeftIcon}
					iconPosition={"left"}
					tone={"secondary"}
					theme={"light"}
					onClick={() => {
						if (conditionSnapperNav.state.current === 1) {
							conditionSnapperNav.api.prev();
							return;
						}
						listingNavApi.prev();
					}}
				/>

				<Button
					iconEnabled={ArrowRightIcon}
					iconPosition={"right"}
					disabled={
						(!hasCondition &&
							conditionSnapperNav.state.current === 0) ||
						(!hasAge && conditionSnapperNav.state.current === 1)
					}
					tone={"secondary"}
					theme={"dark"}
					onClick={() => {
						if (hasCondition && hasAge) {
							listingNavApi.next();
						} else if (hasCondition) {
							conditionSnapperNav.api.next();
						}
					}}
				/>
			</BottomContainer>
		</FlowContainer>
	);
};
