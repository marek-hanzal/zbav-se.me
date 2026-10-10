import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { LabelValue } from "~/ui/ui/LabelValue";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Typo } from "~/ui/ui/Typo";
import { ValueList } from "~/ui/ui/ValueList";
import { withUserRestrictionQuery } from "~/user/user-restriction/query/withUserRestrictionQuery";
import type { UserRestrictionSchema } from "~/user/user-restriction/server/schema/UserRestrictionSchema";

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

export const CurrentRestriction = withFallback(
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
				textLabel={translator.text("Current Restriction value (label)")}
				textEmpty={translator.text("Current Restriction value (empty)")}
				textHint={translator.text("Current Restriction value (hint)")}
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
										label={toTimeDiff({
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
				textLabel={translator.text("Current Restriction value (label)")}
				textEmpty={translator.text("Current Restriction value (empty)")}
				textValue={<SpinnerContainer type={"icon"} />}
				{...props}
			/>
		);
	},
);
