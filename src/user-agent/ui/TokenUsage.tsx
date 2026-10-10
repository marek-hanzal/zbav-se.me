import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumberFn } from "~/number/fn/toLocaleNumberFn";
import { Tx } from "~/translation/ui/Tx";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import { Container } from "~/ui/ui/Container";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Typo } from "~/ui/ui/Typo";
import { withAgentTokensQuery } from "~/user-agent/query/withAgentTokensQuery";

export namespace TokenUsage {
	export interface Props extends Container.Props {
		threadId?: string;
	}
}

export const TokenUsage = withFallbackFn<TokenUsage.Props, Container>(
	({ threadId, ...props }) => {
		const locale = useLocale();
		const { data: tokens } = withAgentTokensQuery.useSuspenseQuery({
			where: {
				threadId,
			},
		});

		return (
			<Container
				data-ui={"TokenUsage"}
				data-ui-flow="horizontal"
				data-ui-gap="xs"
				data-ui-items="center"
				data-ui-justify="center"
				data-ui-text={"xs"}
				{...props}
			>
				{tokens.total > 0 ? (
					<>
						<Typo
							label={toLocaleNumberFn({
								locale,
								number: tokens.input,
							})}
							data-ui-font="bold"
						/>
						<Typo
							label={"/"}
							data-ui-opacity="4"
						/>
						<Typo
							label={toLocaleNumberFn({
								locale,
								number: tokens.output,
							})}
						/>
					</>
				) : (
					<Tx label={"No tokens used yet (label)"} />
				)}
			</Container>
		);
	},
	(props) => {
		return (
			<Container {...props}>
				<SpinnerContainer type={"icon"} />
			</Container>
		);
	},
);
