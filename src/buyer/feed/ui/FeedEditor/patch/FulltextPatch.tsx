import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { Mx } from "@/lib/client/mx";
import { Status } from "@/lib/client/status";
import { TextInput } from "@/lib/client/text-input";
import { useTranslator } from "@/lib/client/translation";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";

export namespace FulltextPatch {
	export interface Props extends Omit<Container.Props, "defaultValue"> {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const FulltextPatch: FC<FulltextPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const translator = useTranslator();
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const [fulltext, setFulltext] = useState(feed.query?.filter?.fulltext?.[0] ?? "");

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
					textTitle={translator.text("Feed fulltext (title)")}
					action={
						<FormField>
							{(props) => (
								<TextInput
									value={fulltext}
									onChange={(e) => {
										setFulltext(e.target.value);
									}}
									placeholder={translator.text("Feed fulltext (placeholder)")}
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
						label={translator.text("Feed fulltext (hint)")}
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
								filter: {
									...feed.query?.filter,
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
