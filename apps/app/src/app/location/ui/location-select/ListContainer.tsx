import { useLocale } from "@use-pico/client/hook";
import { WarningIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { Fulltext } from "@use-pico/client/ui/fulltext";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { withLocationAutocompleteQuery } from "@zbav-se.me/sdk/query/session";
import { uiSelectButton, uiWarningStatus } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace ListContainer {
	export interface Props extends Omit<Container.Props, "onChange"> {
		textHint: string;
		search: Fulltext.Value;
		value: string | undefined | null;
		onChange(value: string): void;
		onLocation?(value: tLocation): void;
	}
}

export const ListContainer: FC<ListContainer.Props> = ({
	textHint,
	search,
	value,
	onChange,
	onLocation,
	ui,
	...props
}) => {
	const locale = useLocale();
	const text = search ?? value ?? "";

	if (text.length < 3) {
		return (
			<Container
				data-ui="ListContainer[Container.default]"
				ui={{
					layout: "vertical-centered",
					scroll: "vertical",
					height: "full",
					...ui,
				}}
			>
				<Status
					icon={WarningIcon}
					{...uiWarningStatus({
						className: [],
					})}
				>
					<Container
						ui={{
							text: "default",
						}}
					>
						<Mx
							label={textHint}
							ui={{
								tone: "secondary",
								theme: "light",
							}}
						/>
					</Container>
				</Status>
			</Container>
		);
	}

	return (
		<withLocationAutocompleteQuery.Suspense
			data={{
				lang: locale,
				text,
			}}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				if (data.length === 0) {
					return (
						<Container
							data-ui="ListContainer[Container.empty]"
							ui={{
								layout: "vertical-centered",
								height: "full",
								...ui,
							}}
						>
							<Badge
								className="text-center mx-auto"
								ui={{
									size: "lg",
									tone: "danger",
									theme: "light",
								}}
							>
								<Tx label={"Location not found (badge)"} />
							</Badge>
						</Container>
					);
				}

				return (
					<Container
						data-ui="ListContainer[Container.content]"
						ui={{
							layout: "vertical-flex",
							scroll: "vertical",
							height: "full",
							gap: "default",
							...ui,
						}}
						{...props}
					>
						{data.map((item) => {
							return (
								<Button
									key={item.id}
									onClick={() => {
										onChange(item.id);
										onLocation?.(item);
									}}
									truncate
									label={item.address}
									{...uiSelectButton({
										isSelected: value === item.id,
										ui,
										className: [],
									})}
									data-ui="ListContainer-[Button]"
								/>
							);
						})}
					</Container>
				);
			}}
		</withLocationAutocompleteQuery.Suspense>
	);
};
