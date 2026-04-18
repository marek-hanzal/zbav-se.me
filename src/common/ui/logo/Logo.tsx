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
			data-ui-layout="vertical-flex"
			data-ui-items="center"
			data-ui-justify="center"
			{...props}
		>
			<Tx
				data-ui="Logo-[Tx.primary]"
				label={"zbav-se.me"}
				data-ui-tone="brand"
				data-ui-theme="light"
				data-ui-text="2xl"
				data-ui-display="block"
				data-ui-color="lead"
			/>

			{logo === true ? null : (
				<Tx
					data-ui="Logo-[Tx.motto]"
					label="Logo motto (label)"
					data-ui-tone="secondary"
					data-ui-theme="light"
					data-ui-text="lg"
					data-ui-display="block"
					data-ui-color="lead"
					data-ui-position="relative"
					className={[
						"-rotate-3",
						"-top-2",
					]}
				/>
			)}
		</Container>
	);
};
