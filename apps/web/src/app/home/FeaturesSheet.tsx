import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import type { FC } from "react";

export const FeaturesSheet: FC = () => {
	return (
		<Container
			layout={"vertical-centered"}
			className={[
				"reveal",
			]}
		>
			<Status
				textTitle={"Landing - Feature overview (title)"}
				tone="secondary"
			>
				<VariantProvider
					cls={ThemeCls}
					variant={{
						tone: "secondary",
						theme: "light",
					}}
				>
					<TypoIcon
						icon={CheckIcon}
						justify="start"
						items="start"
					>
						<Tx
							label={"Landing - Feature 1 (title)"}
							display={"block"}
							font={"bold"}
						/>
						<Tx
							label={"Landing - Feature 1 (title) - hint"}
							display={"block"}
							size={"sm"}
						/>
					</TypoIcon>
					<TypoIcon
						icon={CheckIcon}
						justify="start"
						items="start"
					>
						<Tx
							label={"Landing - Feature 2 (title)"}
							display={"block"}
							font={"bold"}
						/>
						<Tx
							label={"Landing - Feature 2 (title) - hint"}
							display={"block"}
							size={"sm"}
						/>
					</TypoIcon>
					<TypoIcon
						icon={CheckIcon}
						justify="start"
						items="start"
					>
						<Tx
							label={"Landing - Feature 3 (title)"}
							display={"block"}
							font={"bold"}
						/>
						<Tx
							label={"Landing - Feature 3 (title) - hint"}
							display={"block"}
							size={"sm"}
						/>
					</TypoIcon>
					<TypoIcon
						icon={CheckIcon}
						justify="start"
						items="start"
					>
						<Tx
							label={"Landing - Feature 4 (title)"}
							display={"block"}
							font={"bold"}
						/>
						<Tx
							label={"Landing - Feature 4 (title) - hint"}
							display={"block"}
							size={"sm"}
						/>
					</TypoIcon>
					<TypoIcon
						icon={CheckIcon}
						justify="start"
						items="start"
					>
						<Tx
							label={"Landing - Feature 5 (title)"}
							display={"block"}
							font={"bold"}
						/>
						<Tx
							label={"Landing - Feature 5 (title) - hint"}
							display={"block"}
							size={"sm"}
						/>
					</TypoIcon>
				</VariantProvider>
			</Status>
		</Container>
	);
};
