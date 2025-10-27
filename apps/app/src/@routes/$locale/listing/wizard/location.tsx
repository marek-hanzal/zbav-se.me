import { createFileRoute } from "@tanstack/react-router";
import {
	Badge,
	Button,
	Container,
	Data,
	Fulltext,
	Status,
	Tx,
} from "@use-pico/client";
import { anim, LocationIcon, useAnim } from "@zbav-se.me/ui";
import { useRef, useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { withLocationFetchQuery } from "~/app/location/query/withLocationFetchQuery";
import { withLocationQuery } from "~/app/location/query/withLocationQuery";

export const Route = createFileRoute("/$locale/listing/wizard/location")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [search, setSearch] = useState<Fulltext.Value>();
		const containerRef = useRef<HTMLDivElement>(null);
		const locationQuery = withLocationQuery.useQuery(
			{
				lang: locale,
				text: search ?? "",
			},
			{
				enabled: Boolean(search && search.length >= 3),
			},
		);
		const selectedQuery = withLocationFetchQuery().useQuery(
			{
				where: {
					id: state.locationId,
				},
			},
			{
				enabled: Boolean(state.locationId),
			},
		);

		useAnim(
			() => {
				anim.timeline()
					.set(".Data-spinner", {
						opacity: 0,
						scale: 0.75,
					})
					.to(".Data-spinner", {
						opacity: 1,
						scale: 1,
					});
			},
			{
				scope: containerRef,
				dependencies: [
					locationQuery.isFetching,
				],
			},
		);

		useAnim(
			() => {
				anim.timeline({
					defaults: {
						duration: 0.25,
					},
				})
					.set(".Location-item", {
						opacity: 0,
						scale: 0.75,
						y: "-50%",
					})
					.to(".Location-item", {
						opacity: 1,
						scale: 1,
						y: 0,
						stagger: 0.075,
					});
			},
			{
				scope: containerRef,
				dependencies: [
					locationQuery.data,
				],
			},
		);

		return (
			<ListingContainer
				textTitle={"Location (title)"}
				textSubtitle={
					selectedQuery.data
						? selectedQuery.data.address
						: "Location (subtitle)"
				}
				// bottom={{
				// 	next: !!location,
				// }}
			>
				<Container
					ref={containerRef}
					layout={"vertical-header-content"}
					gap={"md"}
					round={"lg"}
				>
					<Status
						icon={LocationIcon}
						action={
							<div className="flex flex-col gap-2 items-center w-full">
								<Fulltext
									state={{
										value: search,
										set: setSearch,
									}}
									textPlaceholder={
										"Location search (placeholder)"
									}
									withSubmit
									tweak={{
										slot: {
											input: {
												class: [
													"px-8",
												],
												token: [
													"size.lg",
												],
											},
										},
									}}
								/>
								{search ? null : (
									<Tx
										label={"Location security (hint)"}
										font={"bold"}
										size={"lg"}
										tweak={{
											slot: {
												root: {
													class: [
														"text-justify",
													],
												},
											},
										}}
									/>
								)}
							</div>
						}
					/>

					<Data
						result={locationQuery}
						renderSuccess={({ data }) => {
							if (!search) {
								return null;
							}

							return data.map((item) => {
								return (
									<Button
										ui="LocationItem-root"
										key={item.id}
										full
										tone={"primary"}
										theme={
											state.locationId === item.id
												? "dark"
												: "light"
										}
										onClick={() => {
											navigate({
												search({
													locationId,
													...prev
												}) {
													return {
														...prev,
														locationId: item.id,
													};
												},
											});
										}}
										size={"xl"}
										tweak={{
											slot: {
												root: {
													class: [
														"justify-start",
													],
												},
											},
										}}
										label={item.address}
									/>
								);
							});
						}}
						renderEmpty={() => {
							return (
								<Badge
									size={"xl"}
									tone={"secondary"}
									theme={"light"}
									tweak={{
										slot: {
											root: {
												class: [
													"text-center",
													"mx-auto",
												],
												token: [
													"square.xl",
													"round.lg",
												],
											},
										},
									}}
								>
									<Tx label={"Location not found (badge)"} />
								</Badge>
							);
						}}
					>
						{({ content }) => {
							return (
								<Container
									overflow={"vertical"}
									height={"full"}
								>
									<div className="grid grid-row auto-rows-max gap-2 p-4">
										{content}
									</div>
								</Container>
							);
						}}
					</Data>
				</Container>
			</ListingContainer>
		);
	},
});
