import { HideIcon, Icon, ShowIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Tx } from "@use-pico/client/ui/tx";
import { type FC, useState } from "react";
import { StatusEventBadge } from "../../StatusEventBadge";
import type { TransactionLogList } from "../../TransactionLogList";
import { StatusMenu } from "./StatusMenu";

export namespace RequestEvent {
	export interface Props extends StatusEventBadge.PropsEx {
		components: TransactionLogList.Components;
	}
}

export const RequestEvent: FC<RequestEvent.Props> = ({
	listingTransactionStatus,
	components,
	isCurrent,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(isCurrent);

	return (
		<>
			<StatusEventBadge
				listingTransactionStatus={listingTransactionStatus}
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

						{isCurrent ? (
							<Icon
								icon={isOpen ? HideIcon : ShowIcon}
								size={"xs"}
							/>
						) : null}
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

						{isCurrent ? (
							<Icon
								icon={isOpen ? HideIcon : ShowIcon}
								size={"xs"}
							/>
						) : null}
					</Badge>
				)}
				/**
				 * Controlled via "context menu"
				 */
				isCurrent={isOpen}
				onClick={() => {
					if (!isCurrent) {
						return;
					}
					setIsOpen((state) => !state);
				}}
				{...props}
			/>

			<StatusMenu
				locale={props.locale}
				side={props.side}
				log={listingTransactionStatus}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				components={components}
			/>
		</>
	);
};
