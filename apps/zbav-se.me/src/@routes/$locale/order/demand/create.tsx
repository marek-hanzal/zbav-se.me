import { createFileRoute } from "@tanstack/react-router";
import { Button, LinkTo, Tx } from "@use-pico/client";

export const Route = createFileRoute("/$locale/order/demand/create")({
	component() {
		return (
			<>
				<Tx
					label={"Create Demand"}
					theme={"dark"}
					tone={"primary"}
					size={"xl"}
				/>

				<LinkTo
					to="/$locale/order/supply/create"
					params={{
						locale: "en",
					}}
				>
					<Button
						theme="dark"
						tone="secondary"
					>
						Bla
					</Button>
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
