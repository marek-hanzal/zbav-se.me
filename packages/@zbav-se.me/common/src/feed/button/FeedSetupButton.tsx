import { SettingsIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { type FC, useEffect, useState } from "react";
import { FeedDetailContainer } from "../FeedDetailContainer";

export namespace FeedSetupButton {
	export interface Props extends Button.Props {
		locale: string;
		feed: tFeed;
		defaultOpen: boolean;
		noDelete: boolean | undefined;
	}
}

export const FeedSetupButton: FC<FeedSetupButton.Props> = ({
	locale,
	feed,
	defaultOpen,
	noDelete,
	children,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setIsOpen(defaultOpen);
		}, 100);
	}, [
		defaultOpen,
	]);

	return (
		<>
			<Button
				iconEnabled={SettingsIcon}
				tone={"primary"}
				theme={"light"}
				size={"xl"}
				label={"Feed setup (button)"}
				onClick={() => setIsOpen((prev) => !prev)}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"full"}
				header={{
					close: true,
					title: feed.name,
				}}
			>
				<FeedDetailContainer
					locale={locale}
					feed={feed}
					noDelete={noDelete}
				>
					{children}
				</FeedDetailContainer>
			</BottomSheet>
		</>
	);
};
