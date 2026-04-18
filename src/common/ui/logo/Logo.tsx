import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Tx } from "@/lib/client/tx";

export namespace Logo {
	export interface Props extends Container.Props {
		logo?: boolean;
	}
}

export const Logo: FC<Logo.Props> = ({ logo = false, ...props }) => {
	return (
		<Container
			className={[
				"font-limelight",
			]}
			ui={{
				layout: "vertical-flex",
				items: "center",
				justify: "center",
				...ui,
			}}
			{...props}
		>
			<Tx
				data-ui="Logo-[Tx.primary]"
				label={"zbav-se.me"}
				ui={{
					tone: "brand",
					theme: "light",
					text: "2xl",
					display: "block",
					color: "lead",
				}}
			/>

			{logo === true ? null : (
				<Tx
					data-ui="Logo-[Tx.motto]"
					label="Logo motto (label)"
					ui={{
						tone: "secondary",
						theme: "light",
						text: "lg",
						display: "block",
						color: "lead",
						position: "relative",
					}}
					className={[
						"-rotate-3",
						"-top-2",
					]}
				/>
			)}
		</Container>
	);
};
