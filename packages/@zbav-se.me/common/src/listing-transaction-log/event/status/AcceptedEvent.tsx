import { HideIcon, Icon, ShowIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Tx } from "@use-pico/client/ui/tx";
import { type FC, useState } from "react";
import { StatusEventBadge } from "../../StatusEventBadge";
import type { TransactionLogList } from "../../TransactionLogList";
import { StatusMenu } from "./StatusMenu";

export namespace AcceptedEvent {
	export interface Props extends StatusEventBadge.PropsEx {
		components: TransactionLogList.Components;
	}
}

export const AcceptedEvent: FC<AcceptedEvent.Props> = ({
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
				renderSellerFn={({ tweak, timestamp, ...props }) => (
					<Badge
						ui={"AcceptedEvent-Seller"}
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

							<Tx label="Seller accepted transaction (seller)" />
						</div>

						<Icon
							icon={isOpen ? HideIcon : ShowIcon}
							size={"xs"}
						/>
					</Badge>
				)}
				renderSellerToBuyerFn={({ tweak, timestamp, ...props }) => {
					return (
						<Badge
							ui={"AcceptedEvent-SellerToBuyer"}
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

								<Tx label="Seller accepted transaction (seller-to-buyer)" />
							</div>

							<Icon
								icon={isOpen ? HideIcon : ShowIcon}
								size={"xs"}
							/>
						</Badge>
					);
				}}
				/**
				 * Controlled via "context menu"
				 */
				isCurrent={isOpen}
				onClick={() => {
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
