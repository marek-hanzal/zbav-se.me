import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { Modal } from "@use-pico/client/ui/modal";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import { ModalContainer } from "@zbav-se.me/ui/container";
import { BuyerIcon, SellerIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { StatusEventBadge } from "../../StatusEventBadge";

export namespace RequestEvent {
	export namespace Info {
		export interface Props {
			locale: string;
			listingTransactionId: string;
		}

		export type Component = FC<Info.Props>;
	}

	export interface Props extends StatusEventBadge.PropsEx {
		locale: string;
		SellerInfo: Info.Component;
		BuyerInfo: Info.Component;
	}
}

export const RequestEvent: FC<RequestEvent.Props> = ({
	locale,
	listingTransactionStatus,
	SellerInfo,
	BuyerInfo,
	...props
}) => {
	return (
		<StatusEventBadge
			listingTransactionStatus={listingTransactionStatus}
			renderSellerFn={undefined}
			renderBuyerFn={(props) => (
				<Badge {...props}>
					<Typo
						label={toTimeDiff({
							locale,
							time: listingTransactionStatus.createdAt,
						})}
						font={"normal"}
						size={"sm"}
					/>

					<Tx label="Buyer transaction request (buyer-buyer) (label)" />

					<Modal
						target={
							<Button
								iconEnabled={SellerIcon}
								label={"Seller info (label)"}
								tone={"secondary"}
								theme={"light"}
							/>
						}
						size={"full"}
					>
						{({ close }) => {
							return (
								<ModalContainer
									textTitle={"Seller info (title)"}
									close={close}
									height={"fit"}
								>
									<SellerInfo
										locale={locale}
										listingTransactionId={
											listingTransactionStatus.listingTransactionId
										}
									/>
								</ModalContainer>
							);
						}}
					</Modal>
				</Badge>
			)}
			renderBuyerToSellerFn={(props) => (
				<Badge {...props}>
					<Typo
						label={toTimeDiff({
							locale,
							time: listingTransactionStatus.createdAt,
						})}
						font={"normal"}
						size={"sm"}
					/>

					<Tx label="Buyer transaction request (buyer-seller) (label)" />

					<Modal
						target={
							<Button
								iconEnabled={BuyerIcon}
								label={"Buyer info (label)"}
								tone={"secondary"}
								theme={"light"}
							/>
						}
						size={"full"}
					>
						{({ close }) => {
							return (
								<ModalContainer
									textTitle={"Buyer info (title)"}
									close={close}
									height={"fit"}
								>
									<BuyerInfo
										locale={locale}
										listingTransactionId={
											listingTransactionStatus.listingTransactionId
										}
									/>
								</ModalContainer>
							);
						}}
					</Modal>
				</Badge>
			)}
			renderSellerToBuyerFn={undefined}
			{...props}
		>
			buyer request
		</StatusEventBadge>
	);
};
