import { Container } from "@use-pico/client";
import type { FC } from "react";
import { ConditionAge } from "~/app/listing/ui/CreateListing/Condition/ConditionAge";
import { ConditionOverall } from "~/app/listing/ui/CreateListing/Condition/ConditionOverall";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Title } from "~/app/ui/title/Title";

export const ConditionWrapper: FC = () => {
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

			<BottomContainer>hovno</BottomContainer>
		</FlowContainer>
	);
};
