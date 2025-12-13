import { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import type { Rating } from "@zbav-se.me/ui/rating";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { ConditionContainer } from "~/app/condition/ui/ConditionContainer";

export namespace ConditionPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
	}
}

export const ConditionPatch: FC<ConditionPatch.Props> = ({ feed, onSettled, ...props }) => {
	const [change, setChange] = useState(false);

	const selection = useSelection<Rating.RatingItem>({
		mode: "multi",
		initial: feed.query?.filter?.conditionIn?.map((item) => ({
			id: String(item),
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
			data-ui={"ConditionPatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "default",
			}}
			{...props}
		>
			<ConditionContainer selection={selection} />

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
										conditionIn: selection.optional
											.multiId()
											.map((id) => Number.parseInt(id, 10)),
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
							success: translator.text("Feed condition updated (toast)"),
							error: translator.text("Error updating feed condition (toast)"),
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
