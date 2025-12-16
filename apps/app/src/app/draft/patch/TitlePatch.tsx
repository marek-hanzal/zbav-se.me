import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { sListingCreate, type tDraft } from "@zbav-se.me/sdk/api/user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";

export namespace TitlePatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const TitlePatch: FC<TitlePatch.Props> = ({ draft, onCancel, onSettled, ...props }) => {
	const patch = withDraftFetchQuery.useSet();
	const [title, setTitle] = useState(draft.title ?? "");

	const mutation = withDraftPatchMutation.useMutation({
		onSuccess(draft) {
			patch(() => draft, {
				where: {
					id: draft.id,
				},
			});
		},
		onSettled() {
			onSettled?.();
		},
	});

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
							<FormField>
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
						mutation.mutate({
							patch: {
								title,
							},
							query: {
								where: {
									id: draft.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={!title}
				/>
			</Container>
		</TitleContainer>
	);
};
