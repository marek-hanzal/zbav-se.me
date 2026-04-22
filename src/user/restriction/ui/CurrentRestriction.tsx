import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { LabelValue, ValueList } from "@/lib/client/value";
import { toTimeDiff } from "@/lib/common/time";
import { translator } from "@/lib/common/translator";
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
	({ _suspense, ...props }: CurrentRestriction.Props) => {
		const locale = useLocale();
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
					"data-ui-tone": "brand",
					"data-ui-theme": "light",
					"data-ui-color": "lead",
				}}
				items={restrictions}
				renderFn={(restriction) => {
					return (
						<Container data-ui-width={"full"}>
							<Tx
								label={`Listing restriction - ${restriction.restriction}`}
								data-ui-font={restriction.isAvailable ? "bold" : undefined}
								data-ui-width={"full"}
							/>

							{restriction.isAvailable ? null : (
								<Container
									data-ui-flow={"horizontal"}
									data-ui-justify={"space-between"}
									data-ui-items={"center"}
									data-ui-width={"full"}
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
										data-ui-tone={"brand"}
										data-ui-theme={"light"}
										data-ui-color={"lead"}
										data-ui-font={"bold"}
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
