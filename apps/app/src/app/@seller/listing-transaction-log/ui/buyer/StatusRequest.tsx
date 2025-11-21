import { ArrowLeftIcon, Icon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { Modal } from "node_modules/@use-pico/client/src/ui/modal/Modal";
import { type FC, Suspense } from "react";
import { BuyerInfoContainer } from "~/app/@seller/listing-transaction/ui/BuyerInfoContainer";
import { StatusEvent } from "~/app/listing-transaction-log/ui/common/StatusEvent";

export namespace StatusRequest {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusRequest: FC<StatusRequest.Props> = (props) => {
	return (
		<Modal
			size={"full"}
			target={
				<StatusEvent
					ui={"Seller-Buyer-StatusRequest"}
					{...props}
				/>
			}
		>
			{({ close }) => (
				<TitleContainer
					ui="BuyerInfo-root"
					textTitle="Buyer info (title)"
					left={
						<Icon
							icon={ArrowLeftIcon}
							onClick={close}
							size={"sm"}
						/>
					}
					onClick={close}
				>
					<Suspense fallback={<SpinnerContainer />}>
						<BuyerInfoContainer
							listingTransactionId={props.listingTransactionLog.listingTransactionId}
						/>
					</Suspense>
				</TitleContainer>
			)}
		</Modal>
	);
};
