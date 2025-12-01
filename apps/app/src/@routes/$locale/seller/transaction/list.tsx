import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { TransactionList } from "@zbav-se.me/common/listing-transaction";
import { TitleContainer } from "@zbav-se.me/ui/container";
import z from "zod";

export const Route = createFileRoute("/$locale/seller/transaction/list")({
	validateSearch: z.object({
		open: z.string().optional(),
	}),
	component() {
		const { locale } = Route.useParams();
		const search = Route.useSearch();
		const navigate = Route.useNavigate();

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
					state={{
						value: search.open,
						set: (value) => {
							navigate({
								search: {
									open: value,
								},
							});
						},
					}}
				/>
			</TitleContainer>
		);
	},
});
