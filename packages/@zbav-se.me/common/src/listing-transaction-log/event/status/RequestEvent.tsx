import { HideIcon, Icon, ShowIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Tx } from "@use-pico/client/ui/tx";
import type { tListingTransaction } from "@zbav-se.me/sdk/api/user";
import { type FC, useEffect, useState } from "react";
import { StatusEventBadge } from "../../StatusEventBadge";
import type { TransactionLogList } from "../../TransactionLogList";
import { StatusMenu } from "./StatusMenu";

export namespace RequestEvent {
	export interface Props extends StatusEventBadge.Props {
		listingTransaction: tListingTransaction;
		components: TransactionLogList.Components;
	}
}

export const RequestEvent: FC<RequestEvent.Props> = ({
	listingTransaction,
	listingTransactionStatus,
	components,
	isCurrent,
	isClosed,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);

	/**
	 * This trick enables sub-sheet to appear in the right order.
	 */
	useEffect(() => {
		if (isClosed) {
			return;
		}

		setTimeout(() => {
			setIsOpen(isCurrent);
		}, 150);
	}, [
		isClosed,
		isCurrent,
	]);

	return (
		<>
			<StatusEventBadge
				listingTransactionStatus={listingTransactionStatus}
				isClosed={isClosed}
				renderBuyerFn={({ tweak, timestamp, ...props }) => (
					<Badge
						ui={"RequestEvent-Buyer"}
						tweak={[
							tweak,
							{
								slot: {
									root: {
										class: [
											"flex-row",
											"items-center",
										],
									},
								},
							},
						]}
						{...props}
					>
						<div className="flex flex-col gap-1 w-full">
							{timestamp}

							<Tx label="Buyer transaction request (buyer-buyer) (label)" />
						</div>

						{isClosed || !isCurrent ? null : (
							<Icon
								icon={isOpen ? HideIcon : ShowIcon}
								size={"xs"}
							/>
						)}
					</Badge>
				)}
				renderBuyerToSellerFn={({ tweak, timestamp, ...props }) => (
					<Badge
						ui={"RequestEvent-BuyerToSeller"}
						tweak={[
							tweak,
							{
								slot: {
									root: {
										class: [
											"flex-row",
											"items-center",
										],
									},
								},
							},
						]}
						{...props}
					>
						<div className="flex flex-col gap-1 w-full">
							{timestamp}

							<Tx label="Buyer transaction request (buyer-seller) (label)" />
						</div>

						{isClosed || !isCurrent ? null : (
							<Icon
								icon={isOpen ? HideIcon : ShowIcon}
								size={"xs"}
							/>
						)}
					</Badge>
				)}
				/**
				 * Controlled via "context menu"
				 */
				isCurrent={isOpen}
				onClick={() => {
					if (isClosed) {
						return;
					}
					setIsOpen((state) => !state);
				}}
				{...props}
			/>

			<StatusMenu
				locale={props.locale}
				side={props.side}
				listingTransaction={listingTransaction}
				listingTransactionLog={listingTransactionStatus}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				components={components}
			/>
		</>
	);
};
