// withCount({
//     select: kysely.selectFrom("Category").selectAll(),
//     filter: input.filter,
//     where: input.where,
//     query({ select, where }) {
//         return withCategoryQueryBuilder({
//             select,
//             where,
//         });
//     },
// })

// withList({
//     select: kysely.selectFrom("Category").selectAll(),
//     output: CategorySchema,
//     cursor: input.cursor,
//     filter: input.filter,
//     where: input.where,
//     query({ select, where }) {
//         return withCategoryQueryBuilderWithSort({
//             select,
//             where,
//             sort: input.sort,
//         });
//     },
// })

// withFetch({
//     select: kysely.selectFrom("Category").selectAll(),
//     output: CategorySchema,
//     filter: input.filter,
//     where: input.where,
//     query({ select, where }) {
//         return withCategoryQueryBuilder({
//             select,
//             where,
//         });
//     },
// })
