import { Container, SnapperNav } from "@use-pico/client";
import { type FC, useRef } from "react";
import { ConditionAge } from "~/app/listing/ui/CreateListing/Condition/ConditionAge";
import { ConditionOverall } from "~/app/listing/ui/CreateListing/Condition/ConditionOverall";

export const ConditionWrapper: FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<div className="relative">
			<SnapperNav
				containerRef={containerRef}
				pages={{
					count: 2,
				}}
				orientation={"horizontal"}
				iconProps={() => ({
					size: "xs",
					tone: "secondary",
					theme: "light",
				})}
				subtle
			/>

			<Container
				ref={containerRef}
				layout={"horizontal-full"}
				snap={"horizontal-start"}
				overflow={"horizontal"}
				gap={"md"}
			>
				<ConditionOverall />

				<ConditionAge />
			</Container>
		</div>
	);
};
