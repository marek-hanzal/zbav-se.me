import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import { Sheet } from "@zbav-se.me/ui/sheet";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import type { FC } from "react";

export const FeaturesSheet: FC = () => {
	return (
		<Sheet>
			<Status
				textTitle={"Landing - Feature overview (title)"}
				tone="secondary"
				tweak={{
					slot: {
						root: {
							class: [
								"reveal",
							],
						},
					},
				}}
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
		</Sheet>
	);
};
