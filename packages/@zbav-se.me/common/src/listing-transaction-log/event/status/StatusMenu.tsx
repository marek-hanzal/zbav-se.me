import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import type { tListingTransactionLog, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { AcceptButton } from "../../../listing-transaction/button/AcceptButton";
import { useSideSwitch } from "../../../listing-transaction/useSideSwitch";

export namespace StatusMenu {
	export interface Props extends BottomSheet.PropsEx {
		side: tUserSideEnum;
		log: tListingTransactionLog;
	}
}

export const StatusMenu: FC<StatusMenu.Props> = ({ side, log, ...props }) => {
	const { render } = useSideSwitch({
		side,
		actor: log.side,
		renderBuyerToSellerFn() {
			return (
				<>
					<AcceptButton />
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
			disableDismiss
			isOpen
			onClose={() => {
				//
			}}
			snapPoints={[
				0,
				/**
				 * Hardcoded value for the height of the first button.
				 */
				122,
				1,
			]}
			/**
			 * Index to snap points.
			 */
			initialSnap={1}
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
