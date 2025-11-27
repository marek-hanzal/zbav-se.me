import { EditIcon, Icon } from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { OptionalId } from "@use-pico/common/type";
import type { tFeedPatch } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { type FC, useState } from "react";
import { FeedNameContainer } from "./FeedNameContainer";

export namespace FeedNameBadge {
	export interface Props extends Omit<BadgeValue.Props, "textValue"> {
		feedId?: string;
		name: string;
	}
}

export const FeedNameBadge: FC<FeedNameBadge.Props> = ({ feedId, name, ...props }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [change, setChange] = useState(false);

	const [patch, setPatch] = useState<OptionalId<tFeedPatch>>({
		name,
	});

	const feedPatchMutation = withFeedPatchMutation.useMutation({
		onSettled() {
			setChange(false);
			setIsEdit(false);
		},
	});

	return (
		<>
			<BadgeValue
				textLabel={"Feed name (label)"}
				textValue={name}
				action={
					<Icon
						icon={EditIcon}
						size={"sm"}
					/>
				}
				onClick={() => setIsEdit(true)}
				{...props}
			/>

			<BottomSheet
				isOpen={isEdit}
				onClose={() => setIsEdit(false)}
				detent={"full"}
			>
				<Container
					layout={"vertical-content-footer"}
					gap={"md"}
					height={"fit"}
					tone={"unset"}
					theme={"unset"}
					square={"md"}
				>
					<FeedNameContainer
						height={"fit"}
						value={patch.name ?? ""}
						onChange={(value) => {
							setChange(true);
							setPatch({
								id: feedId,
								name: value,
							});
						}}
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
							if (!change || !feedId) {
								return;
							}

							feedPatchMutation.mutate(
								{
									id: feedId,
									...patch,
								},
								{
									onSuccess() {
										setIsEdit(false);
									},
								},
							);
						}}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
