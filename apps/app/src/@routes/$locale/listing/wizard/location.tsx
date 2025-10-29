import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Badge,
	Button,
	Container,
	Data,
	Fulltext,
	LinkTo,
	Tx,
} from "@use-pico/client";
import { useRef, useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/ListingContainer";
import { withLocationAutocompleteQuery } from "~/app/location/query/withLocationAutocompleteQuery";

export const Route = createFileRoute("/$locale/listing/wizard/location")({
	validateSearch: ListingWizardSchema,
	component() {
		const { user } = useLoaderData({
			from: "/$locale",
		});
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const [locationId, setLocationId] = useState(
			state.locationId ?? user?.locationId,
		);
		const [search, setSearch] = useState<Fulltext.Value>();
		const containerRef = useRef<HTMLDivElement>(null);
		const locationAutocompleteQuery =
			withLocationAutocompleteQuery.useQuery(
				{
					lang: locale,
					text: search ?? locationId ?? "",
				},
				{
					enabled: Boolean(
						(search && search.length >= 3) || locationId,
					),
				},
			);
		const isSelected = Boolean(locationId);

		return (
			<ListingContainer
				textTitle={"Location (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/price"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/listing/wizard/expire-at"}
						params={{
							locale,
						}}
						search={{
							...state,
							locationId,
						}}
						disabled={!locationId}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							disabled={!locationId}
							size={"lg"}
							full
							iconPosition={"right"}
							label={"Next - expire (button)"}
						/>
					</LinkTo>
				}
			>
				<Container
					ui="Location-root"
					ref={containerRef}
					layout={"vertical-header-content"}
					gap={"md"}
					round={"lg"}
				>
					<div className="flex flex-col gap-2 items-center w-full">
						<Fulltext
							state={{
								value: search,
								set: setSearch,
							}}
							textPlaceholder={"Location search (placeholder)"}
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
						{search || locationId ? null : (
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

					<Data
						result={locationAutocompleteQuery}
						renderSuccess={({ data }) => {
							return data.map((item) => {
								return (
									<Button
										ui="LocationItem-root"
										key={item.id}
										full
										tone={"primary"}
										theme={
											locationId === item.id
												? "dark"
												: "light"
										}
										onClick={() => {
											setLocationId(item.id);
										}}
										size={"xl"}
										tweak={{
											slot: {
												root: {
													class: [
														"justify-center",
														"items-start",
														"text-left",
														"flex",
														"flex-col",
														"gap-1",
														"w-full",
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
							if (!isSelected) {
								return null;
							}
							return (
								<Badge
									size={"lg"}
									tone={"primary"}
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
									ui="Location-content"
									overflow={"vertical"}
									height={"full"}
								>
									<div
										className={
											"grid grid-rows-1 justify-stretch items-center h-full"
										}
									>
										<div className="grid grid-row auto-rows-max gap-2 p-4">
											{content}
										</div>
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
