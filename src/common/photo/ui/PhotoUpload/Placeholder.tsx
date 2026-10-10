import type { FC } from "react";
import { PhotoIcon } from "~/common/ui/icon";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Container } from "~/ui/ui/Container";
import { Status } from "~/ui/ui/Status";

export namespace Placeholder {
	export interface Props {
		disabled?: boolean;
	}
}

export const Placeholder: FC<Placeholder.Props> = ({ disabled }) => {
	const translator = useTranslator();
	return (
		<Container
			data-ui={"PhotoUpload-[Container.placeholder]"}
			data-ui-flow="vertical"
			data-ui-height="full"
			data-ui-items="center"
			data-ui-justify="center"
			data-ui-round="default"
		>
			<Status
				data-ui={"PhotoUpload-[Status.placeholder]"}
				icon={PhotoIcon}
				textTitle={translator.text("Photo upload placeholder (title)")}
				textMessage={translator.text("Photo upload placeholder (message)")}
				data-ui-tone={disabled ? "neutral" : "primary"}
				data-ui-theme="light"
				data-ui-inner="4xl"
				className={"text-center"}
			/>
		</Container>
	);
};
