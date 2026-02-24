import { ChevronLeftIcon, ChevronRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { DeadEndIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { FeedStatusContainerUi } from "./FeedSetupButton";
import { FeedStatusAction } from "./FeedStatusAction";

export namespace FeedListStatus {
	export interface Props extends Container.Props {
		state: {
			value: boolean;
			set: (value: boolean | ((prev: boolean) => boolean)) => void;
		};
		mode: "appendix" | "empty";
	}
}

export const FeedListStatus: FC<FeedListStatus.Props> = ({ state, mode, ui, ...props }) => {
	const isAppendix = mode === "appendix";

	return (
		<Container
			ui={{
				...FeedStatusContainerUi,
				...ui,
			}}
			{...props}
		>
			<Status
				icon={DeadEndIcon}
				textTitle={
					isAppendix
						? translator.text("That's all for now (title)")
						: translator.text("No listings in feed (title)")
				}
				textMessage={
					isAppendix
						? translator.text("That's all for now (message)")
						: translator.text("No listings in feed (message)")
				}
				action={
					<FeedStatusAction
						state={state}
						backIcon={isAppendix ? ChevronRightIcon : ChevronLeftIcon}
					/>
				}
				ui={{
					tone: "brand",
					theme: "light",
					color: "lead",
					inner: "4xl",
				}}
				className={[
					"text-center",
				]}
			/>
		</Container>
	);
};
