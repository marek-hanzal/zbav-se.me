import { createFileRoute } from "@tanstack/react-router";
import { Tx } from "@use-pico/client";

export const Route = createFileRoute("/$locale/order/supply/create")({
    component() {
		return (
			<Tx
				label={"Create Demand"}
				theme={"dark"}
				tone={"primary"}
				size={"xl"}
			/>
		);
	},
});
