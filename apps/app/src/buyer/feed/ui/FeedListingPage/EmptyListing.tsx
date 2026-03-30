import { LinkTo } from "@/lib/client/link-to";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { uiButton } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import { FirstIcon } from "~/common/ui/icon";

export namespace EmptyListing {
	export interface Props extends Container.Props {
		//
	}
}

export const EmptyListing: FC<EmptyListing.Props> = (props) => {
	const locale = useLocale();

	return (
		<Container
			data-ui={"EmptyListing"}
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
							data-action={"create first listing"}
							icon={ChevronRightIcon}
							iconPosition={"right"}
							to={"/$locale/app/seller/draft/resolve"}
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
							<Tx label="Create first listing (button)" />
						</LinkTo>

						<LinkTo
							data-action={"go home"}
							icon={ChevronRightIcon}
							iconPosition={"right"}
							to={"/$locale/app/home"}
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
							<Tx label="Back to home (link)" />
						</LinkTo>
					</>
				}
			/>
		</Container>
	);
};
