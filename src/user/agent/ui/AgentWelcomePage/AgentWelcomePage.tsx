import { useEffect, useRef } from "react";
import { Container } from "@/lib/client/container";
import { AiIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { useArrowNavigation } from "@/lib/client/nav";
import { Status } from "@/lib/client/status";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { withAgentThreadQuery } from "../../query/withAgentThreadQuery";
import { ContinueSessionButton } from "../Agent/ContinueSessionButton";
import { CreateSessionButton } from "../Agent/CreateSessionButton";

export namespace AgentWelcomePage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const AgentWelcomePage = ({ ...props }: AgentWelcomePage.Props) => {
	const locale = useLocale();
	const { data: threadCount } = withAgentThreadQuery.useCountQuery({});

	const continueRef = useRef<HTMLAnchorElement>(null);
	const createSessionRef = useRef<HTMLButtonElement>(null);

	useArrowNavigation({
		ref: continueRef,
	});
	useArrowNavigation({
		ref: createSessionRef,
	});

	useEffect(() => {
		if (continueRef.current) {
			continueRef.current.focus();
			return;
		}

		createSessionRef.current?.focus();
	}, []);

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
					action={
						<Container
							data-ui="AgentWelcomePage-[Action]"
							data-ui-flow="horizontal"
							data-ui-gap="md"
							data-ui-justify="center"
							className={[
								"flex-wrap",
							]}
						>
							{threadCount > 0 ? (
								<ContinueSessionButton
									id={"continue-session-button"}
									ref={continueRef}
									data-ui-width={"full"}
									data-ui-justify={"center"}
									data-ui-items={"center"}
									data-arrow-down={"create-session-button"}
								/>
							) : null}
							<CreateSessionButton
								id={"create-session-button"}
								ref={createSessionRef}
								data-ui-width={"full"}
								data-ui-justify={"center"}
								data-ui-items={"center"}
								data-arrow-up={"continue-session-button"}
							/>
						</Container>
					}
				/>
			</Container>
		</TitleContainer>
	);
};
