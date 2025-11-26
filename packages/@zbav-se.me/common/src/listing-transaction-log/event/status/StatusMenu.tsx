import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import type { tListingTransactionLog, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { AcceptButton } from "../../../listing-transaction/button/AcceptButton";
import { RejectButton } from "../../../listing-transaction/button/RejectButton";
import { useSideSwitch } from "../../../listing-transaction/useSideSwitch";
import type { TransactionLogList } from "../../TransactionLogList";

export namespace StatusMenu {
	export interface Props extends BottomSheet.Props {
		locale: string;
		side: tUserSideEnum;
		log: tListingTransactionLog;
		components: TransactionLogList.Components;
	}
}

export const StatusMenu: FC<StatusMenu.Props> = ({ locale, side, log, components, ...props }) => {
	const { render } = useSideSwitch({
		side,
		actor: log.side,
		renderBuyerFn() {
			return (
				<>
					<components.SellerInfoButton
						locale={locale}
						log={log}
					/>

					<RejectButton log={log} />
				</>
			);
		},
		renderBuyerToSellerFn() {
			return (
				<>
					<components.BuyerInfoButton
						locale={locale}
						log={log}
					/>

					<AcceptButton log={log} />

					<RejectButton log={log} />
				</>
			);
		},
		renderSellerFn() {
			return (
				<>
					<components.BuyerInfoButton
						locale={locale}
						log={log}
					/>

					<RejectButton log={log} />
				</>
			);
		},
		renderSellerToBuyerFn() {
			return (
				<>
					<components.BuyerInfoButton
						locale={locale}
						log={log}
					/>

					<RejectButton log={log} />
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
			detent={"content"}
			{...props}
		>
			<Container
				layout={"vertical-flex"}
				gap={"md"}
			>
				{content}
			</Container>
		</BottomSheet>
	);
};
