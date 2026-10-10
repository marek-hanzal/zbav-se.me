import { uiSelectButtonFn } from "~/application-ui/fn/ui.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { Default } from "~/location/ui/ListContainer/Default";
import { Empty } from "~/location/ui/ListContainer/Empty";
import { withLocationAutocompleteQuery } from "~/session-location/query/withLocationAutocompleteQuery";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";
import type { Fulltext } from "~/ui/ui/Fulltext";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";

export namespace ListContainer {
	export interface Props
		extends Omit<Container.Props, "onChange">,
			Pick<Default.Props, "textHint" | "warningStatusProps"> {
		search: Fulltext.Value;
		value: string | undefined | null;
		onChangeFn(value: string | null): void;
		allowClear?: boolean;
		onLocationFn?(value: LocationSchema.Type): void;
	}
}

/**
 * Coordinates location suggestion rendering across loading, validation, and resolved query states.
 * Use it in location search inputs where results should appear only after a meaningful text threshold.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const ListContainer = withFallbackFn(
	({
		textHint,
		search,
		value,
		onChangeFn,
		allowClear,
		onLocationFn,
		warningStatusProps,
		...props
	}: ListContainer.Props) => {
		const text = search ?? value ?? "";

		if (text.length < 3) {
			return (
				<Default
					textHint={textHint}
					warningStatusProps={warningStatusProps}
				/>
			);
		}

		const locale = useLocale();
		const { data } = withLocationAutocompleteQuery.useSuspenseQuery({
			lang: locale,
			text,
		});

		if (data.length === 0) {
			return <Empty />;
		}

		return (
			<Container
				data-ui="ListContainer"
				data-ui-scroll="vertical"
				data-ui-height="full"
				{...props}
			>
				<Container
					data-ui-layout="vertical-flex"
					data-ui-gap="default"
				>
					{data.map((item) => {
						return (
							<Button
								key={item.id}
								data-action={"select location"}
								onClick={() => {
									if (allowClear && value === item.id) {
										onChangeFn(null);
										return;
									}

									onChangeFn(item.id);
									onLocationFn?.(item);
								}}
								truncate
								{...uiSelectButtonFn({
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
