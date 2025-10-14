import { useParams } from "@tanstack/react-router";
import { Button, LinkTo, Status, Tx, UserIcon } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { UnlockIcon } from "~/app/ui/icon/UnlockIcon";
import { Logo } from "~/app/ui/Logo";

export const HeroSheet: FC = () => {
	const { locale } = useParams({
		from: "/$locale",
	});

	return (
		<Sheet>
			<div
				className={tvc([
					"reveal",
					"flex",
					"flex-col",
					"justify-evenly",
					"h-[100dvh]",
					"py-16",
					"px-4",
					"opacity-0",
				])}
			>
				<div className="flex justify-center">
					<Logo />
				</div>

				<Status
					textTitle={<Tx label={"Landing - Hero (title)"} />}
					textMessage={<Tx label={"Landing - Hero (subtitle)"} />}
					tweak={{
						slot: {
							body: {
								class: [
									"w-full",
									"max-w-screen-md",
									"text-center",
									"mx-auto",
									"px-4",
								],
							},
						},
					}}
				/>

				<div
					className={tvc([
						"flex",
						"flex-col",
						"gap-2",
						"items-center",
						"justify-center",
						"w-full",
						"mt-2",
						"px-12",
					])}
				>
					<Button
						iconEnabled={UnlockIcon}
						iconProps={{
							size: "sm",
						}}
						tone={"secondary"}
						theme={"dark"}
						tweak={{
							slot: {
								wrapper: {
									class: [
										"w-full",
									],
								},
								root: {
									class: [
										"w-full",
									],
								},
							},
						}}
						size={"xl"}
					>
						<LinkTo
							to={"/$locale/login"}
							params={{
								locale,
							}}
						>
							<Tx label={"Login (hero)"} />
						</LinkTo>
					</Button>

					<Button
						iconEnabled={UserIcon}
						iconProps={{
							size: "sm",
						}}
						tone={"primary"}
						theme={"dark"}
						tweak={{
							slot: {
								wrapper: {
									class: [
										"w-full",
									],
								},
								root: {
									class: [
										"w-full",
									],
								},
							},
						}}
						size={"xl"}
					>
						<LinkTo
							to={"/$locale/register"}
							params={{
								locale,
							}}
						>
							<Tx label={"Register (hero)"} />
						</LinkTo>
					</Button>
				</div>
			</div>
		</Sheet>
	);
};
