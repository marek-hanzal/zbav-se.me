import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TransactionList } from "@zbav-se.me/seller/listing-transaction";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/seller/transaction/list")({
	pendingComponent() {
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
				<SpinnerContainer />
			</TitleContainer>
		);
	},
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
					_suspense={"I know"}
					locale={locale}
					emptyAction={null}
					renderItemFn={({ listingTransaction, children }) => (
						<LinkTo
							icon={ArrowRightIcon}
							iconPosition={"right"}
							to={"/$locale/seller/transaction/$id/view"}
							params={{
								locale,
								id: listingTransaction.id,
							}}
							full
						>
							{children}
						</LinkTo>
					)}
				/>
			</TitleContainer>
		);
	},
});
