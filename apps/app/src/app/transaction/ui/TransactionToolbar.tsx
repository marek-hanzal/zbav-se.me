import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { GalleryIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { AcceptButton } from "~/app/transaction/ui/button/AcceptButton";
import { RejectButton } from "~/app/transaction/ui/button/RejectButton";
import { BuyerInfoButton } from "~/app/transaction/ui/buyer/BuyerInfoButton";
import { SellerInfoButton } from "~/app/transaction/ui/seller/SellerInfoButton";

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
			"px-2",
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
				<AcceptButton
					transactionId={transactionId}
					{...buttonUi}
				/>

				<RejectButton
					transactionId={transactionId}
					{...buttonUi}
				/>

				<SellerInfoButton
					transactionId={transactionId}
					{...buttonUi}
				/>

				<BuyerInfoButton
					transactionId={transactionId}
					{...buttonUi}
				/>

				<Button
					iconEnabled={GalleryIcon}
					label="Gallery"
					{...buttonUi}
				/>
			</Container>
		</Container>
	);
};
