import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { translator } from "@use-pico/common/translator";
import { sFeedCreate, type tFeed } from "@zbav-se.me/sdk/api/buyer";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";

export namespace NamePatch {
	export interface Props extends Omit<Container.Props, "defaultValue"> {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const NamePatch: FC<NamePatch.Props> = ({ feed, onSettled, onCancel, ui, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation();
	const [name, setName] = useState(feed.name ?? "");
	const invalid = !name || name.length < sFeedCreate.properties.name.minLength;

	return (
		<Container
			data-ui={"NamePatch[TextInputContainer]"}
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
					textTitle={translator.text("Feed name (title)")}
					action={
						<FormField>
							{(fieldProps) => (
								<TextInput
									value={name}
									onChange={(e) => {
										setName(e.target.value);
									}}
									placeholder={translator.text("Feed name (placeholder)")}
									autoFocus
									minLength={sFeedCreate.properties.name.minLength}
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
						label={translator.text("Feed name (required)")}
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
								name,
							},
						},
						{
							onSettled,
						},
					);
				}}
				loading={patchMutation.isPending}
				disabled={invalid}
			/>
		</Container>
	);
};
