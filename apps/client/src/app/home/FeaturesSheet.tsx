import { Status, Tx } from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { ThemeCls } from "~/app/ui/ThemeCls";
import { TypoIcon } from "~/app/ui/text/TypoIcon";

export const FeaturesSheet: FC = () => {
	return (
		<Sheet>
			<Status
				icon={"icon-[mingcute--celebrate-line]"}
				textTitle={<Tx label={"Landing - Feature overview (title)"} />}
				tone="secondary"
				tweak={{
					slot: {
						body: {
							class: [
								"flex",
								"flex-col",
								"gap-2",
								"px-4",
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
					<TypoIcon icon={CheckIcon}>
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
					<TypoIcon icon={CheckIcon}>
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
					<TypoIcon icon={CheckIcon}>
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
					<TypoIcon icon={CheckIcon}>
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
					<TypoIcon icon={CheckIcon}>
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
