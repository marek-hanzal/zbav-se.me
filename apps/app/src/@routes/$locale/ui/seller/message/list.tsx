import { createFileRoute } from "@tanstack/react-router";
import { Status } from "@use-pico/client/ui/status";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { uiWarningStatus } from "@zbav-se.me/ui/ui";
import z from "zod";
import { TransactionListContainer } from "~/app/listing-transaction/ui/TransactionListContainer";

export const Route = createFileRoute("/$locale/ui/seller/message/list")({
	validateSearch: z.object({
		open: z.string().optional(),
	}),
	component() {
		const { locale } = Route.useParams();
		const search = Route.useSearch();
		const navigate = Route.useNavigate();

		return (
			<TitleContainer
				data-ui="/seller/message/list[TitleContainer]"
				textTitle={"Messages (title)"}
			>
				<TransactionListContainer
					locale={locale}
					side="seller"
					renderEmptyFn={(props) => {
						return (
							<Status
								textTitle={"No messages found - seller (title)"}
								textMessage={"No messages found - seller (message)"}
								{...uiWarningStatus({
									className: [],
								})}
								data-ui="/seller/message/list-[Status.empty]"
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
