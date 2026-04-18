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
				ui={{
					flow: "horizontal",
					gap: "xs",
					items: "center",
					justify: "center",
					...ui,
				}}
				{...props}
			>
				<Typo
					label={toLocaleNumber({
						locale,
						number: tokens.input,
					})}
					ui={{
						font: "bold",
					}}
				/>
				<Typo
					label={"/"}
					ui={{
						opacity: "4",
					}}
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
