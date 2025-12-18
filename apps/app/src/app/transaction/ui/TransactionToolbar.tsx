import { Button, type uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace TransactionToolbar {
	export interface Props extends Container.Props {
		transactionId: string;
	}
}

export const TransactionToolbar: FC<TransactionToolbar.Props> = ({
	transactionId,
	ui,
	...props
}) => {
	const buttonUi: uiButton.Ui = {
		tone: "neutral",
		theme: "light",
		size: "xl",
		round: "default",
		background: "default",
		text: "xl",
		border: true,
		shadow: true,
		width: "content",
	};

	return (
		<Container
			ui={{
				scroll: "horizontal",
				width: "full",
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					gap: "default",
				}}
				className={[
					"grid",
					"grid-flow-col",
					"auto-cols-max",
					"w-max",
				]}
			>
				<Button
					label="Seller info"
					ui={buttonUi}
				/>
				<Button
					label="Buyer info"
					ui={buttonUi}
				/>
				<Button
					label="Gallery"
					ui={buttonUi}
				/>
			</Container>
		</Container>
	);
};
