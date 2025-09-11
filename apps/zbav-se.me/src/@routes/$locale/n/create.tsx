import { createFileRoute } from "@tanstack/react-router";
import { Button, Status, Tx } from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { PostIcon } from "~/app/ui/icon/PostIcon";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";
import { TagIcon } from "~/app/ui/icon/TagIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Snapper } from "~/app/ui/snapper/Snapper";
import { SnapperContent } from "~/app/ui/snapper/SnapperContent";
import { SnapperItem } from "~/app/ui/snapper/SnapperItem";
import { SnapperPager } from "~/app/ui/snapper/SnapperPager";
import { Title } from "~/app/ui/title/Title";
import type { TitleCls } from "~/app/ui/title/TitleCls";

export const Route = createFileRoute("/$locale/n/create")({
	component() {
		const subtitleVariant: Cls.VariantsOf<TitleCls> = {
			tone: "secondary",
			size: "lg",
		};

		return (
			<>
				<Title icon={PostIcon}>
					<Tx
						label={"Sell (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<Snapper>
					<SnapperPager
						pages={[
							{
								id: "photos",
								icon: PhotoIcon,
							},
							{
								id: "tags",
								icon: TagIcon,
							},
							{
								id: "price",
								icon: PriceIcon,
							},
							{
								id: "submit",
								icon: SendPackageIcon,
							},
						]}
					/>

					<SnapperContent>
						<SnapperItem>
							<Title
								icon={PhotoIcon}
								{...subtitleVariant}
							>
								<Tx label={"Photos (title)"} />
							</Title>
						</SnapperItem>

						<SnapperItem>
							<Title
								icon={TagIcon}
								{...subtitleVariant}
							>
								<Tx label={"Tags (title)"} />
							</Title>
						</SnapperItem>

						<SnapperItem>
							<Title
								icon={PriceIcon}
								{...subtitleVariant}
							>
								<Tx label={"Price (title)"} />
							</Title>
						</SnapperItem>

						<SnapperItem>
							<Title
								icon={SendPackageIcon}
								{...subtitleVariant}
							>
								<Tx label={"Submit listing (title)"} />
							</Title>

							<div className="grid grid-cols-1 content-center justify-items-center flex-1">
								<Status
									icon={SendPackageIcon}
									textTitle={
										<Tx
											label={
												"Submit listing - status (title)"
											}
										/>
									}
									tone={"primary"}
								>
									<Button
										iconEnabled={
											"icon-[ph--check-fat-thin]"
										}
										tone={"primary"}
										size={"xl"}
									>
										<Tx label={"Submit listing (button)"} />
									</Button>
								</Status>
							</div>
						</SnapperItem>
					</SnapperContent>
				</Snapper>

				<Nav active="create" />
			</>
		);
	},
});
