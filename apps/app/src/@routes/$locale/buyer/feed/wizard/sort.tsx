import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CloseIcon,
} from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import type { tListingSort } from "@zbav-se.me/sdk";
import { TitleContainer } from "@zbav-se.me/ui";
import { useId, useState } from "react";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/sort")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const sortKeyId = useId();
		const [sort, setSort] = useState<tListingSort[]>(state.sort ?? []);

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
				<Container
					layout={"vertical-flex"}
					scroll={"vertical"}
					gap={"sm"}
					height={"auto"}
					width={"fit"}
				>
					{(
						(
							[
								"age",
								"price",
								"condition",
								state.meta?.latLon ? "geo" : undefined,
							] satisfies (tListingSort["value"] | undefined)[]
						).filter(Boolean) as tListingSort["value"][]
					).map((sortValue) => {
						const current = sort.find((s) => s.value === sortValue);

						const position = current
							? sort.findIndex((s) => s.value === sortValue) + 1
							: undefined;

						return (
							<Button
								key={`${sortKeyId}-${sortValue}`}
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
								onClick={() => {
									setSort((prev) => {
										const idx = prev.findIndex(
											(s) => s.value === sortValue,
										);

										if (idx < 0) {
											return [
												...prev,
												{
													value: sortValue,
													sort: "asc",
												} satisfies tListingSort,
											];
										}

										const cur = prev[idx];

										if (!cur || cur.value !== sortValue) {
											return prev;
										}

										if (cur.sort === "asc") {
											const next = [
												...prev,
											];
											next[idx] = {
												value: cur.value,
												sort: "desc",
											} satisfies tListingSort;
											return next;
										}

										return prev.filter((_, i) => i !== idx);
									});
								}}
							>
								<div className="flex items-center gap-2">
									<Badge
										tone={
											position ? "primary" : "secondary"
										}
										theme={position ? "dark" : "light"}
										size={"sm"}
										tweak={{
											slot: {
												root: {
													class: [
														"py-2",
														"px-4",
													],
												},
											},
										}}
									>
										{position ?? "-"}
									</Badge>
									<Tx
										label={`Listing common sort value ${sortValue} - ${current?.sort ?? "unused"}`}
									/>
								</div>
							</Button>
						);
					})}
				</Container>
			</TitleContainer>
		);
	},
});
