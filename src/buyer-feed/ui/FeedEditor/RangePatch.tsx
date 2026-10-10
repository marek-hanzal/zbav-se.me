import { type FC, useState } from "react";
import { Dial } from "~/application-ui/ui/Dial/index";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";

export namespace RangePatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettledFn?(): void;
		onCancelFn(): void;
	}
}

export const RangePatch: FC<RangePatch.Props> = ({ feed, onSettledFn, onCancelFn, ...props }) => {
	const translator = useTranslator();
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled: onSettledFn,
	});
	const currentRange = feed.query?.where?.range;
	const [rangeValue, setRangeValueFn] = useState<number | undefined>(currentRange);

	const handleSaveFn = () => {
		patchMutation.mutate({
			query: {
				where: {
					id: feed.id,
				},
			},
			patch: {
				query: {
					...feed.query,
					where: {
						...feed.query?.where,
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
					onChangeFn={setRangeValueFn}
					placeholder={translator.textFn("Feed range (placeholder)")}
					allowDecimals={false}
				/>
			</Container>

			<SaveContainer
				onCancelFn={onCancelFn}
				onSaveFn={handleSaveFn}
				loading={patchMutation.isPending}
				disabled={patchMutation.isPending}
			/>
		</Container>
	);
};
