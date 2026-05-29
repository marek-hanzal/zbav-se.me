import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { ValueList } from "@/lib/client/value";
import type { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";

export namespace ListingStatusValueList {
	export interface Props
		extends Omit<
			ValueList.PropsEx<{
				id: string;
				status: string;
			}>,
			"items" | "renderFn"
		> {
		statusIn: ListingStatusEnumSchema.Type[];
	}
}

export const ListingStatusValueList: FC<ListingStatusValueList.Props> = ({
	statusIn,
	...props
}) => {
	const translator = useTranslator();

	return (
		<ValueList
			data-ui={"ListingStatusValueList"}
			textLabel={translator.text("Listing status (label)")}
			textEmpty={translator.text("Listing status not selected")}
			items={statusIn.map((status) => ({
				id: status,
				status,
			}))}
			renderFn={(item) => translator.text(`Listing status - ${item.status}`)}
			wrapperProps={{
				...(statusIn.length > 0
					? {
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
						}
					: undefined),
			}}
			{...props}
		/>
	);
};
