import {
	Badge,
	Container,
	Data,
	type Fulltext,
	SnapperNav,
	Tx,
	Typo,
	useSnapperNav,
} from "@use-pico/client";
import { translator } from "@use-pico/common";
import { type FC, useEffect, useRef, useState } from "react";
import { withLocationQuery } from "~/app/location/query/withLocationQuery";
import { Sheet } from "~/app/sheet/Sheet";
import { SearchSheet } from "~/app/ui/search/SearchSheet";

export namespace LocationWrapper {
	export interface Props {
		locale: string;
	}
}

export const LocationWrapper: FC<LocationWrapper.Props> = ({ locale }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [search, setSearch] = useState<Fulltext.Value>();
	const locationQuery = withLocationQuery.useQuery(
		{
			lang: locale,
			text: search ?? "",
		},
		{
			enabled: !!search,
		},
	);

	const snapperNav = useSnapperNav({
		containerRef,
		count: 2,
		orientation: "horizontal",
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: We're OK
	useEffect(() => {
		if ((locationQuery.data?.length || 0) > 0) {
			snapperNav.snapTo(1);
		}
	}, [
		locationQuery.data,
	]);

	return (
		<Container position={"relative"}>
			<SnapperNav
				containerRef={containerRef}
				pages={{
					count: 2,
				}}
				orientation={"horizontal"}
				subtle
				iconProps={() => ({
					size: "xs",
				})}
			/>

			<Container
				ref={containerRef}
				layout={"horizontal-full"}
				overflow={"horizontal"}
				snap={"horizontal-start"}
				gap={"md"}
			>
				<SearchSheet
					state={{
						value: search,
						set: setSearch,
					}}
					query={locationQuery}
					textTitle={"Location (title)"}
					textPlaceholder={translator.text(
						"Location search (placeholder)",
					)}
					textNotFound={
						<Tx
							label={"Location not found (badge)"}
							size={"md"}
						/>
					}
				/>

				<Data
					result={locationQuery}
					renderSuccess={({ data }) => {
						return (
							<Sheet
								tweak={{
									slot: {
										root: {
											token: [
												"square.lg",
											],
										},
									},
								}}
							>
								<div className="flex flex-col gap-2">
									{data.map((item) => {
										return (
											<Badge
												key={item.id}
												tweak={{
													slot: {
														root: {
															class: [
																"w-full",
															],
														},
													},
												}}
												tone={"secondary"}
												theme={"light"}
											>
												<Typo
													label={item.address}
													size={"md"}
												/>
											</Badge>
										);
									})}
								</div>
							</Sheet>
						);
					}}
				/>
			</Container>
		</Container>
	);
};
