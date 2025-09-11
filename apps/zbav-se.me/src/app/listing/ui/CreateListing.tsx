import type { Cls } from "@use-pico/cls";
import type { FC } from "react";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";
import { TagIcon } from "~/app/ui/icon/TagIcon";
import { Snapper } from "~/app/ui/snapper/Snapper";
import { SnapperContent } from "~/app/ui/snapper/SnapperContent";
import { SnapperItem } from "~/app/ui/snapper/SnapperItem";
import { SnapperNav } from "~/app/ui/snapper/SnapperNav";
import type { TitleCls } from "~/app/ui/title/TitleCls";
import { PhotosWrapper } from "./CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "./CreateListing/Price/PriceWrapper";
import { SubmitWrapper } from "./CreateListing/Submit/SubmitWrapper";
import { TagsWrapper } from "./CreateListing/Tags/TagsWrapper";

export namespace CreateListing {
	export interface Props {
		photoCountLimit: number;
	}
}

export const CreateListing: FC<CreateListing.Props> = ({ photoCountLimit }) => {
	const subtitleVariant: Cls.VariantsOf<TitleCls> = {
		tone: "secondary",
		size: "lg",
	};

	const pages: SnapperNav.Page[] = [
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
	];

	return (
		<Snapper orientation="vertical">
			<SnapperNav pages={pages} />

			<SnapperContent>
				<SnapperItem>
					<PhotosWrapper
						count={photoCountLimit}
						subtitleVariant={subtitleVariant}
					/>
				</SnapperItem>

				<SnapperItem>
					<TagsWrapper subtitleVariant={subtitleVariant} />
				</SnapperItem>

				<SnapperItem>
					<PriceWrapper subtitleVariant={subtitleVariant} />
				</SnapperItem>

				<SnapperItem>
					<SubmitWrapper />
				</SnapperItem>
			</SnapperContent>
		</Snapper>
	);
};
