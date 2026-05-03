import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import type { useView } from "@/lib/client/view";
import { ChevronAction } from "~/common/ui/action/ChevronAction";
import { withDraftAttrOfQuery } from "~/user/draft-attr/query/withDraftAttrOfQuery";
import { DraftAttrOf } from "~/user/draft-attr/ui/DraftAttrOf";

export namespace AttrRecommended {
	export interface Props extends MarkSuspense.Props {
		draftId: string;
		categoryId: string | undefined | null;
		view: useView.Use<any>;
	}
}

export const AttrRecommended: FC<AttrRecommended.Props> = ({ draftId, categoryId, view }) => {
	/**
	 * We're not filtering fields here as we'll share the same query cache for both recommended/optional
	 * fields.
	 */
	const { data: fields } = withDraftAttrOfQuery.useSuspenseQuery({
		draftId,
		categoryId: categoryId ?? "unknown",
	});

	const recommended = fields.filter((item) => item.kind === "recommended");

	if (!categoryId || !recommended.length) {
		return null;
	}

	return (
		<>
			<Tx
				label="Draft - category spec - recommended (title)"
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
				{recommended.map((field) => {
					return (
						<Group key={field.name}>
							<DraftAttrOf
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
