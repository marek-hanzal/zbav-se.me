import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { BuyerIcon, GalleryIcon, SellerIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useSide } from "~/app/user/useSide";

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
	const side = useSide();

	const buttonUi: Button.Props = {
		iconProps: {
			ui: {
				text: "xl",
			},
		},
		ui: {
			tone: "neutral",
			theme: "light",
			round: "full",
			background: "default",
			text: "sm",
			border: true,
			shadow: false,
			width: "content",
		},
		className: [
			"px-6",
			"py-1",
		],
	};

	return (
		<Container
			ui={{
				scroll: "horizontal",
				width: "full",
				inner: "default",
				opacity: "low",
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
				{side === "buyer" ? (
					<Button
						iconEnabled={SellerIcon}
						label="Seller info"
						{...buttonUi}
					/>
				) : null}

				{side === "seller" ? (
					<Button
						iconEnabled={BuyerIcon}
						label="Buyer info"
						{...buttonUi}
					/>
				) : null}

				<Button
					iconEnabled={GalleryIcon}
					label="Gallery"
					{...buttonUi}
				/>
			</Container>
		</Container>
	);
};
