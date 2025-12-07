import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { CartIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace EmptyStatus {
	export interface Props extends Status.Props {
		locale: string;
	}
}

export const EmptyStatus: FC<EmptyStatus.Props> = ({ locale, ...props }) => {
	return (
		<Container
			ui={"EmptyStatus-root"}
			layout={"vertical-centered"}
		>
			<Status
				icon={CartIcon}
				textTitle={"No items in cart (title)"}
				action={
					<>
						<LinkTo
							to={"/$locale/buyer/feed/default"}
							params={{
								locale,
							}}
							full
						>
							<Button
								iconEnabled={ArrowRightIcon}
								iconPosition={"right"}
								tone={"primary"}
								theme={"light"}
								size={"xl"}
								label={"Go to listings (button)"}
								menu
								tweak={{
									slot: {
										root: {
											class: [
												"justify-between",
											],
										},
									},
								}}
							/>
						</LinkTo>

						<LinkTo
							to={"/$locale/buyer/feed/select"}
							params={{
								locale,
							}}
							full
						>
							<Button
								iconEnabled={ArrowRightIcon}
								iconPosition={"right"}
								tone={"primary"}
								theme={"light"}
								size={"xl"}
								label={"Go home (button)"}
								menu
								tweak={{
									slot: {
										root: {
											class: [
												"justify-between",
											],
										},
									},
								}}
							/>
						</LinkTo>
					</>
				}
				tweak={{
					slot: {
						action: {
							class: [
								"flex",
								"flex-col",
								"gap-2",
							],
						},
					},
				}}
				{...props}
			/>
		</Container>
	);
};
