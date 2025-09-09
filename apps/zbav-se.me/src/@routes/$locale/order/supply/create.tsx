import { createFileRoute } from "@tanstack/react-router";
import { LinkTo, Tx } from "@use-pico/client";

export const Route = createFileRoute("/$locale/order/supply/create")({
	component() {
		return (
			<>
				<Tx
					label={"Create Supply"}
					theme={"dark"}
					tone={"primary"}
					size={"xl"}
				/>
				<LinkTo
					to="/$locale/order/demand/create"
					params={{
						locale: "en",
					}}
				>
					bla
				</LinkTo>

				<LinkTo
					to="/$locale"
					params={{
						locale: "en",
					}}
				>
					root
				</LinkTo>
			</>
		);
	},
});
