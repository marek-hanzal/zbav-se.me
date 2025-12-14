import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { sListingCreate, type tDraft } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";

export namespace TitlePatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSave(title: string): void;
		loading: boolean;
	}
}

export const TitlePatch: FC<TitlePatch.Props> = ({
	draft,
	onCancel,
	onSave,
	loading,
	...props
}) => {
	const [title, setTitle] = useState(draft.title ?? "");

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.title]"}
			textTitle={"Listing title (title)"}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					inner: "default",
				}}
			>
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						textTitle={"Listing title (title)"}
						action={
							<FormField full>
								{(props) => (
									<TextInput
										value={title}
										onChange={(e) => {
											setTitle(e.target.value);
										}}
										placeholder={"Listing title (placeholder)"}
										autoFocus
										minLength={sListingCreate.properties.title.minLength}
										maxLength={sListingCreate.properties.title.maxLength}
										{...props}
									/>
								)}
							</FormField>
						}
					>
						<Mx
							label={"Listing title (required)"}
							ui={{
								tone: "secondary",
								theme: "light",
							}}
						/>
					</Status>
				</Container>

				<SaveControl
					onCancel={onCancel}
					onSave={() => {
						onSave(title);
					}}
					loading={loading}
				/>
			</Container>
		</TitleContainer>
	);
};
