import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { TransactionList } from "@zbav-se.me/common/listing-transaction";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/seller/transaction/list")({
	component() {
		const { locale } = Route.useParams();
		return (
			<TitleContainer
				ui="TransactionList-root"
				textTitle={"Transactions (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller"}
						params={{
							locale,
						}}
					/>
				}
			>
				<TransactionList
					locale={locale}
					side="seller"
					renderEmptyFn={(props) => {
						return (
							<Status
								textTitle={"No transactions found - seller (title)"}
								textMessage={"No transactions found - seller (message)"}
								{...props}
							/>
						);
					}}
					renderItemFn={({ listingTransaction, children }) => (
						<LinkTo
							to={"/$locale/seller/transaction/$id/log"}
							params={{
								locale,
								id: listingTransaction.id,
							}}
							full
							tone={"primary"}
						>
							{children}
						</LinkTo>
					)}
				/>
			</TitleContainer>
		);
	},
});
