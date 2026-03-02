import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { LocationSelect } from "~/app/@common/location/ui/LocationSelect";
import { EditAction } from "../EditAction";

export namespace LocationPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({
	draft,
	onCancel,
	onSettled,
	...props
}) => {
	const [locationId, setLocationId] = useState<string | undefined | null>(draft.locationId);
	const [location, setLocation] = useState<tLocation | undefined>(undefined);
	const mutation = withDraftQuery.usePatchMutation({
		onSettled,
		invalidate: [
			"collection",
		],
	});

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.location]"}
			textTitle={translator.text("Location (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					inner: "default",
					gap: "default",
				}}
			>
				<LocationSelect
					textHint={translator.text("Location security (hint)")}
					onLocation={setLocation}
					onChange={setLocationId}
					value={locationId}
				/>

				<SaveContainer
					onCancel={onCancel}
					onSave={() => {
						if (!locationId || !location) {
							return;
						}

						mutation.mutate({
							patch: {
								locationId,
							},
							query: {
								where: {
									id: draft.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={!locationId || !location}
					textCancel={<Tx label={"Back (label)"} />}
				/>
			</Container>
		</TitleContainer>
	);
};
