import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { TitleContainer } from "@zbav-se.me/ui/container";
import z from "zod";
import { TransactionList } from "~/app/listing-transaction/ui/TransactionList";

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
				data-ui="TransactionList-root"
				textTitle={"Transactions (title)"}
				left={
					<LinkTo
						to={"/$locale/seller"}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
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
