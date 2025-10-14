import { Status, Tx } from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { BuyerIcon } from "~/app/ui/icon/BuyerIcon";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { SellerIcon } from "~/app/ui/icon/SellerIcon";
import { ThemeCls } from "~/app/ui/ThemeCls";
import { TypoIcon } from "~/app/ui/text/TypoIcon";

export const WhatSheet: FC = () => {
	return (
		<Sheet tone="secondary">
			<div className="flex flex-col justify-evenly h-[100dvh] py-16">
				<Status
					icon={SellerIcon}
					tone={"primary"}
					textTitle={<Tx label={"What - sellers (title)"} />}
					textMessage={
						<VariantProvider
							cls={ThemeCls}
							variant={{
								tone: "primary",
								theme: "light",
							}}
						>
							<div className="flex flex-col gap-1">
								<TypoIcon icon={CheckIcon}>
									<Tx
										label={"What - sellers (badge 1)"}
										display={"block"}
										font={"bold"}
									/>
								</TypoIcon>

								<TypoIcon icon={CheckIcon}>
									<Tx
										label={"What - sellers (badge 2)"}
										display={"block"}
										font={"bold"}
									/>
								</TypoIcon>

								<TypoIcon icon={CheckIcon}>
									<Tx
										label={"What - sellers (badge 3)"}
										display={"block"}
										font={"bold"}
									/>
								</TypoIcon>
							</div>
						</VariantProvider>
					}
				/>

				<Status
					icon={BuyerIcon}
					tone={"secondary"}
					theme={"light"}
					textTitle={<Tx label={"What - buyers (title)"} />}
					textMessage={
						<VariantProvider
							cls={ThemeCls}
							variant={{
								tone: "secondary",
								theme: "light",
							}}
						>
							<div className="flex flex-col gap-1">
								<TypoIcon icon={CheckIcon}>
									<Tx
										label={"What - buyers (badge 1)"}
										display={"block"}
										font={"bold"}
									/>
								</TypoIcon>

								<TypoIcon icon={CheckIcon}>
									<Tx
										label={"What - buyers (badge 2)"}
										display={"block"}
										font={"bold"}
									/>
								</TypoIcon>

								<TypoIcon icon={CheckIcon}>
									<Tx
										label={"What - buyers (badge 3)"}
										display={"block"}
										font={"bold"}
									/>
								</TypoIcon>
							</div>
						</VariantProvider>
					}
				/>
			</div>
		</Sheet>
	);
};
