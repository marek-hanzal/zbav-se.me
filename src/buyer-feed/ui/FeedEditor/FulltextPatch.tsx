import { type FC, useState } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { FormField } from "~/form/ui/FormField";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Mx } from "~/translation/ui/Mx";
import { Container } from "~/ui/ui/Container";
import { Status } from "~/ui/ui/Status";
import { TextInput } from "~/ui/ui/TextInput";

export namespace FulltextPatch {
	export interface Props extends Omit<Container.Props, "defaultValue"> {
		feed: FeedSchema.Type;
		onSettledFn?(): void;
		onCancelFn(): void;
	}
}

export const FulltextPatch: FC<FulltextPatch.Props> = ({
	feed,
	onSettledFn,
	onCancelFn,
	...props
}) => {
	const translator = useTranslator();
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled: onSettledFn,
	});
	const [fulltext, setFulltextFn] = useState(feed.query?.where?.fulltext?.[0] ?? "");

	return (
		<Container
			data-ui={"FulltextPatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			{...props}
		>
			<Container
				data-ui-layout="vertical-centered"
				data-ui-height="full"
			>
				<Status
					textTitle={translator.textFn("Feed fulltext (title)")}
					action={
						<FormField>
							{(props) => (
								<TextInput
									value={fulltext}
									onChange={(e) => {
										setFulltextFn(e.target.value);
									}}
									placeholder={translator.textFn("Feed fulltext (placeholder)")}
									autoFocus
									{...props}
								/>
							)}
						</FormField>
					}
					data-ui-text="md"
					data-ui-inner="4xl"
				>
					<Mx
						label={translator.textFn("Feed fulltext (hint)")}
						data-ui-tone="neutral"
						data-ui-theme="light"
					/>
				</Status>
			</Container>

			<SaveContainer
				onCancelFn={onCancelFn}
				onSaveFn={() => {
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
									fulltext: fulltext
										? [
												fulltext,
											]
										: undefined,
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
