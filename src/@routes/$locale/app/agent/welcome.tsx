import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { handleArrowNavFn } from "~/navigation/fn/handleArrowNavFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import { AiIcon } from "~/ui/constant/AiIcon";
import { Container } from "~/ui/ui/Container";
import { Status } from "~/ui/ui/Status";
import { withAgentThreadQuery } from "~/user-agent/query/withAgentThreadQuery";
import { ContinueSessionButton } from "~/user-agent/ui/Agent/ContinueSessionButton";
import { CreateSessionButton } from "~/user-agent/ui/Agent/CreateSessionButton";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/agent/welcome")({
	component() {
		const translator = useTranslator();
		const locale = useLocale();
		const { data: threadCount } = withAgentThreadQuery.useCountQuery({});

		const continueRef = useRef<HTMLAnchorElement>(null);
		const createSessionRef = useRef<HTMLButtonElement>(null);

		useEffect(() => {
			if (continueRef.current) {
				continueRef.current.focus();
				return;
			}

			createSessionRef.current?.focus();
		}, []);

		return (
			<TitleContainer
				data-ui={"AgentWelcome[TitleContainer]"}
				textTitle={translator.textFn("Agent (title)")}
				left={
					<BackHomeButton
						id={"back-link"}
						to="/$locale/app/home"
						params={{
							locale,
						}}
						//
						data-arrow-right={"home-link"}
						data-arrow-down={"continue-session-button"}
						onKeyDown={handleArrowNavFn}
					/>
				}
				right={
					<HomeMenuButton
						id={"home-link"}
						//
						data-arrow-left={"back-link"}
						data-arrow-down={"continue-session-button"}
						onKeyDown={handleArrowNavFn}
					/>
				}
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
						textTitle={translator.textFn("Agent welcome (title)")}
						textMessage={translator.textFn("Agent welcome (message)")}
						action={
							<Container
								data-ui="AgentWelcome-[Action]"
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
										//
										data-arrow-up={"back-link"}
										data-arrow-left={"back-link"}
										data-arrow-right={"home-link"}
										data-arrow-down={"create-session-button"}
										onKeyDown={handleArrowNavFn}
									/>
								) : null}
								<CreateSessionButton
									id={"create-session-button"}
									ref={createSessionRef}
									data-ui-width={"full"}
									data-ui-justify={"center"}
									data-ui-items={"center"}
									//
									data-arrow-left={"back-link"}
									data-arrow-right={"home-link"}
									data-arrow-up={"continue-session-button"}
									onKeyDown={handleArrowNavFn}
								/>
							</Container>
						}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
