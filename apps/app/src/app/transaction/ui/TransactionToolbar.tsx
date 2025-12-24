import type { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import type { FC } from "react";
import { SellerInfoButton } from "~/app/listing/ui/button/SellerInfoButton";
import { AcceptButton } from "~/app/transaction/ui/button/AcceptButton";
import { RejectButton } from "~/app/transaction/ui/button/RejectButton";
import { BuyerInfoButton } from "~/app/transaction/ui/buyer/BuyerInfoButton";

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
		<withTransactionFetchQuery.Suspense
			data={{
				where: {
					id: transactionId,
				},
			}}
			fallback={<SpinnerContainer />}
		>
			{({ data: transaction }) => {
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
								listingId={transaction.listingId}
								{...buttonUi}
							/>

							<BuyerInfoButton
								transactionId={transactionId}
								{...buttonUi}
							/>
						</Container>
					</Container>
				);
			}}
		</withTransactionFetchQuery.Suspense>
	);
};
