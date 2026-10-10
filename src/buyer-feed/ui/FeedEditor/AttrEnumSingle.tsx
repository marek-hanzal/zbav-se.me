import type { FC } from "react";
import { uiSelectButtonFn } from "~/application-ui/fn/ui.exports";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import type { AttrWhereSchema } from "~/buyer-listing/schema/AttrWhereSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { useSelection } from "~/selection/hook/useSelection";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";
import type { CategoryAttrOfSchema } from "~/user-category/schema/CategoryAttrOfSchema";
import type { useView } from "~/view/hook/useView";

export namespace AttrEnumSingle {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		field: Extract<
			CategoryAttrOfSchema.Type,
			{
				type: "enum-single";
			}
		>;
		attr:
			| Extract<
					AttrWhereSchema.Type,
					{
						type: "enum-single";
					}
			  >
			| undefined;
		view: useView.Use<"default">;
	}
}

export const AttrEnumSingle: FC<AttrEnumSingle.Props> = ({ feed, field, attr, view, ...props }) => {
	const translator = useTranslator();
	const mutation = withFeedQuery.usePatchMutation({
		onSuccess() {
			view.setFn("default");
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
			data-ui={"AttrEnumSingle"}
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
						const selected = selection.isSelectedFn(option.value);

						return (
							<Button
								key={option.value}
								onClick={() => {
									selection.toggleFn({
										id: option.value,
									});
								}}
								iconProps={{
									"data-ui-text": "2xl",
									"data-ui-color": selected ? "lead" : "icon",
								}}
								{...uiSelectButtonFn({
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
								{translator.textFn(`${field.name} - ${option.value}`, option.value)}
							</Button>
						);
					})}
				</Container>
			</Container>

			<SaveContainer
				onCancelFn={() => {
					view.setFn("default");
				}}
				onSaveFn={() => {
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
											type: "enum-single",
											value: selection.optional.multiIdFn() ?? undefined,
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
