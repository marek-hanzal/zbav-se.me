import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import type { tListingTransactionStatus, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import { type FC, useId } from "react";
import { match } from "ts-pattern";
import { AcceptButton } from "../../../listing-transaction/button/AcceptButton";
import { RejectButton } from "../../../listing-transaction/button/RejectButton";
import type { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import type { TransactionLogList } from "../../TransactionLogList";

export namespace StatusMenu {
	export interface Props extends BottomSheet.Props {
		locale: string;
		side: tUserSideEnum;
		type: useSideSwitch.Type;
		listingTransactionStatus: tListingTransactionStatus;
		components: TransactionLogList.Components;
	}
}

export const StatusMenu: FC<StatusMenu.Props> = ({
	locale,
	side,
	type,
	listingTransactionStatus,
	components,
	...props
}) => {
	const listingSheetId = useId();

	const content = match(type)
		.with("buyer", () => {
			return match(listingTransactionStatus.status)
				.with("request", () => {
					return (
						<>
							<components.SellerInfoButton
								locale={locale}
								log={listingTransactionStatus}
							/>

							<RejectButton log={listingTransactionStatus} />

							<components.ListingDetailButton modalRootId={listingSheetId} />
						</>
					);
				})
				.with("accepted", "closed", "expired", "success", "rejected", () => {
					return null;
				})
				.exhaustive();
		})
		.with("buyer-to-seller", () => {
			return (
				<>
					<components.BuyerInfoButton
						locale={locale}
						log={listingTransactionStatus}
					/>

					<AcceptButton log={listingTransactionStatus} />

					<RejectButton log={listingTransactionStatus} />

					<components.ListingDetailButton modalRootId={listingSheetId} />
				</>
			);
		})
		.with("seller", () => {
			return (
				<>
					<components.BuyerInfoButton
						locale={locale}
						log={listingTransactionStatus}
					/>

					<RejectButton log={listingTransactionStatus} />

					<components.ListingDetailButton modalRootId={listingSheetId} />
				</>
			);
		})
		.with("seller-to-buyer", () => {
			return (
				<>
					<components.SellerInfoButton
						locale={locale}
						log={listingTransactionStatus}
					/>

					<RejectButton log={listingTransactionStatus} />

					<components.ListingDetailButton modalRootId={listingSheetId} />
				</>
			);
		})
		.with("unknown", () => {
			return null;
		})
		.exhaustive();

	if (!content) {
		return null;
	}

	return (
		<BottomSheet
			ui={"StatusMenu-BottomSheet"}
			detent={"content"}
			{...props}
		>
			<Container
				ui={"StatusMenu-Container"}
				layout={"vertical-flex"}
				gap={"md"}
				square={"md"}
			>
				{content}
			</Container>
		</BottomSheet>
	);
};
