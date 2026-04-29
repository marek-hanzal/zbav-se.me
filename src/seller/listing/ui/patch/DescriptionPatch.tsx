import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { FormField, uiInput } from "@/lib/client/form";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Mx } from "@/lib/client/mx";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { withListingQuery } from "../../query/withListingQuery";
import type { ListingSchema } from "../../server/schema/ListingSchema";

const DESCRIPTION_MAX_LENGTH = 2048;

export namespace DescriptionPatch {
	export interface Props extends TitleContainer.Props {
		listing: ListingSchema.Type;
		onCancel(): void;
		setView(view: "pros"): void;
	}
}

export const DescriptionPatch: FC<DescriptionPatch.Props> = ({
	listing,
	onCancel,
	setView,
	...props
}) => {
	const [description, setDescription] = useState(listing.description ?? "");
	const mutation = withListingQuery.usePatchMutation({
		onSuccess() {
			setView("pros");
		},
		invalidate: [
			"collection",
		],
	});

	return (
		<TitleContainer
			data-ui={"DescriptionPatch"}
			textTitle={translator.text("Description (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
			>
				<Status
					action={
						<FormField>
							{({ className, ...props }) => (
								<textarea
									value={description}
									onChange={(e) => {
										setDescription(e.target.value);
									}}
									placeholder={translator.text("Description (placeholder)")}
									maxLength={DESCRIPTION_MAX_LENGTH}
									rows={10}
									{...uiInput({
										className: [
											"resize-none",
											"outline-none",
											"min-h-0",
											className,
										],
									})}
									{...props}
								/>
							)}
						</FormField>
					}
				>
					<Mx
						label={"Listing description (hint)"}
						data-ui-tone="secondary"
						data-ui-theme="light"
					/>
				</Status>

				<SaveContainer
					onCancel={onCancel}
					onSave={() => {
						mutation.mutate({
							patch: {
								description,
							},
							query: {
								where: {
									id: listing.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={false}
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
