import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { TransactionList } from "@zbav-se.me/common/listing-transaction";
import { TitleContainer } from "@zbav-se.me/ui/container";
import z from "zod";

export const Route = createFileRoute("/$locale/buyer/transaction/list")({
	validateSearch: z.object({
		open: z.string().optional(),
	}),
	component() {
		const { locale } = Route.useParams();
		const search = Route.useSearch();
		const navigate = Route.useNavigate();

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
					locale={locale}
					side="buyer"
					renderEmptyFn={(props) => {
						return (
							<Status
								textTitle={"No transactions found - buyer (title)"}
								textMessage={"No transactions found - buyer (message)"}
								action={
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
