import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import type { useView } from "@/lib/client/view2";
import { ChevronAction } from "~/common/ui/action/ChevronAction";
import { withListingAttrOfQuery } from "~/user/listing-attr/query/withListingAttrOfQuery";
import { ListingAttrOf } from "~/user/listing-attr/ui/ListingAttrOf";

export namespace AttrOptional {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
		categoryId: string | undefined | null;
		view: useView.Use<any>;
	}
}

export const AttrOptional: FC<AttrOptional.Props> = ({ listingId, categoryId, view }) => {
	/**
	 * We're not filtering fields here as we'll shared same query cache for both required/optional
	 * fields.
	 */
	const { data: fields } = withListingAttrOfQuery.useSuspenseQuery({
		listingId,
		categoryId: categoryId ?? "unknown",
	});

	const optional = fields.filter((item) => item.kind === "optional");

	if (!categoryId || !optional.length) {
		return null;
	}

	return (
		<>
			<Tx
				label="Draft - category spec - optional (title)"
				data-ui-tone="secondary"
				data-ui-theme="light"
				data-ui-text="md"
				data-ui-color="lead"
				data-ui-opacity="8"
				className={"text-center"}
			/>

			<Container
				data-ui-flow={"vertical"}
				data-ui-gap={"default"}
			>
				{optional.map((field) => {
					return (
						<Group key={field.name}>
							<ListingAttrOf
								attrOf={field}
								wrapperProps={{
									"data-ui-tone": (
										Array.isArray(field.value)
											? field.value.length > 0
											: field.value
									)
										? "neutral"
										: "secondary",
								}}
								action={<ChevronAction />}
								onClick={() => {
									view.set(`attr.${field.name}`);
								}}
							/>
						</Group>
					);
				})}
			</Container>
		</>
	);
};
