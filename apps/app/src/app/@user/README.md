# @user

User private context on the client – components and logic for private user data (gallery, messages, package, personal, user hooks).

## What's here

- **user** – useSide, useUser (session/user state).
- **message** – MessageList (transaction messages). Message types (MessageText, MessageGallery, etc.) live in `@common/message/type` and are used here.
- **gallery** – useHeroUpload, useMaybeHeroUpload, GalleryValue.
- **personal** – PersonalControl (transaction message type).
- **package** – PackageControl (transaction message type).

Photo upload UI lives in `@common/photo`; gallery hooks and display live here.

## Related

- **Can import from**: `@common`, `@session`
- **Used by**: `@buyer-user`, `@seller-user`, routes
