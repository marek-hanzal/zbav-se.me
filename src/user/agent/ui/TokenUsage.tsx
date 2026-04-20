import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Typo } from "@/lib/client/typo";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { withAgentTokensQuery } from "~/user/agent/query/withAgentTokensQuery";

export namespace TokenUsage {
	export interface Props extends Container.Props {
		//
	}
}

export const TokenUsage = withFallback<TokenUsage.Props, Container>(
	({ ...props }) => {
		const locale = useLocale();
		const { data: tokens } = withAgentTokensQuery.useSuspenseQuery({});

		return (
			<Container
				data-ui-flow="horizontal"
				data-ui-gap="xs"
				data-ui-items="center"
				data-ui-justify="center"
				data-ui-text={"xs"}
				{...props}
			>
				<Typo
					label={toLocaleNumber({
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
					label={toLocaleNumber({
						locale,
						number: tokens.output,
					})}
				/>
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
