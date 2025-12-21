import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user/feed";
import { Dial } from "@zbav-se.me/ui/dial";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";

export namespace RangePatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const RangePatch: FC<RangePatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patch = withFeedFetchQuery.useSet();
	const currentRange = feed.query?.filter?.range;
	const [rangeValue, setRangeValue] = useState<string | undefined>(
		currentRange !== undefined ? String(currentRange) : undefined,
	);

	const mutation = withFeedPatchMutation.useMutation({
		onSuccess(feed) {
			patch(() => feed, {
				where: {
					id: feed.id,
				},
			});
		},
		onSettled() {
			onSettled?.();
		},
	});

	const handleSave = () => {
		const range = rangeValue ? parseFloat(rangeValue) : undefined;
		mutation.mutate({
			patch: {
				query: {
					...feed.query,
					filter: {
						...feed.query?.filter,
						range: range !== undefined && !Number.isNaN(range) ? range : undefined,
					},
				},
			},
			query: {
				where: {
					id: feed.id,
				},
			},
		});
	};

	return (
		<Container
			data-ui={"RangePatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				inner: "default",
				gap: "default",
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
					ui={{
						inner: "default",
					}}
				/>
			</Container>

			<SaveControl
				onCancel={onCancel}
				onSave={handleSave}
				loading={mutation.isPending}
				disabled={false}
			/>
		</Container>
	);
};
