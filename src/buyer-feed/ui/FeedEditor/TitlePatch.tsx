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

export namespace TitlePatch {
	export interface Props extends Omit<Container.Props, "defaultValue"> {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const TitlePatch: FC<TitlePatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const translator = useTranslator();
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const [title, setTitle] = useState(feed.query?.where?.title ?? "");

	return (
		<Container
			data-ui={"TitlePatch"}
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
					textTitle={translator.text("Feed title (title)")}
					action={
						<FormField>
							{(props) => (
								<TextInput
									value={title}
									onChange={(e) => {
										setTitle(e.target.value);
									}}
									placeholder={translator.text("Feed title (placeholder)")}
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
						label={translator.text("Feed title (hint)")}
						data-ui-tone="neutral"
						data-ui-theme="light"
					/>
				</Status>
			</Container>

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
								where: {
									...feed.query?.where,
									title,
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
