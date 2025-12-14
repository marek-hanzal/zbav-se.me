import { useSelection } from "@use-pico/client/hook";
import { SaveIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import type { Rating } from "@zbav-se.me/ui/rating";
import { uiSaveButton } from "@zbav-se.me/ui/ui";
import { type FC, useState } from "react";
import { AgeSelection } from "~/app/age/ui/AgeSelection";

export namespace AgePatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
	}
}

export const AgePatch: FC<AgePatch.Props> = ({ feed, onSettled, ...props }) => {
	const [change, setChange] = useState(false);

	const selection = useSelection<Rating.RatingItem>({
		mode: "multi",
		initial: feed.query?.filter?.ageIn?.map((item) => ({
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
			data-ui={"AgePatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "default",
				inner: "default",
			}}
			{...props}
		>
			<AgeSelection selection={selection} />

			<Button
				label={"Feed - save (button)"}
				loading={mutation.isPending}
				disabled={!change || mutation.isPending}
				iconEnabled={SaveIcon}
				iconProps={{
					ui: {
						text: "2xl",
					},
				}}
				onClick={() => {
					mutation.mutate({
						patch: {
							...feed,
							query: {
								...feed.query,
								filter: {
									...feed.query?.filter,
									ageIn: selection.optional
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
					});
				}}
				{...uiSaveButton({
					className: [],
				})}
			/>
		</Container>
	);
};
