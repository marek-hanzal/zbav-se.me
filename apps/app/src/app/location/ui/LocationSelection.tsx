import { Badge, Button, Container, Data, Fulltext, Tx } from "@use-pico/client";
import type { tLocationDto } from "@zbav-se.me/sdk";
import { SpinnerContainer } from "@zbav-se.me/ui";
import { type FC, type RefObject, useState } from "react";
import { withLocationAutocompleteQuery } from "~/app/location/query/withLocationAutocompleteQuery";

export namespace LocationSelection {
	export interface Props {
		ref?: RefObject<HTMLDivElement | null>;
		locale: string;
		value: string | undefined | null;
		onChange(value: string): void;
		onLocation?(value: tLocationDto): void;
		textHint?: string;
	}
}

export const LocationSelection: FC<LocationSelection.Props> = ({
	ref,
	locale,
	value,
	onChange,
	onLocation,
	textHint,
}) => {
	const [search, setSearch] = useState<Fulltext.Value>();
	const locationAutocompleteQuery = withLocationAutocompleteQuery.useQuery(
		{
			lang: locale,
			text: search ?? value ?? "",
		},
		{
			enabled: Boolean((search && search.length >= 3) || value),
		},
	);

	return (
		<Container
			ui="LocationSelection-root"
			ref={ref}
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
				{search || value ? null : (
					<Tx
						label={textHint ?? "Location security (hint)"}
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
				renderLoading={() => {
					return (
						<SpinnerContainer
							disableOverlay
							height={"fit"}
						/>
					);
				}}
				renderSuccess={({ data }) => {
					return data.map((item) => {
						return (
							<Button
								ui="LocationItem-root"
								key={item.id}
								full
								tone={"primary"}
								theme={value === item.id ? "dark" : "light"}
								onClick={() => {
									onChange(item.id);
									onLocation?.(item);
								}}
								size={"xl"}
								truncate
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
					if (!value) {
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
							layout={"vertical-flex"}
							scroll={"vertical"}
							gap={"sm"}
						>
							{content}
						</Container>
					);
				}}
			</Data>
		</Container>
	);
};
