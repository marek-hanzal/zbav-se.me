import {
	Badge,
	Container,
	Data,
	Fulltext,
	Status,
	Tx,
	Typo,
} from "@use-pico/client";
import { type FC, useRef, useState } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { withLocationQuery } from "~/app/location/query/withLocationQuery";
import { anim, useAnim } from "~/app/ui/gsap";
import { SearchIcon } from "~/app/ui/icon/SearchIcon";

export namespace LocationWrapper {
	export interface Props {
		locale: string;
	}
}

export const LocationWrapper: FC<LocationWrapper.Props> = ({ locale }) => {
	const useCreateListingStore = useCreateListingContext();
	const location = useCreateListingStore((state) => state.location);
	const setLocation = useCreateListingStore((state) => state.setLocation);
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
		<Container ref={containerRef}>
			<Container
				layout={"horizontal-full"}
				overflow={"horizontal"}
				snap={"horizontal-start"}
				gap={"md"}
			>
				<Container
					layout={"vertical-header-content"}
					tone={"primary"}
					theme={"light"}
				>
					<Status
						icon={SearchIcon}
						textTitle={"Location (title)"}
						textMessage={"Location (message)"}
						action={
							<div className="flex flex-col gap-2 items-center w-full">
								<Fulltext
									state={{
										value: search,
										set(value) {
											setSearch(value);
											setLocation(undefined);
										},
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
										size={"md"}
										italic
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

							return data.length > 0 ? (
								data.map((item) => {
									return (
										<Badge
											key={item.id}
											tweak={{
												slot: {
													root: {
														class: [
															"Location-item",
															"w-full",
															"h-fit",
															"opacity-0",
														],
														token: [
															"padding.lg",
															"round.lg",
														],
													},
												},
											}}
											tone={"secondary"}
											theme={
												location === item.id
													? "dark"
													: "light"
											}
											onClick={() => {
												setLocation(item.id);
											}}
										>
											<Typo
												label={item.address}
												size={"md"}
											/>
										</Badge>
									);
								})
							) : (
								<Badge
									size={"xl"}
									tone={"secondary"}
									theme={"light"}
									tweak={{
										slot: {
											root: {
												class: [
													"text-center",
													"transition-opacity",
													"mx-auto",
													data.length > 0
														? [
																"opacity-0",
															]
														: undefined,
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
			</Container>
		</Container>
	);
};
