import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { AgeSelection } from "~/app/@common/age/ui/AgeSelection";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";

export namespace AgePatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const AgePatch: FC<AgePatch.Props> = ({ feed, onSettled, onCancel, ui, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation();
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
				width: "full",
				inner: "default",
				gap: "default",
				...ui,
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
					patchMutation.mutate(
						{
							query: {
								where: {
									id: feed.id,
								},
							},
							patch: {
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
						},
						{
							onSettled,
						},
					);
				}}
				loading={patchMutation.isPending}
				disabled={false}
			/>
		</Container>
	);
};
