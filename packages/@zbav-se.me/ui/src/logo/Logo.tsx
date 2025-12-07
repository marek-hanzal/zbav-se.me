import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";

export const Logo: FC = () => {
	return (
		<div data-ui="Logo-root">
			<div data-ui="Logo-title-wrapper">
				<Tx
					data-ui="Logo-title-primary"
					label={"zbav-se.me"}
					tone={"primary"}
					theme={"light"}
					display={"block"}
				/>
				<Tx
					data-ui="Logo-title-secondary"
					label={"zbav-se.me"}
					tone={"secondary"}
					theme={"light"}
					display={"block"}
				/>
			</div>

			<Tx
				data-ui="Logo-motto"
				label="Logo motto (label)"
				tone="secondary"
				theme={"light"}
				font={"bold"}
				display={"block"}
				size={"xl"}
			/>
		</div>
	);
};
