import { EditIcon, Icon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LocationBadgeValue, LocationSelection } from "@zbav-se.me/common/location";
import type { tFeed, tFeedPatch } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { type FC, useState } from "react";

export namespace FeedLocationBadge {
	export interface Props {
		locale: string;
		feed: tFeed;
	}
}

export const FeedLocationBadge: FC<FeedLocationBadge.Props> = ({ locale, feed }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [change, setChange] = useState(false);

	const [patch, setPatch] = useState<tFeedPatch>(feed);

	const feedPatchMutation = withFeedPatchMutation.useMutation({
		onSettled() {
			setChange(false);
			setIsEdit(false);
		},
	});

	return (
		<>
			<LocationBadgeValue
				locationId={patch.locationId}
				textLabel={"Feed location (label)"}
				textValue={"Feed location not selected"}
				action={
					<Icon
						icon={EditIcon}
						size={"sm"}
					/>
				}
				onClick={() => setIsEdit(true)}
			/>

			<BottomSheet
				isOpen={isEdit}
				onClose={() => setIsEdit(false)}
				detent={"full"}
				contentProps={{
					disableScroll: true,
				}}
				header={{
					close: true,
					title: "Feed location (title)",
				}}
			>
				<Container
					layout={"vertical-content-footer"}
					gap={"md"}
					height={"fit"}
					tone={"unset"}
					theme={"unset"}
					square={"md"}
				>
					<LocationSelection
						locale={locale}
						value={patch.locationId}
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
								...prev,
								query: {
									...prev.query,
									meta: {
										latLon: {
											lon,
											lat,
										},
									},
								},
							}));
						}}
						textHint={"Feed - location security (hint)"}
					/>

					<Button
						tone={"secondary"}
						theme={"dark"}
						label={"Feed - save (button)"}
						size={"lg"}
						loading={feedPatchMutation.isPending}
						disabled={!change || feedPatchMutation.isPending}
						full
						onClick={() => {
							feedPatchMutation.mutate(patch);
						}}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
