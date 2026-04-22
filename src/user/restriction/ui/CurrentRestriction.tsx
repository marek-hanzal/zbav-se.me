import { withFallback } from "@/lib/client/fallback";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { ValueList } from "@/lib/client/value";
import { translator } from "@/lib/common/translator";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { withUserRestrictionQuery } from "~/user/user-restriction/query/withUserRestrictionQuery";

export namespace CurrentRestriction {
	export interface Restriction {
		id: string;
		value: RestrictionEnumSchema.Type;
	}

	export interface Props
		extends Omit<
				ValueList.PropsEx<Restriction>,
				"items" | "renderFn" | "textLabel" | "textEmpty"
			>,
			MarkSuspense.Props {
		//
	}
}

export const CurrentRestriction = withFallback(
	({ _suspense, ...props }: CurrentRestriction.Props) => {
		const {
			data: [restriction],
		} = withUserRestrictionQuery.useCollectionQuery({
			where: {
				isAvailable: true,
			},
			cursor: {
				page: 0,
				size: 1,
			},
		});
		const items = (
			restriction
				? [
						restriction.restriction,
					]
				: [
						"none",
					]
		).map((item) => ({
			id: item,
			value: item,
		}));

		return (
			<ValueList
				textLabel={translator.text("Current Restriction value (label)")}
				textEmpty={translator.text("Current Restriction value (empty)")}
				textHint={translator.text("Current Restriction value (hint)")}
				labelProps={{
					"data-ui-tone": "brand",
					"data-ui-theme": "light",
					"data-ui-color": "lead",
				}}
				items={items}
				renderFn={({ value }) => {
					return (
						<Tx
							label={`Listing restriction - ${value}`}
							data-ui-font={"bold"}
						/>
					);
				}}
				{...props}
			/>
		);
	},
	({ ...props }: Omit<CurrentRestriction.Props, "_suspense">) => {
		return (
			<ValueList
				textLabel={translator.text("Current Restriction value (label)")}
				textEmpty={translator.text("Current Restriction value (empty)")}
				items={[]}
				renderFn={() => null}
				loading={true}
				{...props}
			/>
		);
	},
);
