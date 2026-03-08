import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { LocationSelect } from "~/app/@common/location/ui/LocationSelect";
import type { Data } from "../Data";
import { EditAction } from "../EditAction";

export namespace LocationPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onView(view: Data.View): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const [locationId, setLocationId] = useState<string | undefined | null>(draft.locationId);
	const [location, setLocation] = useState<tLocation | undefined>(undefined);
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("price");
		},
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
