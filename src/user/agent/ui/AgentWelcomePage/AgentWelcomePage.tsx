import { Container } from "@/lib/client/container";
import { AiIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { CreateSessionButton } from "../Agent/CreateSessionButton";

export namespace AgentWelcomePage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const AgentWelcomePage = ({ ...props }: AgentWelcomePage.Props) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui={"AgentWelcomePage"}
			textTitle={translator.text("Agent (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<Container
				data-ui-tone="brand"
				data-ui-theme="light"
				data-ui-layout="vertical-centered"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="4xl"
				data-ui-gap="default"
				className={[
					"text-center",
				]}
			>
				<Status
					icon={AiIcon}
					textTitle={translator.text("Agent welcome (title)")}
					textMessage={translator.text("Agent welcome (message)")}
					action={<CreateSessionButton />}
				/>
			</Container>
		</TitleContainer>
	);
};
