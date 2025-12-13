import { EditIcon, Icon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed, tFeedPatch } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";
import { LocationSelection } from "~/app/location/ui/LocationSelection";
import { LocationValue as CoolLocationValue } from "~/app/location/ui/LocationValue";

export namespace LocationValue {
	export interface Props {
		locale: string;
		feed: tFeed;
	}
}

export const LocationValue: FC<LocationValue.Props> = ({ locale, feed }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [change, setChange] = useState(false);

	const [patch, setPatch] = useState<tFeedPatch>({
		patch: feed,
		query: {
			where: {
				id: feed.id,
			},
		},
	});

	const feedPatchMutation = withFeedPatchMutation.useMutation({
		onSettled() {
			setChange(false);
			setIsEdit(false);
		},
	});

	return (
		<>
			<CoolLocationValue
				data-ui={"LocationValue[LocationValue]"}
				locationId={patch.patch.locationId}
				textLabel={translator.text("Feed location (label)")}
				textValue={translator.text("Feed location not selected")}
				textHint={translator.text("Feed location (hint)")}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				onClick={() => setIsEdit(true)}
			/>

			<BottomSheet
				data-ui={"LocationValue-[BottomSheet]"}
				isOpen={isEdit}
				onClose={() => setIsEdit(false)}
				detent={"full"}
				contentProps={{
					disableScroll: true,
				}}
				header={({ close }) => ({
					title: "Feed location (title)",
					right: <CloseButton onClick={close} />,
				})}
			>
				<Container
					data-ui="FeedLocationBadge-[Container.bottom-sheet]"
					ui={{
						layout: "vertical-content-footer",
						gap: "default",
						height: "full",
					}}
				>
					<LocationSelection
						locale={locale}
						value={patch.patch.locationId}
						onChange={(value) => {
							setChange(true);
							setPatch((prev) => ({
								...prev,
								locationId: value,
							}));
						}}
						onLocation={({ lon, lat }) => {
							setChange(true);
							setPatch((prev) => ({
								patch: {
									...prev.patch,
									query: {
										...prev.patch.query,
										meta: {
											latLon: {
												lon,
												lat,
											},
										},
									},
								},
								query: {
									where: {
										id: feed.id,
									},
								},
							}));
						}}
						textHint={"Feed - location security (hint)"}
					/>

					<Button
						label={"Feed - save (button)"}
						loading={feedPatchMutation.isPending}
						disabled={!change || feedPatchMutation.isPending}
						onClick={() => {
							feedPatchMutation.mutate(patch);
						}}
						ui={{
							tone: "secondary",
							theme: "dark",
							size: "xl",
						}}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
