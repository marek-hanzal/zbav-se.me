import { Container } from "@use-pico/client";
import { type FC, useRef } from "react";
import { ConditionAge } from "~/app/listing/ui/CreateListing/Condition/ConditionAge";
import { ConditionOverall } from "~/app/listing/ui/CreateListing/Condition/ConditionOverall";
import { Fade } from "~/app/ui/fade/Fade";

export const ConditionWrapper: FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<div className="relative">
			<Fade scrollableRef={containerRef} />

			<Container
				ref={containerRef}
				layout={"vertical-full"}
				snap={"vertical-start"}
				overflow={"vertical"}
				gap={"md"}
			>
				<ConditionOverall />

				<ConditionAge />
			</Container>
		</div>
	);
};
