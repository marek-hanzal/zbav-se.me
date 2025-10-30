import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Badge,
	Button,
	Container,
	LinkTo,
	Tx,
} from "@use-pico/client";
import type {
	ListingCommonSort,
	ListingCommonSortValue,
	ListingGeoSort,
	ListingSort,
} from "@zbav-se.me/sdk";
import { TitleContainer } from "@zbav-se.me/ui";
import { useId, useState } from "react";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/sort")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const sortKeyId = useId();
		const [sort, setSort] = useState<ListingSort[]>(state.sort ?? []);

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
				bottom={
					<LinkTo
						to={"/$locale/buyer/feed/wizard/condition"}
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
							label={"Next - feed condition (button)"}
							full
						/>
					</LinkTo>
				}
			>
				<Container
					layout={"vertical"}
					scroll={"horizontal"}
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
								state.location ? "geo" : undefined,
							] satisfies (
								| ListingCommonSortValue
								| "geo"
								| undefined
							)[]
						).filter(Boolean) as (ListingCommonSortValue | "geo")[]
					).map((sortValue) => {
						const current =
							sortValue === "geo"
								? sort.find(
										(s): s is ListingGeoSort =>
											s.type === "geo",
									)
								: sort.find(
										(s): s is ListingCommonSort =>
											s.type === "listing" &&
											s.value === sortValue,
									);

						const position = current
							? sort.findIndex((s) =>
									sortValue === "geo"
										? s.type === "geo"
										: s.type === "listing" &&
											(s as ListingCommonSort).value ===
												sortValue,
								) + 1
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
										// Handle geo sort separately
										if (sortValue === "geo") {
											const idx = prev.findIndex(
												(s): s is ListingGeoSort =>
													s.type === "geo",
											);

											if (idx < 0) {
												// Add geo sort if we have location
												if (state.location) {
													return [
														...prev,
														{
															type: "geo",
															value: "geo",
															lon: state.location
																.lon,
															lat: state.location
																.lat,
															sort: "asc",
														} satisfies ListingGeoSort,
													];
												}
												return prev;
											}

											const cur = prev[idx];

											if (!cur || cur.type !== "geo") {
												return prev;
											}

											if (cur.sort === "asc") {
												const next = [
													...prev,
												];
												next[idx] = {
													type: "geo",
													value: "geo",
													lon: cur.lon,
													lat: cur.lat,
													sort: "desc",
												} satisfies ListingGeoSort;
												return next;
											}

											return prev.filter(
												(_, i) => i !== idx,
											);
										}

										// Handle common sorts
										const idx = prev.findIndex(
											(s): s is ListingCommonSort =>
												s.type === "listing" &&
												s.value === sortValue,
										);

										if (idx < 0) {
											return [
												...prev,
												{
													type: "listing",
													value: sortValue,
													sort: "asc",
												} satisfies ListingCommonSort,
											];
										}

										const cur = prev[idx];

										if (!cur || cur.type !== "listing") {
											return prev;
										}

										if (cur.sort === "asc") {
											const next = [
												...prev,
											];
											next[idx] = {
												type: "listing",
												value: cur.value,
												sort: "desc",
											} satisfies ListingCommonSort;
											return next;
										}

										return prev.filter((_, i) => i !== idx);
									});
								}}
							>
								<div className="flex items-center gap-2">
									<Badge
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
