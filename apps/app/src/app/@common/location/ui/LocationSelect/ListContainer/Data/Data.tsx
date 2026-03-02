import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import type { Container as ContainerUi } from "@use-pico/client/ui/container";
import { Container } from "@use-pico/client/ui/container";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { withLocationAutocompleteQuery } from "@zbav-se.me/sdk/query/session";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import { Empty } from "./Empty";

export namespace Data {
	export interface Props extends Omit<ContainerUi.Props, "onChange">, MarkSuspense.Props {
		text: string;
		value: string | undefined | null;
		onChange(value: string): void;
		onLocation?(value: tLocation): void;
	}
}

export const Data: FC<Data.Props> = ({
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
		return <Empty ui={ui} />;
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
							{...uiSelectButton({
								isSelected: value === item.id,
								ui,
								className: [
									"text-left",
								],
							})}
							data-ui="ListContainer-[Button]"
						>
							{item.address}
						</Button>
					);
				})}
			</Container>
		</Container>
	);
};
