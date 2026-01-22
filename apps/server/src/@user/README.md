# @user

User domain keeps all stuff owned by user, meaning all the stuff is user-private in this domain.

## Rules

All endpoints must use `{scope: {}}` with `userId` if the scope is available.

> It's legal to import stuff from `@session`.
