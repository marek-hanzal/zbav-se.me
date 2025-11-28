import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import type {
	tListingTransaction,
	tListingTransactionLog,
	tUserSideEnum,
} from "@zbav-se.me/sdk/api/user";
import { type FC, useId } from "react";
import { AcceptButton } from "../../../listing-transaction/button/AcceptButton";
import { RejectButton } from "../../../listing-transaction/button/RejectButton";
import { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import type { TransactionLogList } from "../../TransactionLogList";

export namespace StatusMenu {
	export interface Props extends BottomSheet.Props {
		locale: string;
		side: tUserSideEnum;
		listingTransaction: tListingTransaction;
		listingTransactionLog: tListingTransactionLog;
		components: TransactionLogList.Components;
	}
}

export const StatusMenu: FC<StatusMenu.Props> = ({
	locale,
	side,
	listingTransaction,
	listingTransactionLog,
	components,
	...props
}) => {
	const listingSheetId = useId();

	const { render } = useSideSwitch({
		side,
		actor: listingTransactionLog.side,
		renderBuyerFn() {
			return (
				<>
					<components.SellerInfoButton
						locale={locale}
						log={listingTransactionLog}
					/>

					<RejectButton log={listingTransactionLog} />

					<components.ListingDetailButton
						locale={locale}
						listingTransaction={listingTransaction}
						modalRootId={listingSheetId}
					/>
				</>
			);
		},
		renderBuyerToSellerFn() {
			return (
				<>
					<components.BuyerInfoButton
						locale={locale}
						log={listingTransactionLog}
					/>

					<AcceptButton log={listingTransactionLog} />

					<RejectButton log={listingTransactionLog} />

					<components.ListingDetailButton
						locale={locale}
						listingTransaction={listingTransaction}
						modalRootId={listingSheetId}
					/>
				</>
			);
		},
		renderSellerFn() {
			return (
				<>
					<components.BuyerInfoButton
						locale={locale}
						log={listingTransactionLog}
					/>

					<RejectButton log={listingTransactionLog} />

					<components.ListingDetailButton
						locale={locale}
						listingTransaction={listingTransaction}
						modalRootId={listingSheetId}
					/>
				</>
			);
		},
		renderSellerToBuyerFn() {
			return (
				<>
					<components.SellerInfoButton
						locale={locale}
						log={listingTransactionLog}
					/>

					<RejectButton log={listingTransactionLog} />

					<components.ListingDetailButton
						locale={locale}
						listingTransaction={listingTransaction}
						modalRootId={listingSheetId}
					/>
				</>
			);
		},
	});

	const content = render({});

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
