import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import type { useView } from "@/lib/client/view2";
import { ChevronAction } from "~/common/ui/action/ChevronAction";
import { withAttrOfQuery } from "~/user/attr/query/withAttrOfQuery";
import { AttrOf } from "~/user/attr/ui/AttrOf";

export namespace AttrRequired {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
		categoryId: string | undefined | null;
		view: useView.Use<any>;
	}
}

export const AttrRequired: FC<AttrRequired.Props> = ({ listingId, categoryId, view }) => {
	/**
	 * We're not filtering fields here as we'll shared same query cache for both required/optional
	 * fields.
	 */
	const { data: fields } = withAttrOfQuery.useSuspenseQuery({
		listingId,
		categoryId: categoryId ?? "unknown",
	});

	const required = fields.filter((item) => item.required);

	if (!categoryId || !required.length) {
		return null;
	}

	return (
		<>
			<Tx
				label="Draft - category spec - required (title)"
				data-ui-tone="primary"
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
				{required.map((field) => {
					return (
						<Group key={field.name}>
							<AttrOf
								attrOf={field}
								wrapperProps={{
									"data-ui-tone": field.value ? "neutral" : "primary",
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
