import { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { CategorySelectionContainer } from "~/app/category/ui/CategorySelectionContainer";

export namespace CategoryPatch {
	export interface Props extends Container.Props {
		locale: string;
		feed: tFeed;
		onSettled?(): void;
	}
}

export const CategoryPatch: FC<CategoryPatch.Props> = ({ locale, feed, onSettled, ...props }) => {
	const [change, setChange] = useState(false);

	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: feed.query?.filter?.categoryIdIn?.map((id) => ({
			id,
		})),
		onMulti() {
			setChange(true);
		},
	});

	const mutation = withFeedPatchMutation.useMutation({
		onSettled() {
			setChange(false);
			onSettled?.();
		},
	});

	return (
		<Container
			data-ui={"CategoryPatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "default",
			}}
			{...props}
		>
			<CategorySelectionContainer
				locale={locale}
				selection={selection}
				categoryId={selection.optional.singleId()}
			/>

			<Button
				label={"Feed - save (button)"}
				loading={mutation.isPending}
				disabled={!change || mutation.isPending}
				onClick={() => {
					toast.promise(
						mutation.mutateAsync({
							patch: {
								...feed,
								query: {
									...feed.query,
									filter: {
										...feed.query?.filter,
										categoryIdIn: selection.optional.multiId(),
									},
								},
							},
							query: {
								where: {
									id: feed.id,
								},
							},
						}),
						{
							loading: translator.text("Loading... (toast)"),
							success: translator.text("Feed category updated (toast)"),
							error: translator.text("Error updating feed category (toast)"),
						},
					);
				}}
				ui={{
					tone: "secondary",
					theme: "dark",
					size: "xl",
				}}
			/>
		</Container>
	);
};
