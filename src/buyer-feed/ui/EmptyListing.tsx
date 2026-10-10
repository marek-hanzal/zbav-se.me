import type { FC } from "react";
import { FirstIcon } from "~/application-ui/constant/icon.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { uiButtonFn } from "~/ui/fn/uiButtonFn";
import { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";
import { Status } from "~/ui/ui/Status";

export namespace EmptyListing {
	export interface Props extends Container.Props {
		//
	}
}

export const EmptyListing: FC<EmptyListing.Props> = (props) => {
	const translator = useTranslator();
	const locale = useLocale();

	return (
		<Container
			data-ui={"EmptyListing[Container]"}
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
				textTitle={translator.textFn("First listing (title)")}
				textMessage={translator.textFn("First listing (message)")}
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
							{...uiButtonFn({
								"data-ui-tone": "brand",
								"data-ui-theme": "light",
								"data-ui-text": "lg",
								"data-ui-size": "default",
								"data-ui-font": "bold",
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
							{...uiButtonFn({
								"data-ui-tone": "link",
								"data-ui-theme": "light",
								"data-ui-text": "sm",
								"data-ui-size": "sm",
								"data-ui-background": undefined,
								"data-ui-border": false,
								"data-ui-shadow": false,
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
