// withCount({
//     select: kysely.selectFrom("CategoryGroup").selectAll(),
//     filter: input.filter,
//     where: input.where,
//     query({ select, where }) {
//         return withCategoryGroupQueryBuilder({
//             select,
//             where,
//         });
//     },
// })

// withList({
//     select: kysely.selectFrom("CategoryGroup").selectAll(),
//     output: CategoryGroupSchema,
//     cursor: input.cursor,
//     filter: input.filter,
//     where: input.where,
//     query({ select, where }) {
//         return withCategoryGroupQueryBuilderWithSort({
//             select,
//             where,
//             sort: input.sort,
//         });
//     },
// });

// withFetch({
//     select: kysely.selectFrom("CategoryGroup").selectAll(),
//     output: CategoryGroupSchema,
//     filter: input.filter,
//     where: input.where,
//     query({ select, where }) {
//         return withCategoryGroupQueryBuilder({
//             select,
//             where,
//         });
//     },
// })
