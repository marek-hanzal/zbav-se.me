import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";

export const Logo: FC = () => {
	return (
		<div data-ui="Logo-root">
			<div data-ui="Logo-title-wrapper">
				<Tx
					data-ui="Logo-title-primary"
					label={"zbav-se.me"}
					ui={{
						tone: "primary",
						theme: "light",
						size: "xl",
						font: "bold",
						display: "block",
					}}
				/>
				<Tx
					data-ui="Logo-title-secondary"
					label={"zbav-se.me"}
					ui={{
						tone: "secondary",
						theme: "light",
						size: "xl",
						font: "bold",
						display: "block",
					}}
				/>
			</div>

			<Tx
				data-ui="Logo-motto"
				label="Logo motto (label)"
				ui={{
					tone: "secondary",
					theme: "light",
					size: "xl",
					font: "bold",
					display: "block",
				}}
			/>
		</div>
	);
};
