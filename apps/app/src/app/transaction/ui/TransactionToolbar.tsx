import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { BuyerIcon, GalleryIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { BuyerInfoButton } from "~/app/transaction/ui/buyer/BuyerInfoButton";
import { SellerInfoButton } from "~/app/transaction/ui/seller/SellerInfoButton";
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
			tone: "link",
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
				opacity: "low",
				...ui,
			}}
			className={[
				"py-1",
			]}
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
					<SellerInfoButton
						transactionId={transactionId}
						{...buttonUi}
					/>
				) : null}

				{side === "seller" ? (
					<BuyerInfoButton
						transactionId={transactionId}
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
