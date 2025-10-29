import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	LinkTo,
	Tx,
} from "@use-pico/client";
import { ListingCommonSortValue } from "@zbav-se.me/sdk";
import { TitleContainer } from "@zbav-se.me/ui";
import { useId } from "react";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/sort")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const sortKeyId = useId();

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
						tone={"secondary"}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/buyer/feed/wizard/sort"}
						params={{
							locale,
						}}
						search={{
							...state,
						}}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							size={"lg"}
							label={"Next - feed sort (button)"}
							full
						/>
					</LinkTo>
				}
			>
				<Container
					layout={"vertical"}
					overflow={"horizontal"}
					gap={"xs"}
					height={"auto"}
				>
					<div className="flex flex-col gap-2 w-full">
						{Object.values(ListingCommonSortValue).map((key) => {
							const sort = state.sort?.find(
								(sort) => sort.value === key,
							);

							return (
								<Button
									key={`${sortKeyId}-${key}`}
									size={"xl"}
									tweak={{
										slot: {
											root: {
												class: [
													"justify-start",
													"text-left",
												],
											},
										},
									}}
									full
								>
									<Tx
										label={`Listing common sort value ${key} - ${sort?.sort ?? "asc"}`}
									/>
								</Button>
							);
						})}
					</div>
				</Container>
			</TitleContainer>
		);
	},
});
