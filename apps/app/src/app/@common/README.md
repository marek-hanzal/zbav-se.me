# @common

Shared client components and utilities used across domains – no domain-specific logic.

## What's here

- **age, category, condition, delivery, expire-at, location, warranty, price-type** – Selects, inline display, controls used in feed, draft, listing.
- **control** – SaveControl (form save indicator).
- **auth** – authClient, getSessionFn, withSessionQuery, SignOutButton, withSignOutMutation.
- **locale** – getLocaleFn.
- **home** – Nav, uiNavButton.
- **listing** – Shared listing display: ListingPrice, ListingLocation, SellerScoreIcon, SellerInfo (used by buyer and seller flows).
- **message** – Message type components (MessageText, MessageGallery, MessageLocation, MessagePackage, MessagePersonal) used in transaction chat.
- **photo** – GalleryContent, GallerySheet, GalleryUpload, GalleryUploadButton, GalleryUploadControl, GalleryUploadSheet, PhotoUpload.
- **transaction** – Shared transaction UI: TransactionChat, TransactionMessage, TransactionToolbar; transaction-status (OpenToolbar, ResolvedToolbar, DisputeToolbar, PendingMessage, OpenMessage, DisputeMessage); buttons (CloseButton, DisputeButton, RejectButton, LocationButton, PackageButton, PersonalButton, CreateButton).

## Related

- **Can import from**: Only non-app packages (sdk, ui, etc.). No `@buyer-user`, `@seller-user`, `@user` to avoid cycles.
- **Used by**: All domain folders and routes.
