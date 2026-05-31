import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { useSelection } from "@/lib/client/selection";
import { useTranslator } from "@/lib/client/translation";
import type { useView } from "@/lib/client/view";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import type { AttrWhereSchema } from "~/buyer/listing/server/schema/AttrWhereSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { uiSelectButton } from "~/common/ui/ui";
import type { CategoryAttrOfSchema } from "~/user/category/server/schema/CategoryAttrOfSchema";

export namespace AttrEnumMulti {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		field: Extract<
			CategoryAttrOfSchema.Type,
			{
				type: "enum-multi";
			}
		>;
		attr:
			| Extract<
					AttrWhereSchema.Type,
					{
						type: "enum-multi";
					}
			  >
			| undefined;
		view: useView.Use<"default">;
	}
}

export const AttrEnumMulti: FC<AttrEnumMulti.Props> = ({ feed, field, attr, view, ...props }) => {
	const translator = useTranslator();
	const mutation = withFeedQuery.usePatchMutation({
		onSuccess() {
			view.set("default");
		},
	});
	const selection = useSelection({
		mode: "multi",
		initial:
			attr?.value?.map((id) => ({
				id,
			})) ?? [],
	});

	return (
		<Container
			data-ui={"AttrEnumMulti"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<Container
				data-ui-height={"full"}
				data-ui-scroll={"vertical"}
			>
				<Container
					data-ui-height={"auto"}
					data-ui-flow={"vertical"}
					data-ui-gap={"default"}
				>
					{field.options.map((option) => {
						const selected = selection.isSelected(option.value);

						return (
							<Button
								key={option.value}
								onClick={() => {
									selection.toggle({
										id: option.value,
									});
								}}
								iconProps={{
									"data-ui-text": "2xl",
									"data-ui-color": selected ? "lead" : "icon",
								}}
								{...uiSelectButton({
									isSelected: selected,
									"data-ui-flow": "horizontal",
									"data-ui-justify": "start",
									"data-ui-items": "center",
									"data-ui-gap": "sm",
									"data-ui-size": "default",
									"data-ui-text": "lg",
									className: [
										"text-left",
										"shrink-0",
									],
								})}
							>
								{translator.text(`${field.name} - ${option.value}`, option.value)}
							</Button>
						);
					})}
				</Container>
			</Container>

			<SaveContainer
				onCancel={() => {
					view.set("default");
				}}
				onSave={() => {
					mutation.mutate({
						query: {
							where: {
								id: feed.id,
							},
						},
						patch: {
							query: {
								...feed.query,
								where: {
									...feed.query?.where,
									attrs: {
										...feed.query?.where?.attrs,
										[field.name]: {
											name: field.name,
											type: "enum-multi",
											value: selection.optional.multiId() ?? undefined,
										},
									},
								},
							},
						},
					});
				}}
				loading={mutation.isPending}
				disabled={mutation.isPending}
			/>
		</Container>
	);
};
