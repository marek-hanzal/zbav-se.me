import { createFileRoute } from "@tanstack/react-router";
import { Data, Tx } from "@use-pico/client";
import { CategoryListWrapper } from "~/app/category/ui/CategoryListWrapper";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { withCategoryGroupFetchQuery } from "~/app/category-group/query/withCategoryGroupFetchQuery";
import { Content } from "~/app/ui/content/Content";
import { PostIcon } from "~/app/ui/icon/PostIcon";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute(
	"/$locale/n/create/category-group/$categoryGroupId/",
)({
	component() {
		const { categoryGroupId } = Route.useParams();
		const categoryGroupQuery = withCategoryGroupFetchQuery().useQuery({
			where: {
				id: categoryGroupId,
			},
		});

		return (
			<>
				<Title icon={PostIcon}>
					<Tx
						label={"Sell - Category List (title)"}
						size={"xl"}
						font={"bold"}
					/>
					<Data<CategoryGroupSchema.Type, typeof categoryGroupQuery>
						result={categoryGroupQuery}
						renderLoading={() => "-"}
						renderSuccess={({ data }) => (
							<Tx label={`Category group ${data.name}`} />
						)}
					/>
				</Title>

				<Content>
					<CategoryListWrapper categoryGroupId={categoryGroupId} />
				</Content>

				<Nav active="create" />
			</>
		);
	},
});
