import type { FC } from "react";
import { ViteEnvSchema } from "~/application-env/schema/ViteEnvSchema";
import { CopyIconAction } from "~/clipboard/ui/CopyIconAction";
import { useTranslator } from "~/translation/hook/useTranslator";
import { uiLinkTo } from "~/ui/fn/uiLinkTo";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { Markdown } from "~/ui/ui/Markdown";

export namespace MessageTextContent {
	export interface Props extends Group.Props {
		groupId?: string;
		text: string;
	}
}

export const MessageTextContent: FC<MessageTextContent.Props> = ({ groupId, text, ...props }) => {
	const translator = useTranslator();
	const value = text.trim();
	if (!value.length) {
		return null;
	}

	const { VITE_CONTENT_CDN } = ViteEnvSchema.parse(import.meta.env);

	if (value.startsWith(VITE_CONTENT_CDN)) {
		return (
			<Container
				data-ui-flow={"horizontal"}
				data-ui-items={"center"}
				data-ui-justify={"space-between"}
				data-ui-width={"full"}
				data-ui-inner={"default"}
			>
				<a
					href={value}
					target={"_blank"}
					rel="noopener"
					{...uiLinkTo({
						"data-ui-font": "light",
						"data-ui-text": "xs",
					})}
				>
					{translator.text("Embedded image - url (label)")}
				</a>

				<CopyIconAction
					text={value}
					data-ui-text={"sm"}
				/>
			</Container>
		);
	}

	return (
		<Group
			data-ui={"MessageTextContent"}
			data-id={groupId}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-background="alt"
			data-ui-inner="default"
			{...props}
		>
			<Markdown>{value}</Markdown>
		</Group>
	);
};
