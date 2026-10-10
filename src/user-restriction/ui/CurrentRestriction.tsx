import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { LabelValue } from "~/ui/ui/LabelValue";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Typo } from "~/ui/ui/Typo";
import { ValueList } from "~/ui/ui/ValueList";
import { withUserRestrictionQuery } from "~/user-restriction/query/withUserRestrictionQuery";
import type { UserRestrictionSchema } from "~/user-restriction/schema/UserRestrictionSchema";

export namespace CurrentRestriction {
	export interface Props
		extends Omit<
				ValueList.PropsEx<UserRestrictionSchema.Type>,
				"textLabel" | "textEmpty" | "items" | "renderFn"
			>,
			MarkSuspense.Props {
		//
	}
}

export const CurrentRestriction = withFallbackFn(
	({ ...props }: CurrentRestriction.Props) => {
		const locale = useLocale();
		const translator = useTranslator();
		const { data: restrictions } = withUserRestrictionQuery.useCollectionQuery({
			where: {
				isExpired: false,
			},
			sort: [
				{
					field: "availableAt",
					order: "asc",
				},
			],
		});

		return (
			<ValueList
				textLabel={translator.textFn("Current Restriction value (label)")}
				textEmpty={translator.textFn("Current Restriction value (empty)")}
				textHint={translator.textFn("Current Restriction value (hint)")}
				textLabelProps={{
					"data-ui-tone": "primary",
					"data-ui-theme": "light",
					"data-ui-color": "lead",
				}}
				items={restrictions}
				renderFn={(restriction) => {
					return (
						<Container data-ui-width={"full"}>
							<Tx
								label={`Listing restriction - ${restriction.restriction}`}
								data-ui-font={restriction.isAvailable ? "semibold" : undefined}
								data-ui-width={"full"}
								data-ui-text={"default"}
							/>

							{restriction.isAvailable ? null : (
								<Container
									data-ui-flow={"horizontal"}
									data-ui-justify={"space-between"}
									data-ui-items={"center"}
									data-ui-width={"full"}
									data-ui-opacity={"6"}
								>
									<Tx
										label={"Restriction available in (label)"}
										data-ui-text={"sm"}
									/>

									<Typo
										label={toTimeDiffFn({
											type: "human",
											locale,
											time: restriction.availableAt,
										})}
										data-ui-tone={"primary"}
										data-ui-theme={"light"}
										data-ui-color={"lead"}
										data-ui-font={"semibold"}
										data-ui-text={"sm"}
										data-ui-opacity={"8"}
									/>
								</Container>
							)}
						</Container>
					);
				}}
				{...props}
			/>
		);
	},
	({ ...props }: Omit<CurrentRestriction.Props, "_suspense">) => {
		const translator = useTranslator();

		return (
			<LabelValue
				textLabel={translator.textFn("Current Restriction value (label)")}
				textEmpty={translator.textFn("Current Restriction value (empty)")}
				textValue={<SpinnerContainer type={"icon"} />}
				{...props}
			/>
		);
	},
);
