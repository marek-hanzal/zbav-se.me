import { WarningIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { Fulltext } from "@use-pico/client/ui/fulltext";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { withLocationAutocompleteQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";

export namespace ListContainer {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		textHint?: string;
		search: Fulltext.Value;
		value: string | undefined | null;
		onChange(value: string): void;
		onLocation?(value: tLocation): void;
	}
}

export const ListContainer: FC<ListContainer.Props> = ({
	_suspense,
	locale,
	textHint,
	search,
	value,
	onChange,
	onLocation,
	...props
}) => {
	const text = search ?? value ?? "";

	const locationAutocompleteQuery = withLocationAutocompleteQuery.useSuspenseQuery({
		lang: locale,
		text,
	});

	if (text.length < 3) {
		return (
			<Container
				layout={"vertical-centered"}
				items={"center"}
			>
				<Status
					tone={"danger"}
					icon={WarningIcon}
				>
					<Mx
						label={textHint ?? "Location security (hint)"}
						tone={"secondary"}
						tweak={{
							slot: {
								p: {
									class: [
										"px-2",
									],
								},
							},
						}}
					/>
				</Status>
			</Container>
		);
	}

	if (locationAutocompleteQuery.data.length === 0) {
		return (
			<Container
				layout={"vertical-centered"}
				items={"center"}
			>
				<Badge
					size={"lg"}
					tone={"danger"}
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
									"round.default",
								],
							},
						},
					}}
				>
					<Tx label={"Location not found (badge)"} />
				</Badge>
			</Container>
		);
	}

	return (
		<Container
			ui="Location-content"
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"sm"}
			{...props}
		>
			{locationAutocompleteQuery.data.map((item) => {
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
			})}
		</Container>
	);
};
