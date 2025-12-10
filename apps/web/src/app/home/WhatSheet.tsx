import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { BuyerIcon, CheckIcon, SellerIcon } from "@zbav-se.me/ui/icon";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import type { FC } from "react";

export const WhatSheet: FC = () => {
	return (
		<Container
			className={[
				"reveal",
			]}
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
		>
			<div className="flex flex-col justify-evenly h-dvh py-16">
				<Status
					icon={SellerIcon}
					textTitle={"What - sellers (title)"}
					ui={{
						tone: "primary",
						theme: "light",
					}}
				>
					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "primary",
							theme: "light",
						}}
					>
						<div className="flex flex-col gap-1">
							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - sellers (badge 1)"}
									ui={{
										display: "block",
										font: "bold",
									}}
								/>
							</TypoIcon>

							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - sellers (badge 2)"}
									ui={{
										display: "block",
										font: "bold",
									}}
								/>
							</TypoIcon>

							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - sellers (badge 3)"}
									ui={{
										display: "block",
										font: "bold",
									}}
								/>
							</TypoIcon>
						</div>
					</VariantProvider>
				</Status>

				<Status
					icon={BuyerIcon}
					textTitle={"What - buyers (title)"}
					ui={{
						tone: "secondary",
						theme: "light",
					}}
				>
					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
							theme: "light",
						}}
					>
						<div className="flex flex-col gap-1">
							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - buyers (badge 1)"}
									ui={{
										display: "block",
										font: "bold",
									}}
								/>
							</TypoIcon>

							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - buyers (badge 2)"}
									ui={{
										display: "block",
										font: "bold",
									}}
								/>
							</TypoIcon>

							<TypoIcon
								icon={CheckIcon}
								justify="start"
							>
								<Tx
									label={"What - buyers (badge 3)"}
									ui={{
										display: "block",
										font: "bold",
									}}
								/>
							</TypoIcon>
						</div>
					</VariantProvider>
				</Status>
			</div>
		</Container>
	);
};
