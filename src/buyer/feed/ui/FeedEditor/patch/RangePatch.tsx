import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { Dial } from "~/common/ui/dial";

export namespace RangePatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const RangePatch: FC<RangePatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const translator = useTranslator();
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const currentRange = feed.query?.filter?.range;
	const [rangeValue, setRangeValue] = useState<number | undefined>(currentRange);

	const handleSave = () => {
		patchMutation.mutate({
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
						range:
							rangeValue !== undefined && !Number.isNaN(rangeValue)
								? rangeValue
								: undefined,
					},
				},
			},
		});
	};

	return (
		<Container
			data-ui={"RangePatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<Container
				data-ui-layout="vertical-flex"
				data-ui-gap="md"
			>
				<Tx
					label="Feed range (description)"
					data-ui-tone="secondary"
					data-ui-text="sm"
				/>

				<Dial
					value={rangeValue}
					onChange={setRangeValue}
					placeholder={translator.text("Feed range (placeholder)")}
					allowDecimals={false}
				/>
			</Container>

			<SaveContainer
				onCancel={onCancel}
				onSave={handleSave}
				loading={patchMutation.isPending}
				disabled={patchMutation.isPending}
			/>
		</Container>
	);
};
