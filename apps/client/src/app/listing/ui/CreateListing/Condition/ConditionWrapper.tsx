import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	type useSnapperNav,
} from "@use-pico/client";
import type { FC } from "react";
import { ConditionAge } from "~/app/listing/ui/CreateListing/Condition/ConditionAge";
import { ConditionOverall } from "~/app/listing/ui/CreateListing/Condition/ConditionOverall";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Title } from "~/app/ui/title/Title";

export namespace ConditionWrapper {
	export interface Props {
		listingNav: useSnapperNav.Result;
	}
}

export const ConditionWrapper: FC<ConditionWrapper.Props> = ({
	listingNav,
}) => {
	return (
		<FlowContainer>
			<Title textTitle={"Condition (title)"} />

			<Container
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
					onClick={() => listingNav.prev()}
				/>

				<Button
					iconEnabled={ArrowRightIcon}
					iconPosition={"right"}
					tone={"secondary"}
					theme={"dark"}
					onClick={() => listingNav.next()}
				/>
			</BottomContainer>
		</FlowContainer>
	);
};
