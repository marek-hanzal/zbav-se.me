import { Container, type uiContainer } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { SellerInfoButton } from "~/app/@buyer-user/listing/ui/button/SellerInfoButton";
import { BuyerInfoButton } from "~/app/@buyer-user/transaction/BuyerInfoButton";
import { RejectButton } from "~/app/@common/transaction/ui/button/RejectButton";
import { MessageButtonUi } from "~/app/@common/transaction/ui/transaction-status/MessageButtonUi";
import { AcceptButton } from "~/app/@seller-user/transaction-status/ui/button/AcceptButton";
import { useSide } from "~/app/@user/user/useSide";

export namespace PendingMessage {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const PendingMessage: FC<PendingMessage.Props> = ({ transaction, ui, ...props }) => {
	const side = useSide();

	return (
		<Container
			ui={{
				round: "default",
				flow: "vertical",
				gap: "default",
				...match<typeof side, uiContainer.Ui>(side)
					.with("seller", () => {
						return {
							tone: "link",
						};
					})
					.with("buyer", () => {
						return {
							tone: "primary",
						};
					})
					.with(null, undefined, () => {
						return {};
					})
					.exhaustive(),
				...ui,
			}}
			className={[
				"w-2/3",
				"ml-auto",
			]}
			{...props}
		>
			{side === "buyer" ? (
				<SellerInfoButton
					listingId={transaction.listingId}
					{...MessageButtonUi}
				/>
			) : null}

			{side === "seller" ? (
				<BuyerInfoButton
					transactionId={transaction.id}
					{...MessageButtonUi}
				/>
			) : null}

			{side === "seller" ? (
				<AcceptButton
					transaction={transaction}
					{...MessageButtonUi}
				/>
			) : null}

			<RejectButton
				transaction={transaction}
				{...MessageButtonUi}
			/>
		</Container>
	);
};
