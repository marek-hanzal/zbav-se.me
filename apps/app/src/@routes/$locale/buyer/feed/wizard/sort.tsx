import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CloseIcon,
} from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";
import { ListingSortSelect } from "~/app/listing/ui/ListingSortSelect";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/sort")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [sort, setSort] = useState(state.sort ?? []);

		return (
			<TitleContainer
				textTitle={"Feed sorting (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/wizard/location"}
						params={{
							locale,
						}}
						search={{
							...state,
						}}
						tone={"secondary"}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/buyer/feed/select",
									params: {
										locale,
									},
								});
							},
						}}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/buyer/feed/wizard/category"}
						params={{
							locale,
						}}
						search={{
							...state,
							sort,
						}}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							size={"lg"}
							label={"Next - feed category (button)"}
							full
						/>
					</LinkTo>
				}
			>
				<ListingSortSelect
					value={sort}
					onChange={setSort}
				/>
			</TitleContainer>
		);
	},
});
