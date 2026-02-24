import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { FirstIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace FirstListingStatus {
	export interface Props extends Container.Props {
		//
	}
}

export const FirstListingStatus: FC<FirstListingStatus.Props> = (props) => {
	const locale = useLocale();

	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
				tone: "brand",
				theme: "light",
				inner: "4xl",
			}}
			{...props}
		>
			<Status
				icon={FirstIcon}
				iconProps={{
					ui: {
						text: "4xl",
					},
				}}
				textTitle={translator.text("First listing (title)")}
				textMessage={translator.text("First listing (message)")}
				messageProps={{
					className: "text-center",
				}}
				action={
					<>
						<LinkTo
							icon={ChevronRightIcon}
							iconPosition={"right"}
							to={"/$locale/flow/seller/draft/resolve"}
							params={{
								locale,
							}}
							{...uiButton({
								ui: {
									tone: "brand",
									theme: "light",
									text: "lg",
									size: "default",
									font: "bold",
								},
								className: [],
							})}
						>
							<Tx label={translator.text("Create first listing (button)")} />
						</LinkTo>

						<LinkTo
							icon={ChevronRightIcon}
							iconPosition={"right"}
							to={"/$locale/flow/home"}
							params={{
								locale,
							}}
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									text: "sm",
									size: "sm",
									background: undefined,
									border: false,
									shadow: false,
								},
								className: [],
							})}
						>
							<Tx label={translator.text("Back to home (link)")} />
						</LinkTo>
					</>
				}
			/>
		</Container>
	);
};
