import {
	Badge,
	Container,
	Data,
	Fulltext,
	Status,
	Tx,
	Typo,
} from "@use-pico/client";
import { type FC, useState } from "react";
import { withLocationQuery } from "~/app/location/query/withLocationQuery";
import { SearchIcon } from "~/app/ui/icon/SearchIcon";

export namespace LocationWrapper {
	export interface Props {
		locale: string;
	}
}

export const LocationWrapper: FC<LocationWrapper.Props> = ({ locale }) => {
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

	return (
		<Container>
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
										set: setSearch,
									}}
									textPlaceholder={
										"Location search (placeholder)"
									}
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
							return search && data.length > 0 ? (
								<div className="flex flex-col gap-2 p-4">
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
							) : (
								<Badge
									size={"xl"}
									tone={"secondary"}
									theme={"light"}
									tweak={{
										slot: {
											root: {
												class: [
													"transition-opacity",
													data.length > 0
														? [
																"opacity-0",
															]
														: undefined,
												],
											},
										},
									}}
								>
									<Tx label={"Location not found (badge)"} />
								</Badge>
							);
						}}
					/>
				</Container>
			</Container>
		</Container>
	);
};
