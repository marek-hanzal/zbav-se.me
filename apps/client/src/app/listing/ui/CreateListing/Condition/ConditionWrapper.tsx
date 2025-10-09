import { Container } from "@use-pico/client";
import type { FC } from "react";
import { ConditionAge } from "~/app/listing/ui/CreateListing/Condition/ConditionAge";
import { ConditionOverall } from "~/app/listing/ui/CreateListing/Condition/ConditionOverall";

export const ConditionWrapper: FC = () => {
	return (
		<Container
			layout={"vertical-full"}
			snap={"vertical-start"}
			overflow={"vertical"}
			gap={"md"}
		>
			<ConditionOverall />

			<ConditionAge />
		</Container>
	);
};
