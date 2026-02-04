import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { useFeedPatch } from "~/app/@buyer-user/feed/hook/useFeedPatch";
import { AgeSelection } from "~/app/@common/age/ui/AgeSelection";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";

export namespace AgePatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const AgePatch: FC<AgePatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const { patch: mutatePatch, isPending } = useFeedPatch({
		feed,
		onSettled,
	});
	const selection = useSelection<Rating.RatingItem>({
		mode: "multi",
		initial: feed.query?.filter?.ageIn?.map((item) => ({
			id: String(item),
		})),
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
			<AgeSelection
				selection={selection}
				allowClear
			/>

			<SaveContainer
				onCancel={onCancel}
				onSave={() => {
					mutatePatch({
						query: {
							...feed.query,
							filter: {
								...feed.query?.filter,
								ageIn: selection.optional
									.multiId()
									.map((id) => Number.parseInt(id, 10)),
							},
						},
					});
				}}
				loading={isPending}
				disabled={false}
			/>
		</Container>
	);
};
