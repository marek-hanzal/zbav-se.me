import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { Dial } from "@zbav-se.me/ui/dial";
import { type FC, useState } from "react";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";

export namespace RangePatch {
	export interface Props extends Container.Props {
		feed: tFeed;
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
		<PatchContainer
			data-ui={"RangePatch[Container]"}
			onCancel={onCancel}
			onSave={handleSave}
			loading={patchMutation.isPending}
			disabled={false}
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
		</PatchContainer>
	);
};
