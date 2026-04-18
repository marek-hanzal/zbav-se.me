import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
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
	const patchMutation = withFeedQuery.usePatchMutation();
	const currentRange = feed.query?.filter?.range;
	const [rangeValue, setRangeValue] = useState<string | undefined>(
		currentRange !== undefined ? String(currentRange) : undefined,
	);

	const handleSave = () => {
		const range = rangeValue ? parseFloat(rangeValue) : undefined;
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
							range: range !== undefined && !Number.isNaN(range) ? range : undefined,
						},
					},
				},
			},
			{
				onSettled,
			},
		);
	};

	return (
		<Container
			data-ui={"RangePatch[Container]"}
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
					data-ui-inner="default"
				/>
			</Container>

			<SaveContainer
				onCancel={onCancel}
				onSave={handleSave}
				loading={patchMutation.isPending}
				disabled={false}
			/>
		</Container>
	);
};
