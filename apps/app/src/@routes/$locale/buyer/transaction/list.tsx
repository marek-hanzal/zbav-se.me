import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TransactionList } from "@zbav-se.me/buyer/listing-transaction";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/buyer/transaction/list")({
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Transactions (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
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
				textTitle={"Transactions (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					/>
				}
			>
				<TransactionList
					_suspense={"I know"}
					locale={locale}
					renderItemFn={({ listingTransaction, children }) => {
						return (
							<LinkTo
								icon={ArrowRightIcon}
								iconPosition={"right"}
								to={"/$locale/buyer/transaction/$id/view"}
								params={{
									locale,
									id: listingTransaction.id,
								}}
								full
							>
								{children}
							</LinkTo>
						);
					}}
					emptyAction={
						<LinkTo
							to={"/$locale/buyer/feed/select"}
							params={{
								locale,
							}}
						>
							<Button
								iconEnabled={ArrowRightIcon}
								iconPosition={"right"}
								label={"Feed selection (button)"}
								size={"xl"}
								tone={"primary"}
								theme={"dark"}
							/>
						</LinkTo>
					}
				/>
			</TitleContainer>
		);
	},
});
