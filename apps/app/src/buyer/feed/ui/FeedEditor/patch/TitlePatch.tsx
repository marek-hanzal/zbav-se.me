import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { translator } from "@use-pico/common/translator";
import { type FC, useState } from "react";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";

export namespace TitlePatch {
	export interface Props extends Omit<Container.Props, "defaultValue"> {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const TitlePatch: FC<TitlePatch.Props> = ({ feed, onSettled, onCancel, ui, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation();
	const [title, setTitle] = useState(feed.query?.filter?.title ?? "");

	return (
		<Container
			data-ui={"TitlePatch[TextInputContainer]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				width: "full",
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-centered",
					height: "full",
				}}
			>
				<Status
					textTitle={translator.text("Feed title (title)")}
					action={
						<FormField>
							{(fieldProps) => (
								<TextInput
									value={title}
									onChange={(e) => {
										setTitle(e.target.value);
									}}
									placeholder={translator.text("Feed title (placeholder)")}
									autoFocus
									{...fieldProps}
								/>
							)}
						</FormField>
					}
					ui={{
						text: "md",
						inner: "4xl",
					}}
				>
					<Mx
						label={translator.text("Feed title (hint)")}
						ui={{
							tone: "neutral",
							theme: "light",
						}}
					/>
				</Status>
			</Container>

			<SaveContainer
				onCancel={onCancel}
				onSave={() => {
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
										title,
									},
								},
							},
						},
						{
							onSettled,
						},
					);
				}}
				loading={patchMutation.isPending}
				disabled={false}
			/>
		</Container>
	);
};
