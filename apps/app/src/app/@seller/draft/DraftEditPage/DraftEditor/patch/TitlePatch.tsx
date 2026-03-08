import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller";
import { sListingCreate } from "@zbav-se.me/sdk/api/seller";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { EditAction } from "../EditAction";

export namespace TitlePatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const TitlePatch: FC<TitlePatch.Props> = ({ draft, onCancel, onSettled, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSettled,
		invalidate: [
			"collection",
		],
	});
	const [title, setTitle] = useState(draft.title ?? "");

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.title]"}
			textTitle={translator.text("Listing title (title)")}
			left={<EditAction />}
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
				<Status
					action={
						<FormField>
							{(fieldProps) => (
								<TextInput
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder={translator.text("Listing title (placeholder)")}
									autoFocus
									minLength={sListingCreate.properties.title.minLength}
									maxLength={sListingCreate.properties.title.maxLength}
									{...fieldProps}
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

				<SaveContainer
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
					textSave={<Tx label={"Continue (label)"} />}
					textCancel={<Tx label={"Back (label)"} />}
					saveProps={{
						iconEnabled: ArrowRightIcon,
						iconPosition: "right",
					}}
				/>
			</Container>
		</TitleContainer>
	);
};
