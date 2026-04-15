import { useMemo } from "react";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Typo } from "@/lib/client/typo";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { withAgentUsageQuery } from "~/user/agent/query/withAgentUsageQuery";

export namespace TokenUsage {
	export interface Props extends Container.Props {
		//
	}
}

export const TokenUsage = withFallback<TokenUsage.Props, Container>(
	(props) => {
		const locale = useLocale();
		const query = withAgentUsageQuery.useSuspenseQuery({});
		const tokens = useMemo(() => {
			const input = query.data.reduce((acc, item) => {
				return acc + item.input;
			}, 0);
			const output = query.data.reduce((acc, item) => {
				return acc + item.output;
			}, 0);

			return {
				input,
				output,
				total: input + output,
			} as const;
		}, [
			query.data,
		]);

		return (
			<Container
				ui={{
					flow: "horizontal",
					gap: "xs",
					items: "center",
					justify: "center",
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
