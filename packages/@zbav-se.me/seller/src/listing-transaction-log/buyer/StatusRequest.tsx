import { ArrowLeftIcon, Icon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { Modal } from "@use-pico/client/ui/modal";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { StatusEvent } from "../StatusEvent";

export namespace StatusRequest {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
		BuyerInfoContainer: FC<{
			listingTransactionId: string;
		}>;
	}
}

export const StatusRequest: FC<StatusRequest.Props> = ({ BuyerInfoContainer, ...props }) => {
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
