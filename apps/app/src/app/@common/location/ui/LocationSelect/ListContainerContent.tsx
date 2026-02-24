import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { withLocationAutocompleteQuery } from "@zbav-se.me/sdk/query/session";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import type { ListContainer } from "./ListContainer";

export namespace ListContainerContent {
	export interface Props
		extends Omit<ListContainer.Props, "search" | "textHint" | "warningStatusProps">,
			MarkSuspense.Props {
		text: string;
		onLocation?(value: tLocation): void;
	}
}

export const ListContainerContent: FC<ListContainerContent.Props> = ({
	_suspense,
	text,
	value,
	onChange,
	onLocation,
	ui,
	...props
}) => {
	const locale = useLocale();
	const { data } = withLocationAutocompleteQuery.useSuspenseQuery({
		lang: locale,
		text,
	});

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
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-flex",
					gap: "default",
				}}
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
		</Container>
	);
};
