import { ArrowLeftIcon, Icon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { Modal } from "@use-pico/client/ui/modal";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { BuyerInfoContainer } from "../../listing-transaction/BuyerInfoContainer";
import { StatusEvent } from "../StatusEvent";

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
							_suspense={"I know"}
							locale={props.locale}
							listingTransactionId={props.listingTransactionLog.listingTransactionId}
						/>
					</Suspense>

					{/* 
                    
                    const { locale, id } = Route.useParams();
		const navigate = Route.useNavigate();

		const listingTransactionQuery = withListingTransactionFetchQuery.useSuspenseQuery({
			where: {
				id,
			},
			meta: {
				side: "seller",
			},
		});

		const isTransactionPending = withListingTransactionPatchMutation.useIsMutating();

		return (
			<TitleContainer
				ui="BuyerInfo-root"
				textTitle="Buyer info (title)"
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/transaction/$id/view"}
						params={{
							locale,
							id,
						}}
					/>
				}
			>
				<BuyerInfoContainer listingTransactionId={id} />

				{listingTransactionQuery.data.status === "request" ? (
					<div
						className={tvc([
							"flex",
							"flex-col",
							"gap-2",
							"w-full",
							"items-center",
							"justify-center",
						])}
					>
						<AcceptTransactionButton
							listingTransactionId={id}
							disabled={isTransactionPending}
							onSuccess={() => {
								return navigate({
									href: "/$locale/seller/transaction/$id/view",
								});
							}}
						/>

						<RejectTransactionButton
							listingTransactionId={id}
							disabled={isTransactionPending}
							onSuccess={() => {
								return navigate({
									href: "/$locale/seller/transaction/$id/view",
								});
							}}
						/>
					</div>
				) : null}
			</TitleContainer>
                    
                    */}
				</TitleContainer>
			)}
		</Modal>
	);
};
