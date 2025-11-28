import { HideIcon, Icon, ShowIcon } from "@use-pico/client/icon";
import type { tListingTransactionStatus, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import { type FC, useEffect, useState } from "react";
import { match } from "ts-pattern";
import type { useSideSwitch } from "../../listing-transaction/useSideSwitch";
import type { TransactionLogList } from "../TransactionLogList";
import { AcceptedEvent } from "./status/AcceptedEvent";
import { RejectedEvent } from "./status/RejectedEvent";
import { RequestEvent } from "./status/RequestEvent";
import { StatusMenu } from "./status/StatusMenu";

export namespace StatusSwitchEvent {
	export interface Props {
		locale: string;
		side: tUserSideEnum;
		type: useSideSwitch.Type;
		listingTransactionStatus: tListingTransactionStatus;
		isCurrent: boolean;
		isClosed: boolean;
		components: TransactionLogList.Components;
	}
}

export const StatusSwitchEvent: FC<StatusSwitchEvent.Props> = ({
	locale,
	side,
	type,
	listingTransactionStatus,
	isCurrent,
	isClosed,
	components,
}) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		if (!isCurrent || isClosed) {
			return;
		}

		setTimeout(() => {
			setIsMenuOpen(true);
		}, 150);
	}, [
		isClosed,
		isCurrent,
	]);

	const event = match(listingTransactionStatus.status)
		.with("request", () => {
			return (
				<RequestEvent
					locale={locale}
					side={side}
					actor={listingTransactionStatus.side}
					type={type}
					timestamp={listingTransactionStatus.createdAt}
					isCurrent={isCurrent}
					isClosed={isClosed}
					onClick={() => {
						setIsMenuOpen((prev) => !prev);
					}}
					action={
						<Icon
							icon={isMenuOpen ? HideIcon : ShowIcon}
							size={"sm"}
						/>
					}
				/>
			);
		})
		.with("accepted", () => {
			return (
				<AcceptedEvent
					locale={locale}
					side={side}
					actor={listingTransactionStatus.side}
					type={type}
					timestamp={listingTransactionStatus.createdAt}
					isCurrent={isCurrent}
					isClosed={isClosed}
					onClick={() => {
						setIsMenuOpen((prev) => !prev);
					}}
					action={
						<Icon
							icon={isMenuOpen ? HideIcon : ShowIcon}
							size={"sm"}
						/>
					}
				/>
			);
		})
		.with("rejected", () => {
			return (
				<RejectedEvent
					locale={locale}
					side={side}
					actor={listingTransactionStatus.side}
					type={type}
					timestamp={listingTransactionStatus.createdAt}
					isCurrent={isCurrent}
					isClosed={isClosed}
					onClick={() => {
						setIsMenuOpen((prev) => !prev);
					}}
					action={
						<Icon
							icon={isMenuOpen ? HideIcon : ShowIcon}
							size={"sm"}
						/>
					}
				/>
			);
		})
		.with("closed", "expired", "success", () => {
			return "not-yet";
		})
		.exhaustive();

	return (
		<>
			{event}

			<StatusMenu
				locale={locale}
				side={side}
				listingTransactionLog={listingTransactionStatus}
				isOpen={isMenuOpen && isCurrent && !isClosed}
				onClose={() => {
					setIsMenuOpen(false);
				}}
				components={components}
			/>
		</>
	);
};
