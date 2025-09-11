import { createFileRoute } from "@tanstack/react-router";
import { Data, Scrollable, Tx, Typo } from "@use-pico/client";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { withCategoryFetchQuery } from "~/app/category/query/withCategoryFetchQuery";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { withCategoryGroupFetchQuery } from "~/app/category-group/query/withCategoryGroupFetchQuery";
import { PostIcon } from "~/app/ui/icon/PostIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute(
	"/$locale/n/create/category-group/$categoryGroupId/category/$categoryId/",
)({
	component() {
		const { categoryId, categoryGroupId } = Route.useParams();
		const categoryGroupQuery = withCategoryGroupFetchQuery().useQuery({
			where: {
				id: categoryGroupId,
			},
		});
		const categoryQuery = withCategoryFetchQuery().useQuery({
			where: {
				id: categoryId,
			},
		});

		return (
			<>
				<Title icon={PostIcon}>
					<Tx
						label={"Sell - Photos (title)"}
						size={"xl"}
						font={"bold"}
					/>
					<div className="flex flex-row gap-2 items-center">
						<Data<
							CategoryGroupSchema.Type,
							typeof categoryGroupQuery
						>
							result={categoryGroupQuery}
							renderLoading={() => "-"}
							renderSuccess={({ data }) => (
								<Tx label={`Category group ${data.name}`} />
							)}
						/>
						<Typo
							label={"/"}
							font="bold"
						/>
						<Data<CategorySchema.Type, typeof categoryQuery>
							result={categoryQuery}
							renderLoading={() => "-"}
							renderSuccess={({ data }) => (
								<Tx
									label={`Category ${data.name}`}
									font="bold"
								/>
							)}
						/>
					</div>
				</Title>

				<Scrollable>
					PhotoCollection component pro spravu fotek - vystup se
					zmensi/uploaduje
				</Scrollable>

				<Nav active="create" />
			</>
		);
	},
});
