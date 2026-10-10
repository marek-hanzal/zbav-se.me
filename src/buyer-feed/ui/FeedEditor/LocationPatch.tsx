import { type FC, useState } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { LocationSelect } from "~/location/ui/LocationSelect";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Container } from "~/ui/ui/Container";

export namespace LocationPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const translator = useTranslator();
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const [locationId, setLocationId] = useState<string | undefined | null>(
		feed.query?.meta?.locationId,
	);

	return (
		<Container
			data-ui={"LocationPatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-inner="default"
			{...props}
		>
			<LocationSelect
				value={locationId}
				onChange={setLocationId}
				textHint={translator.text("Feed location security (hint)")}
				allowClear
			/>

			<SaveContainer
				onCancel={onCancel}
				onSave={() => {
					patchMutation.mutate({
						query: {
							where: {
								id: feed.id,
							},
						},
						patch: {
							query: {
								...feed.query,
								meta: {
									...feed.query?.meta,
									locationId: locationId ?? undefined,
								},
							},
						},
					});
				}}
				loading={patchMutation.isPending}
				disabled={patchMutation.isPending}
			/>
		</Container>
	);
};
