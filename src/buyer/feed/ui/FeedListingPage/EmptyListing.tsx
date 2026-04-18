import type { FC } from "react";
import { uiButton } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
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
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			data-ui-tone="brand"
			data-ui-theme="light"
			data-ui-inner="4xl"
			{...props}
		>
			<Status
				icon={FirstIcon}
				iconProps={{
					"data-ui-text": "4xl",
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
								"data-ui-tone": "brand",
								"data-ui-theme": "light",
								"data-ui-text": "lg",
								"data-ui-size": "default",
								"data-ui-font": "bold",
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
								"data-ui-tone": "link",
								"data-ui-theme": "light",
								"data-ui-text": "sm",
								"data-ui-size": "sm",
								"data-ui-background": undefined,
								"data-ui-border": false,
								"data-ui-shadow": false,
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
