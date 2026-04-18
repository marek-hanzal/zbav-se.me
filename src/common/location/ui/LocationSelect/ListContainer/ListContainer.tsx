import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import type { Fulltext } from "@/lib/client/fulltext";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { uiSelectButton } from "~/common/ui/ui";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import { withLocationAutocompleteQuery } from "~/session/location/withLocationAutocompleteQuery";
import { Empty } from "./Data/Empty";
import { Default } from "./Default";

export namespace ListContainer {
	export interface Props
		extends Omit<Container.Props, "onChange">,
			Pick<Default.Props, "textHint" | "warningStatusProps"> {
		search: Fulltext.Value;
		value: string | undefined | null;
		onChange(value: string | null): void;
		allowClear?: boolean;
		onLocation?(value: LocationSchema.Type): void;
	}
}

/**
 * Coordinates location suggestion rendering across loading, validation, and resolved query states.
 * Use it in location search inputs where results should appear only after a meaningful text threshold.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const ListContainer = withFallback(
	({
		textHint,
		search,
		value,
		onChange,
		allowClear,
		onLocation,
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
				data-ui="ListContainer"
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
									if (allowClear && value === item.id) {
										onChange(null);
										return;
									}

									onChange(item.id);
									onLocation?.(item);
								}}
								truncate
								{...uiSelectButton({
									isSelected: value === item.id,
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
	},
	SpinnerContainer,
);
