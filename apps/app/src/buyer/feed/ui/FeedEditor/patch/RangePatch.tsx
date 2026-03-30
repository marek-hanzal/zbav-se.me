import { translator } from "@use-pico/common/translator";
import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
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

export const RangePatch: FC<RangePatch.Props> = ({ feed, onSettled, onCancel, ui, ...props }) => {
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
			<Container
				ui={{
					layout: "vertical-flex",
					gap: "md",
				}}
			>
				<Tx
					label="Feed range (description)"
					ui={{
						tone: "secondary",
						text: "sm",
					}}
				/>
				<Dial
					value={rangeValue}
					onChange={setRangeValue}
					placeholder={translator.text("Feed range (placeholder)")}
					ui={{
						inner: "default",
					}}
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
