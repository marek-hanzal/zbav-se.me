import type { Fulltext } from "@use-pico/client/ui/fulltext";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { Button } from "@use-pico/client/ui/button";
import { withFallback } from "@use-pico/client/utils";
import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { withLocationAutocompleteQuery } from "@zbav-se.me/sdk/query/session";
import { Default } from "./Default";
import { Empty } from "./Data/Empty";
import { uiSelectButton } from "@zbav-se.me/ui/ui";

export namespace ListContainer {
	export interface Props
		extends Omit<Container.Props, "onChange">,
			Pick<Default.Props, "textHint" | "warningStatusProps"> {
		search: Fulltext.Value;
		value: string | undefined | null;
		onChange(value: string): void;
		onLocation?(value: tLocation): void;
	}
}

/**
 * Coordinates location suggestion rendering across loading, validation, and resolved query states.
 * Use it in location search inputs where results should appear only after a meaningful text threshold.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const ListContainer = withFallback(({
	textHint,
	search,
	value,
	onChange,
	onLocation,
	ui,
	warningStatusProps,
	...props
}: ListContainer.Props) => {
	const text = search ?? value ?? "";

	if (text.length < 3) {
		return (
			<Default
				textHint={textHint}
				warningStatusProps={warningStatusProps}
				ui={ui}
			/>
		);
	}

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
}, SpinnerContainer);
