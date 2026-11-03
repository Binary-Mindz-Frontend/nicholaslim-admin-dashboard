# Implementation spec — Issues 48, 63, 71, 88, 92, 101, 106, 109

For the Zipbee **backend and frontend** developer. This file is enough to implement both sides. The admin app is Vite + React + TypeScript + Redux Toolkit Query. Base API: `https://api.zipbee.sg/api/v1`. Admin UI: `https://admin.zipbee.sg`.

**Source document:** [UAT_WebAdmin](https://docs.google.com/document/d/1nXAAz2iau7cxdVWxbHy78wG7Sc_TTK8jkCMoDXdSMXI/edit?tab=t.0)  
**Status in doc:** these rows are `2Pending`  
**Checked:** live API + this admin repo on 3 Nov 2026

Stack pointers:

- API hooks live under `src/redux/features/`
- Shared changelog: `src/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable.tsx`
- UI kit: `src/components/ui/` (`Dialog`, `Button`, `Input`, `Select`)
- Toasts: `react-hot-toast`

Do **backend first** for each issue, then the frontend wiring below. No new routes unless this spec says so.

---

## Issue 48 — Surge calculation interval (minutes)

**Doc row:** `48` · Created 16 Mar 2026 · Comments 07 Aug 2026, 11 Oct 2026

### Client

> I need an option to input the calculation interval in minutes, as calculating surge every second would cause the price to change constantly.

- Nicholas, 07 Aug 2026: *Where is the option for me to input in the Web Admin Portal?*
- Joey, 11 Oct 2026: *Where is the calculation interval in minutes?*

### Meaning

Admin sets minutes. Backend stores it and only recalculates surge after that many minutes, not every second.

### Admin page

**Service Configuration → Surge Pricing Rules** (`/surge-pricing-role`)

This is **not** Platform Fee → Dynamic Surge (`/user-dynamic-surge`). That model uses `time_range` (clock window). Do not put this interval there.

---

### Backend — Issue 48

Existing endpoints. Do not add a new route.

| Method | Endpoint |
|---|---|
| `POST` | `/api/v1/admin/surge-pricing-rules` |
| `PATCH` | `/api/v1/admin/surge-pricing-rules/:id` |
| `GET` | `/api/v1/admin/surge-pricing-rules` |
| `GET` | `/api/v1/admin/surge-pricing-rules/:id` |

1. Save `calculationIntervalMinutes` on the rule.
2. Return it on every GET and on POST/PATCH.
3. Recalculate surge only after that many minutes. If missing, use `5`.

Field: integer, minutes, range `1`–`60`, default `5`.

Live GET today is missing this field. Keys now: `id`, `ruleName`, `ratioFrom`, `ratioTo`, `priceMultiplier`, `maxCap`, `status`, `createdAt`, `updatedAt`, `serviceZones`, `deliveryTypes`.

**Request admin already sends**

```json
{
  "ruleName": "High Demand Level 1",
  "ratioFrom": 1,
  "ratioTo": 1.5,
  "priceMultiplier": 1.3,
  "maxCap": 2,
  "calculationIntervalMinutes": 5,
  "status": "ACTIVE",
  "serviceZoneIds": [8, 5, 7, 6, 4],
  "deliveryTypeIds": [3]
}
```

**Expected GET (each rule)**

```json
{
  "id": 1,
  "ruleName": "High Demand Level 1",
  "ratioFrom": "1",
  "ratioTo": "1.5",
  "priceMultiplier": "1.3",
  "maxCap": "2",
  "calculationIntervalMinutes": 5,
  "status": "ACTIVE",
  "createdAt": "2026-08-07T15:05:38.736Z",
  "updatedAt": "2026-08-07T15:05:38.736Z",
  "serviceZones": [],
  "deliveryTypes": []
}
```

`serviceZones` / `deliveryTypes` stay nested as they are.

---

### Frontend — Issue 48

Most of the UI is already in this repo. After backend returns the field, edit + table should work. Make the small display fix so QA can see a missing value.

**Files**

| File | Role |
|---|---|
| `src/pages/SurgePricingRole/SurgePricingRole.tsx` | List page, Interval column |
| `src/pages/SurgePricingRole/_components/SurgeRuleModal.tsx` | Add/Edit form, payload |
| `src/redux/features/surgePricingRules/surgePricingRulesApi.ts` | `GET/POST/PATCH /admin/surge-pricing-rules` |
| `src/types/surgePricingRules.ts` | `calculationIntervalMinutes?: string \| number` |

**Already done (do not rebuild)**

- Modal field **Interval (Mins)**, `type="number"`, `min=1`, `max=60`, default `"5"`.
- Submit payload already includes:

```ts
calculationIntervalMinutes: Number(data.calculationIntervalMinutes || 5)
```

- Edit hydrates from `initialData.calculationIntervalMinutes`.
- Table column `Interval` renders `{val} mins`.

**Change still needed in `SurgePricingRole.tsx`**

The column currently falls back to `"5 mins"` when the API omits the field, so testers cannot see that backend did not save it.

Replace the Interval column `render` with:

```tsx
{
  key: "calculationIntervalMinutes" as const,
  label: "Interval",
  render: (val?: string | number) => (
    <span className="font-semibold text-gray-700">
      {val === undefined || val === null || val === ""
        ? "—"
        : `${val} mins`}
    </span>
  ),
}
```

After backend ships, the cell must show the saved number (e.g. `10 mins`). If it still shows `—`, GET is still missing the field.

**Do not change**

- `src/pages/Admin/PlatformFeeManagement/components/DynamicSurgePricing.tsx`
- `/user-dynamic-surge`

**How to test**

1. Open Surge Pricing Rules → Add/Edit → set Interval to `10` → save.
2. Table shows `10 mins`, not `5 mins` or `—`.
3. Open Edit again; input is `10`.
4. Surge price in the apps must not change every second.

---

## Issue 63 — Driver join request: reason, changelog, notification

**Doc row:** `63` · Created 4 Apr 2026 · Comments 25 May 2026, 08 Aug 2026, 11 Oct 2026  
Related completed row **#83**: changelog table exists, but it does not show approve/reject + reason.

### Client

Original:

> If any information is inadequate, the Admin may reject the request and will have the option to notify the Driver via SMS, email, or an in-app notification to include the reasons for rejection.

Nicholas, 25 May 2026:

- Changelog action must be **Rejected** / **Approved**, not **Updated**.
- Admin must enter a reason; it must appear in changelog.
- Admin chooses email or SMS.
- Driver app shows that rejection comment.
- After reject, app must **not** stay on “Waiting for Admin Approval”.
- Keep submitted registration data so the driver only fixes missing fields.

Joey, 08 Aug 2026: Approved D11 / Rejected D12 — no changelog status; D12 still could login and wait for approval.  
Joey, 11 Oct 2026: Nicholas’s comments still not done.

### Admin pages

- **Drivers → Join Requests** (`/new-join-request`)
- **View Driver Profile** (`/join-request/:id`)

Live check 3 Nov 2026: D12 is `REJECTED` but `rejectionReason` is missing. Profile shows “No specific reason provided.” Changelog rows exist but `meta.type` is `verify_rider` with no reason.

---

### Backend — Issue 63

Keep `PATCH /api/v1/raider-profile/verify-rider/:raiderId/:verify`  
`:verify` = `APPROVED` | `REJECTED`

Admin already sends:

```json
{
  "reason": "Driving license photo is blurry. Please provide a clear scan.",
  "notificationChannel": "BOTH",
  "notifyEmail": true,
  "notifySms": true
}
```

| Field | Rules |
|---|---|
| `reason` | Required on reject. Optional note on approve. |
| `notificationChannel` | `EMAIL` \| `SMS` \| `BOTH` \| `NONE` |
| `notifyEmail` / `notifySms` | booleans |

Notifications: send email and/or SMS with the reason; send nothing when `NONE`.

On reject: verification `REJECTED`; driver app status **Rejected** (not Waiting); **do not wipe** `registrations` / documents.

**Return on** `GET /raider-profile/:id` **and** `GET /raider-profile/rider-profiles`:

```json
{
  "id": 12,
  "raider_verificationFromAdmin": "REJECTED",
  "raider_status": "IN_ACTIVE",
  "rejectionReason": "Driving license photo is blurry. Please provide a clear scan.",
  "rejectedAt": "2026-08-08T09:38:32.216Z",
  "approvalReason": null,
  "approvedAt": null
}
```

**Changelog** — `GET /additional-services/logs?entity_type=rider_approval`

Today `action` is APPROVED/REJECTED but `meta.type` is `verify_rider`, `description` is empty, no reason. Admin UI prefers `meta.type`, so testers see VERIFY_RIDER.

Write:

```json
{
  "action": "REJECTED",
  "entity_type": "rider_approval",
  "entity_id": 12,
  "description": "Rejected driver D12 (joey): Driving license photo is blurry. Please provide a clear scan.",
  "meta": {
    "type": "REJECTED",
    "reason": "Driving license photo is blurry. Please provide a clear scan.",
    "notificationChannel": "BOTH",
    "before": { "status": "IN_ACTIVE", "verification": "PENDING" },
    "after": { "status": "IN_ACTIVE", "verification": "REJECTED" }
  },
  "admin": { "name": "admin", "role": "ADMIN" }
}
```

- `action` and `meta.type` = `APPROVED` or `REJECTED` (never `UPDATE`, never `verify_rider`).
- Filter `action=APPROVED` / `action=REJECTED` must work.

---

### Frontend — Issue 63

Approve/Reject modal already exists. Finish display, filter, and changelog so the client can see reason + Approved/Rejected.

**Files**

| File | Role |
|---|---|
| `src/pages/Drivers/NewJoinRequest/NewJoinRequest.tsx` | Join request page; changelog `entityType="rider_approval"` |
| `src/pages/Drivers/NewJoinRequest/RequestTable/RequestTable.tsx` | Accept/Reject menu; calls verify API |
| `src/pages/Drivers/NewJoinRequest/components/VerifyRiderModal.tsx` | Reason + Email/SMS modal |
| `src/pages/Drivers/NewJoinRequest/ViewDriverProfile/ViewDriverProfile.tsx` | Profile banner reads `rejectionReason` |
| `src/components/Drivers/DriverFilter/DriverFilter.tsx` | Status filter is commented out |
| `src/redux/features/drivers/driversApi.ts` | `verifyRiderProfile` mutation |
| `src/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable.tsx` | Shared changelog table |

**Already done (do not rebuild the modal)**

`VerifyRiderModal` already requires reason on reject and sends:

```ts
verifyRiderProfile({
  raiderId,
  verify: "APPROVED" | "REJECTED",
  reason,
  notificationChannel, // BOTH | EMAIL | SMS | NONE
  notifyEmail,
  notifySms,
})
```

Hook in `driversApi.ts`:

```
PATCH /raider-profile/verify-rider/${raiderId}/${verify}
```

Profile banner already shows `rejectionReason` / `rejectedAt`. Once GET returns them, the red banner fills in. No new banner needed.

#### 1. Uncomment the verification filter

In `DriverFilter.tsx` the Pending/Rejected dropdown is commented out, so Join Requests is stuck on default `PENDING` and Joey cannot open D12 from the list.

- Uncomment `verificationStatus` / `setVerificationStatus` / `showApproved` in the component props.
- Uncomment the **Verification Status** `Select` (Pending / Rejected / All). Import `Select` from `@/components/ui/select` like other filters.
- Keep the dummy “Filter By” label or replace it with this real dropdown — the dropdown is what testers need.
- `NewJoinRequest.tsx` already passes `verificationStatus` into `useRequestColumns` as `raiderVerificationFromAdmin`. No API change.

#### 2. Changelog: show Approved/Rejected + reason

In `NewDynamicChangeLogTable.tsx`:

**Action column** — do not prefer `meta.type` when it is `verify_rider`. Use:

```ts
const label =
  row.action === "APPROVED" || row.action === "REJECTED"
    ? row.action
    : row.meta?.type && row.meta.type !== "verify_rider"
      ? row.meta.type
      : row.action;
```

Green badge for `APPROVED`, red for `REJECTED`.

**Details column** — show reason, not `Modified rider_approval`:

```tsx
{row.description ||
  row.meta?.reason ||
  `Modified ${row.entity_type}`}
```

**Action filter values** — today the select sends `Approved` / `Rejected` (title case) but API uses `APPROVED` / `REJECTED`. Change `SelectItem` values to `APPROVED` and `REJECTED` so Joey can filter.

Keep the same shared component; Issue 71 will add extra columns on this file too (see below). Do both changelog edits together.

#### 3. Profile after reject

No extra form. Confirm `ViewDriverProfile.tsx` still reads:

```ts
driverResponse?.data?.rejectionReason
driverResponse?.data?.rejectedAt
```

If GET uses different names, map them here (`reason` → `rejectionReason`).

**How to test**

1. Join Requests → filter Rejected → open D12. Banner must show the stored reason, not “No specific reason provided.”
2. Reject a test rider with a reason + Email. Changelog latest row = **REJECTED** + that reason + admin name.
3. Driver app shows Rejected + the comment, not Waiting for Admin Approval.

---

## Issue 71 — Support & Disputes queue, Reject, changelog

**Doc row:** `71` · Created 11 Apr 2026 · Comments 19 Apr, 08 Aug, 11 Oct 2026

### Client

Admin must see disputes from user / driver / call center, review order + evidence + time + status, then:

- Approve
- Reject
- Adjust compensation
- Escalate

Nicholas, 19 Apr 2026: cards → **table**; keep filters; show reported timestamp; sort by it.

Joey, 08 Aug 2026: cannot change amount on Custom refund; why does changelog show Create.

Joey, 11 Oct 2026 (still open):

1. Dispute Queue: **Reject** button → popup, required rejection reason.
2. Change Log:
   - Actions like Rejected / Approved (funds refunded), not generic Update
   - Columns: Dispute Id, Date, Action, Changed By, View (case details + reasons)

### Admin pages

- List: **Support & Communication → Support & Disputes** (`/support`)
- Detail: `/support/view/:id`

Live 3 Nov 2026: 2 disputes (`#1` PENDING, `#2` RESOLVED full refund $7.49). List is already a table. Detail has Full/Custom refund + Close Case. **No Reject.** Changelog `action` is always `UPDATE`; real event is only in `meta.action` (`RESOLVE_DISPUTE`, `CLOSE_CASE`). `description` and `admin` are null.

---

### Backend — Issue 71

#### 1. Reject with reason (needed)

There is no reject-with-reason API today.

`closeDisputeCase` is `PATCH /disputes/:id` with **empty body**. Status enum already includes `REJECTED`.

Implement either:

`PATCH /api/v1/disputes/:id/reject`

or extend `PATCH /api/v1/disputes/:id` with a body. Prefer a dedicated reject URL if close-case must stay a silent close.

```json
{
  "reason": "Evidence is insufficient. Order was delivered as described.",
  "notifyUser": true
}
```

Effects:

- `status` → `REJECTED`
- store `rejectionReason` (and `rejectedAt`, `rejectedByAdminId`)
- return those fields on `GET /disputes/:id` and list
- changelog row with `action: "REJECTED"` (not `UPDATE`)

#### 2. Changelog

`GET /additional-services/logs?entity_type=Dispute`

Today:

```json
{
  "action": "UPDATE",
  "entity_type": "Dispute",
  "entity_id": 2,
  "description": null,
  "admin": null,
  "meta": {
    "action": "RESOLVE_DISPUTE",
    "orderId": 139,
    "financials": { "total": 7.49, "userAmount": 7.49, "riderAmount": 0, "companyAmount": 0 }
  }
}
```

Change to:

| Event | `action` | `description` example |
|---|---|---|
| Approve / refund | `APPROVED` | `Approved DISP#0002. Full refund $7.49` |
| Reject | `REJECTED` | `Rejected DISP#0001: Evidence is insufficient.` |
| Close case | `CLOSED` | `Closed DISP#0002` |

Also return:

- `entity_id` = dispute id (already)
- `description` with reason / refund amount
- `admin: { name, role }`
- `meta.reason` on reject
- `meta.refundType`, `meta.financials` on approve

Do **not** write `CREATE` on this log for dispute-type config. Joey asked why Create appears when admin cannot create a dispute. Type CRUD should use `entity_type=DisputeType`, not `Dispute`.

Filter must accept `action=APPROVED|REJECTED|CLOSED`.

#### 3. Custom refund

`POST /disputes/resolve` already gets:

```json
{
  "disputeId": 1,
  "refundType": "CUSTOM",
  "totalAmount": 3.5,
  "companyPercent": 60,
  "riderPercent": 40,
  "adminId": 1,
  "adminNote": "Partial refund"
}
```

Persist `totalAmount` as `refundAmount`. Do not overwrite with full order total when `refundType` is `CUSTOM`.

#### 4. Escalate (original spec; not in Joey’s last note)

If you implement it now: `PATCH /disputes/:id/escalate` with optional note, status `ESCALATED` or `UNDER_REVIEW`, changelog `action: "ESCALATED"`. Otherwise leave a stub and say it is not in the 11 Oct list.

`GET /disputes/:id` should already expose order, evidence, description, created_at, status — list/detail already use these.

---

### Frontend — Issue 71

**Files**

| File | Change |
|---|---|
| `src/redux/features/disputes/disputesApi.ts` | Add reject mutation |
| `src/pages/SupportAndDisputes/SupportAndDisputesTable/SupportAndDisputesTable.tsx` | Add Reject on each row |
| `src/pages/SupportAndDisputes/SupportAndDisputes.tsx` | Wire reject modal |
| `src/pages/SupportAndDisputes/ViewSupport/ViewSupport.tsx` | Reject button + custom amount lock |
| **new** `src/pages/SupportAndDisputes/RejectDisputeModal/RejectDisputeModal.tsx` | Reason popup |
| `src/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable.tsx` | Extra columns for Dispute |

List is already `<table>` via `CustomTable`. Do not go back to cards. Filters already exist in `FilterSection.tsx` (status, role, reason, from/to date). Keep them.

#### 1. API hook

In `disputesApi.ts` add (match whatever URL backend ships; this is the preferred one):

```ts
rejectDispute: builder.mutation({
  query: ({ id, reason }: { id: number; reason: string }) => ({
    url: `/disputes/${id}/reject`,
    method: "PATCH",
    body: { reason },
  }),
  invalidatesTags: ["Disputes", "AdditionalServicesLogs"],
}),
```

Export `useRejectDisputeMutation`.

If backend instead uses `PATCH /disputes/:id` with `{ status: "REJECTED", reason }`, point the hook there. Do not keep using empty-body close-case as reject.

#### 2. Reject modal (copy the join-request pattern)

New file `RejectDisputeModal.tsx`, same Dialog pattern as `VerifyRiderModal.tsx`:

- Title: **Reject Dispute**
- Required textarea **Rejection Reason**
- Cancel / **Confirm Rejection** (red)
- On submit, `reason.trim()` required; toast if empty

Reuse `src/components/ui/dialog`.

#### 3. Queue: Reject button

In `SupportAndDisputesTable.tsx` Actions column, next to View, add a Reject button (`X` from `lucide-react`, red). Call `onReject(row.id)` for rows where `status` is not `RESOLVED` or `REJECTED`.

In `SupportAndDisputes.tsx`:

- State for modal open + selected dispute id
- `useRejectDisputeMutation`
- Pass `onReject` into `useSupportDisputeColumns`
- On confirm: `rejectDispute({ id, reason })`, toast, `refetch()`

Also add Reject on `ViewSupport.tsx` header next to **Close Case** (red). Same modal. Close Case stays a separate action (no reason). Reject is the one Joey asked for.

#### 4. Custom refund amount

In `ViewSupport.tsx`, Adjustment Type is `FULL` | `CUSTOM`. Amount is always editable today, and a `useEffect` seeds it from `order.total_cost`.

Change:

- When user selects **FULL**: set amount to `dispute.order.total_cost` and **disable** the Amount input.
- When user selects **CUSTOM**: enable Amount, keep it editable, do not force it back to full total.
- `disabled` on Amount: `dispute.status === "RESOLVED" || adjustmentType === "FULL"`

`POST /disputes/resolve` body is already `refundType` + `totalAmount`. No payload shape change.

#### 5. Changelog columns for disputes

`SupportAndDisputes.tsx` already renders:

```tsx
<NewDynamicChangeLogTable entityType="Dispute" />
```

Extend `NewDynamicChangeLogTable` with an optional `variant?: "default" | "dispute"` **or** branch on `entityType === "Dispute"`.

For Dispute logs, columns must be:

| Column | Source |
|---|---|
| Dispute Id | `DISP#${String(row.entity_id).padStart(4, "0")}` |
| Date | `row.created_at` (already) |
| Action | map below |
| Changed By | `row.admin?.name` (already; shows Admin if null until backend sends `admin`) |
| View | button → `navigate(`/support/view/${row.entity_id}`)` |

Action labels:

```ts
function disputeActionLabel(row) {
  const raw = row.action !== "UPDATE" ? row.action : row.meta?.action;
  if (raw === "APPROVED" || raw === "RESOLVE_DISPUTE") return "Approved";
  if (raw === "REJECTED") return "Rejected";
  if (raw === "CLOSED" || raw === "CLOSE_CASE") return "Closed";
  return raw || "Update";
}
```

After backend stops sending `UPDATE`, the first branch is enough. Keep the `meta.action` fallback so current live logs still read as Approved/Closed.

Filter items for this table: All, Approved, Rejected, Closed (values `APPROVED`, `REJECTED`, `CLOSED`). Hide Create/Update/Delete on the dispute page so Joey does not see Create as an option.

View button: `useNavigate()` from `react-router-dom`. Title: “View case details”.

**How to test**

1. `/support` is a table (not cards). Filters still work.
2. Pending row → Reject → type reason → confirm. Status becomes Rejected. GET returns `rejectionReason`.
3. Changelog: Dispute Id, Approved/Rejected/Closed (not Update), Changed By, View opens `/support/view/:id`.
4. Custom Refund: amount is editable and the saved `refundAmount` matches what was typed, not full order total.
5. Full Refund: amount locked to order total.

---

## Issue 88 — Admin starts chat with a specific driver or user

**Doc row:** `88` · Created 24 May 2026 · Comments 06 Aug 2026, 05 Oct 2026, 12 Oct 2026

### Client

Original:

> Cannot key and send message to specific driver / user

Dev said users/drivers can message admin first, then admin replies. Joey (06 Aug): driver app has no button to reach admin (mobile-app work, not this repo).

Nicholas, 05 Oct 2026 (the requirement to implement):

> The video you showed me does not allow the Admin to initiate a message to a specific driver or user from the Web Admin Portal.
> In other words, it appears that the Driver must first message the Admin through the Driver App before the Admin can respond or contact the Driver. This is not ideal, as the Admin should be able to proactively contact any driver when necessary.
> Please include the Message feature under the Driver/User Profile page, so that the Admin can directly initiate a conversation with the selected driver or user.
> In addition, under Service Chat, please include a search function that allows the Admin to search for a specific driver/user by:
> * @Username
> * Name
> * Contact Number
> The system should then display the relevant matching drivers/users so that the Web Admin can select the intended person and initiate a conversation directly.

Joey, 12 Oct 2026: *Not updated yet.*

### Meaning (perfect solution)

Admin must start a thread **without** waiting for the other person to write first.

1. **Profile → Message** on User and Driver opens Service Chat with that person, even if no conversation exists.
2. **Service Chat search** finds USER and DRIVER by `@username`, name, or phone, lists matches, admin picks one, thread opens, admin types the first message.

### Admin pages today

- Service Chat: `/dashboard-chat` (`DashboardChat.tsx`)
- User profile: `/users-app/:id`
- Driver profile: `/driver-list/:id` (`userId` is on the rider object, not the raider id)

Live/code gap:

- Sidebar is only `GET /chat/conversations` (people who already have a thread).
- `POST /chat/conversations { otherUserId }` exists but is only called when sending to someone already in that list.
- `otherUser` is `{ id, email }` — no username, name, phone, role.
- User list **Message** menu is commented out. Driver actions have no Message.
- Route permission map already has `dashboard-chat/:id`; the page does not read `:id`.

---

### Backend — Issue 88

Chat already uses login `userId` as `otherUserId`. Drivers have `userId` on `GET /raider-profile/...`. Do not use raider id (`D15`) as `otherUserId`.

#### 1. Create conversation even if empty (required)

`POST /api/v1/chat/conversations`

```json
{ "otherUserId": "21" }
```

Must **upsert**: if a thread exists, return it; if not, create an empty one and return it. Do not 404 because the driver never messaged admin.

Response:

```json
{
  "success": true,
  "data": {
    "id": "conv_...",
    "otherUser": {
      "id": 21,
      "role": "DRIVER",
      "username": "joey",
      "name": "joey",
      "email": "joeypslin@gmail.com",
      "phone": "+659796"
    }
  }
}
```

Socket send (`receiverId` = that `otherUser.id`) must work on this new thread. First message from admin is allowed.

#### 2. Search users + drivers (required)

One endpoint so the chat UI does not glue two list APIs with different shapes.

`GET /api/v1/chat/search?q=`

`q` matches **username** (with or without leading `@`), **name**, and **contact number** (digits, ignore spaces/`+`). Search both app users and drivers. Limit 20.

```json
{
  "success": true,
  "data": [
    {
      "userId": 21,
      "role": "DRIVER",
      "username": "joey",
      "name": "joey",
      "phone": "+659796",
      "email": "joeypslin@gmail.com"
    },
    {
      "userId": 44,
      "role": "USER",
      "username": "nicholaszb",
      "name": "Nicholas",
      "phone": "+6584280600",
      "email": "nicholas@example.com"
    }
  ]
}
```

`userId` is the chat `otherUserId`. Empty `q` → `data: []`.

If a dedicated search cannot ship immediately, reuse and document:

- Users: `GET /users/only-users?search=`
- Drivers: `GET /raider-profile/rider-profiles/raider?search=` and take `userId`, `registrations[0].raider_name`, `contact_number`, `email_address`

The dedicated `/chat/search` is the solution to implement. The two list APIs are fallback only.

#### 3. Enrich conversation list

`GET /api/v1/chat/conversations` — each `otherUser` must include `username`, `name`, `phone`, `role`, not only `id` + `email`. Service Chat sidebar can then show real names.

#### 4. Out of scope for this admin repo

Driver/User **mobile app** “Contact admin” button (Joey, 06 Aug). That is UAT_Driver / UAT_User. Admin still must be able to write first even if the app button is missing.

---

### Frontend — Issue 88

**Files**

| File | Change |
|---|---|
| `src/redux/features/chat/chatApi.ts` | Add `searchChatUsers` query; keep `createConversation` |
| `src/pages/Admin/AdditionalServices/DashboardChat.tsx` | Search box + start thread from result; read `:userId` |
| `src/routes/Routes.tsx` | Add `dashboard-chat/:userId` next to `dashboard-chat` |
| `src/pages/Users/UsersApp/ActionCell/ActionCell.tsx` | Uncomment Message → `/dashboard-chat/${row.id}` |
| `src/pages/Users/UsersApp/EditProfile/UserProfile.tsx` | Header **Message** button with that user’s id |
| `src/pages/Drivers/DriverList/DriverAction/DriverAction.tsx` | Message → `/dashboard-chat/${row.userId}` |
| `src/pages/Drivers/NewJoinRequest/ViewDriverProfile/ViewDriverProfile.tsx` | Message using `driverResponse.data.userId` |
| **new** `src/pages/Admin/AdditionalServices/startChat.ts` (optional helper) | `navigate(\`/dashboard-chat/${userId}\`)` |

`createConversation` already exists:

```
POST /chat/conversations  body: { otherUserId }
```

Socket send already uses `receiverId: selectedReceiver`.

#### 1. Route

In `Routes.tsx` duplicate the chat element:

```tsx
{ path: "dashboard-chat", element: <DashboardChat /> },
{ path: "dashboard-chat/:userId", element: <DashboardChat /> },
```

Permission map already lists `dashboard-chat/:id`.

#### 2. Open a person from the URL

In `DashboardChat.tsx`:

```ts
const { userId: userIdFromRoute } = useParams();
```

On mount / when `userIdFromRoute` changes:

1. `createConversation({ otherUserId: String(userIdFromRoute) })`
2. `setSelectedReceiver(String(userIdFromRoute))`
3. `dispatch(setActiveConversation(String(userIdFromRoute)))`
4. `refetchConversations()` so the sidebar shows the new thread

If create fails, toast and stay on empty chat. Do not require an existing conversation.

#### 3. Service Chat search

In the sidebar header (under “Messages”), add a search input. Debounce 300ms (`useDebounce` already exists).

```ts
const { data: searchResponse } = useSearchChatUsersQuery(
  { q: debouncedQ },
  { skip: debouncedQ.trim().length < 2 }
);
```

In `chatApi.ts`:

```ts
searchChatUsers: builder.query<
  ApiResponse<Array<{
    userId: number;
    role: "USER" | "DRIVER";
    username: string;
    name: string;
    phone?: string;
    email?: string;
  }>>,
  { q: string }
>({
  query: ({ q }) => ({
    url: `/chat/search`,
    params: { q },
  }),
}),
```

While `q` has 2+ characters, show a **results** list above the conversation list:

- Line 1: `name` (`@username`) + badge User/Driver
- Line 2: phone · email

Click a result:

```ts
await createConversation({ otherUserId: String(result.userId) }).unwrap();
setSelectedReceiver(String(result.userId));
dispatch(setActiveConversation(String(result.userId)));
setSearch("");
refetchConversations();
```

Admin then types in the existing composer. First send still calls `createConversation` + socket `sendMessage` as today.

Strip a leading `@` before calling search (`q.replace(/^@/, "")`) so `@joey` and `joey` hit the same people.

Empty search: show the existing conversation list only.

#### 4. Profile Message buttons

Always navigate with the **login user id** (chat id), never raider id.

**User list** — `ActionCell.tsx`, uncomment Message:

```tsx
<DropdownMenuItem
  onClick={() => navigate(`/dashboard-chat/${row.id}`)}
  className="flex items-center gap-2"
>
  <MessagesSquare size={16} className="text-green-600" />
  <span>Message</span>
</DropdownMenuItem>
```

Import `MessagesSquare` from `lucide-react`.

**User profile** — `UserProfile.tsx` header next to Edit: button **Message** → `/dashboard-chat/${id}`.

**Driver list** — `DriverAction.tsx` next to Edit:

```ts
navigate(`/dashboard-chat/${row.userId}`);
```

If `userId` is missing, toast “This driver has no login account.”

**Driver profile** — `ViewDriverProfile.tsx` header next to Approve/Reject:

```ts
const chatUserId = driverResponse?.data?.userId;
// Message button disabled if !chatUserId
navigate(`/dashboard-chat/${chatUserId}`);
```

#### 5. Sidebar labels

When `otherUser.name` / `username` exist, show those instead of `email.split("@")[0]`. Fallback to email if name is empty.

**How to test**

1. Open a driver who has **never** messaged admin → Message → Service Chat opens with that driver. Send “hello”. Thread appears in the sidebar.
2. Same from a user profile.
3. Service Chat search `joey`, `@joey`, and a phone fragment. Pick a match. Composer works.
4. Search does not require an existing conversation.
5. `/dashboard-chat/21` deep-link opens user 21.

Do **not** wait for the driver app contact button. Admin-initiated chat is this issue.

---

## Issue 92 — Live Fleet Map: count, blinking markers, hover details

**Doc row:** `92` · Created 30 May 2026 · Comments 07 Aug 2026, 05 Oct 2026  
**Also referenced:** UAT_DriverApp #74 (app GPS / background)

### Client

Original row is seven sync scenarios (online delay, background app, offline not refreshing, tunnel, phone call, GPS off). Most of those are **driver app + location heartbeat**. Dev wrote there is no delay on live map. Nicholas then filed the admin-map bugs that are still open.

Nicholas, 07 Aug 2026: hover/info above the marker must be clickable to the Driver Profile.

Nicholas, 05 Oct 2026 (implement this):

> I have 2 drivers logged in to the Mobile App, so the Web Admin Portal should display CAR (2). However, it is currently only showing CAR (1).
> Additionally, the CAR (1) marker keeps disappearing and reappearing every 3–5 seconds. Although the link to the Driver Profile is working, the Admin needs to click the green driver marker very quickly before it disappears from the map again.
> There is also an issue with the information displayed when hovering over the green driver marker. Currently, it only shows the Driver ID (e.g. #D10).
> Please include the following information in the hover tooltip:
> * Driver ID
> * Driver Name
> * Vehicle Type
> * Contact Number

### Meaning (perfect solution)

1. If two cars are online, the chip must stay **CAR (2)** and both green markers must stay on the map.
2. Markers must not blink every few seconds.
3. Hover (InfoWindow) shows Driver ID, Name, Vehicle Type, Contact. Click still opens `/driver-list/:riderId`.
4. Admin must not need a manual refresh for online/offline count (original scenarios 1 and 3), as long as the socket keeps sending.

Root cause in this repo: the map treats a driver as offline after **1 second** without a GPS packet. The app sends location every ~3–5 seconds, so markers are deleted between packets. That is why count flickers `2 → 1 → 0` and why the profile click misses.

```ts
// src/components/Dashboard/RealTimeFleetMap/RealTimeFleetMap.tsx
const OFFLINE_THRESHOLD_MS = 1000; // too short
const CLEANUP_INTERVAL_MS = 100;
```

Socket: `io("https://api.zipbee.sg/admin")` event `admin:rider_location`.  
Pages: Dashboard + **Live Fleet Tracking** (`/live-map`) both render this component.

---

### Backend / socket — Issue 92

Event: `admin:rider_location` on namespace `/admin`.

Every online driver must emit on a **steady interval** (recommend **3–5 seconds**, never slower than the admin offline threshold). Each payload must identify the rider uniquely (`riderId`) so two cars never overwrite one marker.

**Required payload** (add the identity fields; keep lat/lng as now):

```json
{
  "riderId": 10,
  "lat": 1.3521,
  "lng": 103.8198,
  "heading": 90,
  "is_online": true,
  "gpsStatus": "OK",
  "vehicle_type": { "vehicle_name": "Car" },
  "driver": {
    "name": "Astrid",
    "phone": "+65 9696 9696"
  }
}
```

| Field | Why |
|---|---|
| `riderId` | Marker key. Two drivers = two ids. |
| `lat` / `lng` | Position |
| `vehicle_type.vehicle_name` | Chip label `CAR (n)` |
| `driver.name` / `driver.phone` | Hover tooltip (Nicholas 05 Oct) |
| `is_online` | Explicit offline: remove marker immediately |
| `gpsStatus` | `"OK"` \| `"LOST"` — show “GPS Signal Lost” instead of deleting the driver (original scenario 7) |

Also emit when the driver goes offline (`is_online: false` or a dedicated `admin:rider_offline` with `riderId`) so the count drops without a page refresh (scenario 3).

**Do not** drop a rider from the stream because:

- the app is in background (scenario 2)
- the phone is in a call (scenario 6)

Those are driver-app process rules. If the app still has GPS, keep sending `admin:rider_location`.

**Driver app (not this repo, UAT_DriverApp #74)**

- Cache last location in a dead zone; resend when signal returns (scenario 5).
- If Location Services is off: block accepting orders; send `gpsStatus: "LOST"` instead of going silent (scenario 7).

Admin cannot invent a second car if the socket only ever sends one `riderId`.

---

### Frontend — Issue 92

**File:** `src/components/Dashboard/RealTimeFleetMap/RealTimeFleetMap.tsx`  
Also used from `src/pages/Dashboard/Dashboard.tsx` and `src/pages/LiveMap/LiveMap.tsx`.

No new page. No new REST API if the socket payload is complete.

#### 1. Stop the blink (this fixes CAR (1) vs CAR (2) on the admin side)

Change constants:

```ts
const OFFLINE_THRESHOLD_MS = 45_000; // 45s; must be > GPS interval (3–5s)
const CLEANUP_INTERVAL_MS = 2_000;
```

Keep a driver on the map until **45s** without a packet, or until an explicit offline event. Do not remove at 1s.

If backend later sends `is_online: false` or `admin:rider_offline`, call `removeVehicle(riderId)` immediately in that handler.

#### 2. Hover tooltip (InfoWindow)

`infoWindowRef` already exists but is never opened. `marker.setTitle` only shows `#D10`.

On `mouseover`:

```ts
const v = vehiclesMapRef.current.get(markerId);
const name = v?.fullData?.driver?.name || v?.fullData?.name || "—";
const phone = v?.fullData?.driver?.phone || v?.fullData?.phone || "—";
const vehicle = v?.vehicleName || "—";

infoWindowRef.current.setContent(`
  <div style="min-width:180px;font-family:inherit;font-size:13px;line-height:1.5">
    <div><strong>Driver ID</strong> #D${v.riderId}</div>
    <div><strong>Driver Name</strong> ${name}</div>
    <div><strong>Vehicle Type</strong> ${vehicle}</div>
    <div><strong>Contact Number</strong> ${phone}</div>
    <div style="margin-top:6px;color:#2563eb">Click to open profile</div>
  </div>
`);
infoWindowRef.current.open(mapInstanceRef.current, marker);
```

On `mouseout`, close the InfoWindow unless the user is interacting with it. Keep the existing **click** → `/driver-list/${riderId}` (already implemented; Nicholas confirmed the link works).

Store `name` and `phone` on the `Vehicle` type when mapping the socket payload so the tooltip does not depend on guessing `fullData` shape:

```ts
driverName: payload.driver?.name || payload.name || "",
phone: payload.driver?.phone || payload.phone || "",
gpsStatus: payload.gpsStatus || "OK",
```

If the socket still omits name/phone, fallback once: `GET /raider-profile/${riderId}` and cache. Prefer the socket fields so hover does not wait on HTTP.

#### 3. GPS lost chip (optional, scenario 7)

If `gpsStatus === "LOST"`, do **not** remove the marker. Draw it grey/amber and set tooltip to “GPS Signal Lost”. Count still includes that driver until they go offline.

#### 4. Count chips

Existing `categories` reducer is correct (`CAR (n)` from unique `riderId`s in `vehicles`). After the 1s eviction is gone, two stable socket ids → **CAR (2)**. Do not count by vehicle type string alone if two payloads share one `riderId` — that is a backend bug.

**How to test**

1. Two drivers online in the car app. Admin Live Map (and Dashboard map) shows **CAR (2)** and two green markers. Wait 15s without refresh — still 2, markers do not blink.
2. Hover a marker: Driver ID, Name, Vehicle Type, Contact. Click → `/driver-list/{id}`.
3. One driver goes offline. Count becomes **CAR (1)** without refresh (needs offline socket event or 45s timeout).
4. GPS off (if `gpsStatus` shipped): marker stays, flagged lost, not deleted.

---

## Issue 101 — Bulk order upload: skipped rows, wrong charge, 0 km

**Doc row:** `101` · Created 1 Jun 2026 · Comment 04 Aug 2026  
**Same skip bug:** row **107** (4 Aug 2026) — “file has 4 orders but 1 is skipped.” Fix 101 #1 and 107 together.

### Client

Joey, 04 Aug 2026, after using the CSV Dev sent:

> Errors:  
> #1 There are 4 orders but only 3 accepted.  
> #2 The charged amount for every order is wrong if based on the distance between sender and drop off address  
> #3 It appear as 0 km in the Driver App

### Meaning (perfect solution)

Upload a 4-row bulk CSV → **4 orders created**. If a row cannot be created, return that **row number + reason**; do not silently drop it and toast Success.

Each order’s `total_cost` uses the **same distance/price formula as a single order** (sender → that row’s drop-off).

`total_distance` is stored in km (not 0) so the driver app can show it.

### Admin flow today

Page: Order Management → Bulk tab  
Files: `src/components/OrderPlacement/BulkOrder/BulkOrderTab/BulkOrderTab.tsx`, `BulkOrderTable/BulkOrderTable.tsx`  
API: `src/redux/features/orderPlacement/orderPlacementApi.ts`

1. Template: `GET /order/orders/export/csv`
2. File upload: `POST /auth/upload` (field `images`)
3. Create: `POST /order/orders/bulk` with

```json
{
  "fileUrl": "https://…/file.csv",
  "destinations": [
    {
      "address": "<sender address from the form>",
      "floor_unit": "<sender floor>",
      "contact_name": "<sender name>",
      "contact_number": "<sender phone>",
      "is_saved": false,
      "type": "SENDER"
    }
  ]
}
```

The React app **does not parse CSV rows**. It only sends the file URL + one sender. Skip/charge/distance all happen on `POST /order/orders/bulk`.

Success UI is only `response.data.message`. There is no `created` / `skipped` list, so 3 of 4 still looks like success.

---

### Backend — Issue 101

Endpoint: `POST /api/v1/order/orders/bulk`

#### 1. Do not skip a valid CSV row (fixes 101 #1 and 107)

- Count **data rows** (not header, not blank lines). 4 data rows → 4 orders.
- Geocode every drop-off. If one row fails, **still process the others**, and put the failure in `skipped` (1-based CSV row index, including header or documented as data-row index — pick one and document it; recommend **CSV line number**).
- Do not drop a row because of trailing comma, extra whitespace, BOM, or a blank last line without reporting it.
- HTTP 200 with `skipped.length > 0` is a **partial** result, not a clean success.

**Response shape**

```json
{
  "success": true,
  "message": "Created 3 of 4 orders. 1 row skipped.",
  "data": {
    "created": [
      { "csvRow": 2, "orderId": 501, "total_cost": "12.40", "total_distance": "8.2" },
      { "csvRow": 3, "orderId": 502, "total_cost": "6.10", "total_distance": "3.1" },
      { "csvRow": 5, "orderId": 503, "total_cost": "15.00", "total_distance": "11.4" }
    ],
    "skipped": [
      {
        "csvRow": 4,
        "reason": "Drop-off address could not be geocoded",
        "raw": { "dropoff_address": "…" }
      }
    ]
  }
}
```

If **all** rows fail, `success: false` and the same `skipped` array.

Match the template from `GET /order/orders/export/csv`. If a required column is missing, skip with reason `Missing column X`, do not skip with no reason.

#### 2. Charge from sender → drop-off distance (fixes 101 #2)

Use the **same pipeline as individual order** (`POST /order/indivitual`):

distance (km, sender form address → that CSV drop-off)  
→ base / per-km / delivery type  
→ user fees, zone, surge  
→ `total_cost`

Do not use a dummy distance, 0, or a flat fee. `total_cost` on GET order must match what a single order with the same two addresses would charge.

#### 3. Persist distance for the driver app (fixes 101 #3)

Set `total_distance` on each created order to that computed km (string or number, same type as single orders). Driver app 0 km means this field is `0` / `null` on bulk creates.

`GET /order/:id` and bulk list must return `total_distance`.

---

### Frontend — Issue 101

Admin cannot invent the 4th order. It must **show** what bulk returned.

**Files**

| File | Change |
|---|---|
| `BulkOrderTab.tsx` | After `bulkOrder()`, read `created` / `skipped`; warning if any skip |
| `BulkOrderTable.tsx` | Optional **Distance** column from `total_distance` |

#### 1. Partial-success dialog

Replace the generic Success Swal in `processBulkOrder`.

```ts
const created = response?.data?.created || [];
const skipped = response?.data?.skipped || [];

if (skipped.length > 0) {
  const lines = skipped
    .map((s) => `Row ${s.csvRow}: ${s.reason}`)
    .join("\n");
  Swal.fire({
    icon: "warning",
    title: `Created ${created.length} of ${created.length + skipped.length} orders`,
    text: lines,
  });
} else {
  Swal.fire({
    icon: "success",
    title: `Created ${created.length} orders`,
  });
}
```

Do not toast Success when `skipped.length > 0`.

#### 2. Distance on the bulk table (optional but useful)

If list items include `total_distance`, add a column **Distance** next to delivery type: `{order.total_distance} km`. If missing, show `—` (same pattern as Issue 48 interval).

The table today has Order ID, Name, Sender address, Date, Delivery type, Action, Status — no drop-off, no km, no CSV row. Drop-off + trip number is **Issue 106**; do not block 101 on that.

#### 3. Do not parse the CSV in React to create orders

Keep `POST /order/orders/bulk`. Client-side parse is only for a debug count (“file has 4 data rows”) if you want; creation stays on the server.

**How to test**

1. Upload the same 4-row CSV Joey used (or the template with 4 drop-offs). Result: 4 orders, or 3 created + skip reason for the exact row.
2. Each order’s `total_cost` equals a single order with the same sender + drop-off.
3. Driver app shows km ≠ 0; `GET /order/:id` has `total_distance` > 0.
4. Admin warning lists skipped row + reason; no fake Success.

---

## Issue 106 — Bulk order details: trip number per trip

**Doc row:** `106` · Created 4 Aug 2026  
**Related:** 101 (create/price/km) and 107 (skip). This issue is **identity only** — which CSV trip became which order.

### Client

Joey, 04 Aug 2026:

> Bulk order details need to show which trip number goes with each trip so admins can track them

### Meaning (perfect solution)

A 4-row bulk CSV is four trips. After upload, admin must see **Trip 1, Trip 2, Trip 3, Trip 4** on the bulk list and on each order’s detail — not only database `#47` / `#50`.

If CSV row 3 is skipped (Issue 101/107), Trip 1 / 2 / 4 still keep those numbers. Do not renumber around the hole.

### Admin flow today

Page: Order Management → Bulk tab → eye icon → `/order/:id`  
Files: `src/components/OrderPlacement/BulkOrder/BulkOrderTable/BulkOrderTable.tsx`, `src/pages/Orders/ViewTrackOrder/ViewTrackOrder.tsx`, `src/pages/Orders/ViewTrackOrder/components/OrderForm.tsx`

Bulk table columns now: Order ID, Name, **Sender address**, Date, Delivery type, Action, Status. **No Trip #. No drop-off.**

Order detail shows `Order ID` = `#${order.id}` and pickup/drop addresses. No trip number.

The React app does not parse CSV rows, so it cannot invent trip numbers from the file. Table row index is also wrong once pagination exists.

### Live API (3 Nov 2026)

`GET /order/bulk` draft list is empty. Placed bulk jobs appear on live tracking with `isBulk: true` only.

Examples: order **47** and **50** — both `isBulk: true`, same sender (Daniel Tan, 10 Anson) and same drop-off (Sarah Lim, Orchard). No `tripNumber`, `csvRow`, or `bulkBatchId`. Admin cannot tell which CSV line each one is.

`GET /order/:id` keys include `isBulk`, `orderStops[].sequence` (PICKUP=1, DROP=2 inside **one** order). That sequence is stop order, not trip number across the batch.

---

### Backend — Issue 106

No new URL. Extend the existing bulk create + order GETs.

On `POST /api/v1/order/orders/bulk`, for every **created** order persist:

| Field | Type | Rule |
|---|---|---|
| `tripNumber` | integer | 1-based **CSV data-row** index (row 1 of data = Trip 1). Keep the number even if that row later fails elsewhere. Skipped rows do not shift later trips. |
| `bulkBatchId` | string or int | Same value for every order from this upload. UUID or auto id. |
| `csvRow` | integer | Optional; CSV line number including header (same as Issue 101 `created[].csvRow`). |

Also store the drop-off destination as today (RECEIVER / DROP stop). Trip number without drop-off is still hard to audit.

**Return on create** (extends Issue 101 `created[]`):

```json
{
  "csvRow": 2,
  "tripNumber": 1,
  "bulkBatchId": "bch_8f3a",
  "orderId": 501,
  "total_cost": "12.40",
  "total_distance": "8.2"
}
```

**Return on every order GET** — `GET /order/:id`, `GET /order/bulk`, `GET /order/web/live-order-tracking`, `GET /order/web/user-history`:

```json
{
  "id": 501,
  "isBulk": true,
  "tripNumber": 1,
  "bulkBatchId": "bch_8f3a",
  "total_distance": "8.2",
  "destinations": [],
  "orderStops": [
    { "type": "PICKUP", "sequence": 1, "address": "…" },
    { "type": "DROP", "sequence": 2, "address": "…" }
  ]
}
```

Non-bulk orders: `tripNumber` and `bulkBatchId` are `null`. Do not fake Trip 1.

Do not use `orderStops.sequence` as the trip number. That is stop order inside one job.

---

### Frontend — Issue 106

**Files**

| File | Change |
|---|---|
| `BulkOrderTable.tsx` | Columns **Trip #** and **Drop-off**; read `tripNumber` and DROP stop address |
| `OrderForm.tsx` | Read-only **Trip number** next to Order ID when `isBulk` |
| `OrderPending.tsx` | Optional “Trip No.” under Order No. |

#### 1. Bulk table

Add after ORDER ID:

- **TRIP #** — `Trip {order.tripNumber}` or `—` if null (same fallback pattern as Issue 48 interval).
- **DROP-OFF** — `orderStops` DROP / destinations RECEIVER address, truncated with title tooltip.

Do not number by `map` index. Do not use `order.id` as the trip number.

#### 2. Order detail

In General Order Details, if `initialData.isBulk && initialData.tripNumber`:

```tsx
<Label>Trip Number</Label>
<Input value={`Trip ${initialData.tripNumber}`} readOnly />
```

Keep Order ID as `#${id}`. Both are required: id is the system key, trip number is the CSV key.

#### 3. Optional batch grouping

If `bulkBatchId` is present, a small caption on the bulk tab is enough: `Batch bch_8f3a · 4 trips`. Do not block 106 on a new batch page.

**How to test**

1. Upload a 4-row CSV. List shows Trip 1–4 (or 1,2,4 if row 3 skipped) matching those drop-offs.
2. Open Trip 2 detail: Order ID is the db id, Trip Number is 2, drop-off is CSV row 2.
3. Live / history lists for those orders also return `tripNumber`.
4. A normal (non-bulk) order still has no trip number (`—`).

---

## Issue 109 — Reports KPI cards: date filter + click-through

**Doc row:** `109` · Created 14 Oct 2026 · Status `2Pending` · Joey

### Client

> The Reports & Analytics overview cards only show static total numbers. Clicking them does not display deeper insights or time-based trends.

Requirement:

1. **Global Date Filter** at the top: `[ Today | Month to Date (MTD) | Year to Date (YTD) | Custom Range ]`. Changing it updates **all** KPI card numbers instantly.
2. **Clickable KPI cards** with a detail view:
   - **Total Orders** — full order list, status distribution chart, volume over time
   - **Completed Orders** — completed list, peak completion times, popular service types
   - **Cancelled Orders** — cancellation-reason breakdown (e.g. “Changed my mind”, “Too expensive”) + cancelled list
   - **Disputed Orders** — active/resolved list, dispute reasons, resolution status
   - **Avg Rating** — 1–5 star distribution, driver/customer reviews
   - **Total Revenue** — revenue growth chart, payment method breakdown (Cash vs Online), earnings summary

### Meaning (perfect solution)

Overview numbers are for the selected date range, not all-time. Each card opens a detail pane/page for that metric, still using the same date range. Admin does not need to leave Reports to understand *why* the number is 177 / 41 / 34.

### Admin flow today

Page: **Reports & Analytics → Orders** (`/report-orders`)  
**Not** `/kpi` (that page is Avg Delivery Time / AOV / completion rate — different cards).

Files:

| File | Today |
|---|---|
| `src/pages/Reports/Orders/Orders.tsx` | `useGetReportAndAnalyticsStatsQuery("")` — **no date params**. `FilterSection` is **commented out**. |
| `src/pages/Reports/Orders/OverviewSection/OverViewSection.tsx` | Six cards, not clickable (`<div>`, no `onClick`, no link). |
| `src/pages/Reports/FilterSection/FilterSection.tsx` | Exists. Presets are Today / Yesterday / Last 7 / Last 30 / This Month / Custom — **not** Joey’s MTD / YTD list. |
| `src/redux/features/reportAndAnalytics/reportAndAnalyticsApi.ts` | `GET /report-and-analytics/stats` with no params. KPI page already sends `from`/`to` to a **different** URL: `/report-and-analytics/kpi-stats`. |

### Live API (3 Nov 2026)

```
GET /report-and-analytics/stats
→ totalOrder 195, completedOrder 48, cancelledOrder 37,
  disputedOrder 3, averageOrderRating 4.75, activeOrder 50, totalRevenue 1773.12
```

Same body with `?from=2026-10-01&to=2026-11-03` — **dates are ignored** (still 195 / 1773.12). That is why the cards look “static”.

`GET /report-and-analytics/kpi-stats?from=&to=` **does** respect dates (revenueByDay, topDrivers). Do not reuse that payload for these six overview cards; extend **stats**.

There is no detail/drill-down endpoint.

---

### Backend — Issue 109

Timezone for all presets: **Asia/Singapore**. Inclusive range.

#### 1. Date-aware overview (existing URL)

`GET /api/v1/report-and-analytics/stats`

Query (either style is fine; implement **both** so the admin can send presets without computing dates):

| Param | Values |
|---|---|
| `preset` | `TODAY` \| `MTD` \| `YTD` \| `CUSTOM` |
| `from` | ISO datetime, required when `preset=CUSTOM` |
| `to` | ISO datetime, required when `preset=CUSTOM` |

Preset windows (SGT):

- `TODAY` — today 00:00 → now
- `MTD` — 1st of current month 00:00 → now
- `YTD` — 1 Jan of current year 00:00 → now
- `CUSTOM` — `from`/`to` as given

Filter **orders** (and disputes/ratings/revenue derived from them) by `created_at` in that window, except:

- Completed card / detail: orders whose **completed** timestamp falls in the window
- Cancelled: **cancelled_at** in the window
- Disputed: dispute **created_at** in the window
- Rating: reviews **created** in the window
- Revenue: paid/completed `total_cost` in the window (same definition as today’s all-time `totalRevenue`, just dated)

If `preset` and dates are omitted, keep today’s all-time behaviour so old clients do not break — but the admin will always send a preset.

**Response** (same keys as now, plus echo of the range):

```json
{
  "success": true,
  "data": {
    "preset": "MTD",
    "from": "2026-11-01T00:00:00.000+08:00",
    "to": "2026-11-03T15:00:00.000+08:00",
    "totalOrder": 177,
    "completedOrder": 41,
    "cancelledOrder": 34,
    "disputedOrder": 3,
    "averageOrderRating": 4.8,
    "activeOrder": 50,
    "totalRevenue": 1595.67
  }
}
```

Changing Today → YTD must change these numbers. Live today they do not.

#### 2. Card detail (new, one family)

`GET /api/v1/report-and-analytics/stats/detail`

| Param | Values |
|---|---|
| `metric` | `ORDERS` \| `COMPLETED` \| `CANCELLED` \| `DISPUTED` \| `RATING` \| `REVENUE` |
| `preset` / `from` / `to` | same as overview |
| `page` / `limit` | for the list, default 1 / 20 |

**Shared envelope**

```json
{
  "success": true,
  "data": {
    "metric": "CANCELLED",
    "preset": "MTD",
    "from": "…",
    "to": "…",
    "summary": { "count": 34 },
    "charts": {},
    "list": { "data": [], "total": 34, "page": 1, "limit": 20 }
  }
}
```

**Per metric `charts` + `list` item**

| metric | `charts` | `list` rows |
|---|---|---|
| `ORDERS` | `statusDistribution: [{ status, count }]`, `volumeOverTime: [{ date, count }]` (daily in range; monthly if YTD) | `{ id, created_at, order_status, total_cost, delivery_type, user }` |
| `COMPLETED` | `peakHours: [{ hour: 0-23, count }]`, `serviceTypes: [{ name, count }]` | completed orders, include `completed_at` |
| `CANCELLED` | `reasons: [{ reason, count }]` — use `cancellation_reason`; empty/null → `"Unknown"` | cancelled orders + `cancellation_reason`, `cancelled_by`, `cancelled_at` |
| `DISPUTED` | `reasons: [{ reason, count }]`, `resolution: [{ status, count }]` (PENDING / RESOLVED / REJECTED / CLOSED) | dispute id, order id, status, reason, created_at |
| `RATING` | `stars: [{ star: 1-5, count }]` | review: order id, stars, comment, fromRole (`USER`/`DRIVER`), created_at |
| `REVENUE` | `growth: [{ date, amount }]`, `paymentMethods: [{ method, amount, count }]` (`COD` / `ONLINE_PAY` / `WALLET`) | orders that contribute to revenue: id, `total_cost`, `pay_type`, date |

`summary.count` (or `summary.amount` / `summary.average` for revenue and rating) must **match the overview card** for the same range.

Cancellation reasons are whatever the apps already store (`cancellation_reason` on the order). Do not invent Joey’s examples if the app sends different strings — chart whatever is saved.

Do not put this on `/report-and-analytics/kpi-stats`. That URL stays for the KPI page.

---

### Frontend — Issue 109

**Files**

| File | Change |
|---|---|
| `reportAndAnalyticsApi.ts` | Stats query takes `{ preset, from, to }`. Add `getReportStatsDetail` |
| `Orders.tsx` | Date state + FilterSection (uncomment / swap to Reports `FilterSection`) |
| `FilterSection.tsx` | Options **Today / MTD / YTD / Custom Range** (Joey’s four). Keep Custom from/to inputs |
| `OverViewSection.tsx` | Cards `button`/`onClick` → open detail |
| New: `src/pages/Reports/Orders/KpiDetail/` (or a drawer on the same page) | Charts + table from `stats/detail` |

Default preset: **MTD** (useful; Joey listed it second). Reset returns to MTD.

Date helper: copy the pattern in `src/pages/Reports/Kpis/Kpis.tsx` `getDateRange()`, but implement YTD (1 Jan → now) and drop Yesterday / Last 7 / Last 30 from **this** page. Do not change the KPI page’s own filter unless you want the same four presets there too (out of scope for 109).

#### 1. Filter wired to stats

```ts
const [preset, setPreset] = useState<"TODAY" | "MTD" | "YTD" | "CUSTOM">("MTD");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

const { data: reportStatsData } = useGetReportAndAnalyticsStatsQuery({
  preset,
  from: preset === "CUSTOM" ? fromDate : undefined,
  to: preset === "CUSTOM" ? toDate : undefined,
});
```

Selecting Today / MTD / YTD immediately refetches. Custom refetches when both dates are set. All six cards read the new `data`.

Revenue card: format as money (`$1,595.67`), not a raw integer. Today `toLocaleString()` drops cents.

#### 2. Clickable cards

`StatCard` becomes a `<button>` (keyboard + cursor). Click sets `activeMetric` and opens a panel **below the grid** (or a right drawer). Do not navigate away to `/order-list` as the only “detail” — Joey asked for charts on this page. A “View in Order List” link with the same date + status query is extra, not a substitute.

Panel title = card label + range (`Cancelled Orders · MTD`). Close returns to the grid with the filter unchanged.

Charts: reuse the same chart stack as Customer Report / KPI (`recharts` already in the repo) — bar for distributions, line for volume/revenue over time.

List: simple table, paginated from `list.total`. Row click may go to `/order/:id` or `/support/view/:id` for disputes.

Empty range: cards show `0` / `$0.00` / `—` for rating; detail shows empty charts + “No records in this range”.

**How to test**

1. `/report-orders`: default MTD numbers **differ** from all-time (live all-time is 195 orders / $1773.12).
2. Switch Today → YTD: all six cards change without refresh.
3. Custom range: both dates required; cards match that window.
4. Click each card: list + the charts named above, counts match the card.
5. `/kpi` still works with its own `kpi-stats` dates (do not break it).

---

## Shared changelog frontend (do once, covers 63 + 71)

File: `src/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable.tsx`

1. Resolve display action: `row.action`, unless it is generic `UPDATE` then `row.meta?.action` / `row.meta?.type`. Never show `verify_rider` or blank Update when a specific status exists.
2. Details = `row.description || row.meta?.reason || fallback`.
3. Filter values = uppercase API enums (`APPROVED`, `REJECTED`, `CLOSED`, `CREATE`, `UPDATE`, `DELETE`).
4. If `entityType === "Dispute"` (or `"rider_approval"` if you want Id on join requests too), add **entity id** + **View** columns.

Join request View path: `/join-request/${row.entity_id}`  
Dispute View path: `/support/view/${row.entity_id}`

---

## Work order

1. **Issue 48 backend** — persist + return + use `calculationIntervalMinutes`. Frontend: Interval column fallback to `—`.
2. **Issue 63 backend** — persist reason, notify, driver app status, changelog `APPROVED`/`REJECTED`. Frontend: uncomment filter; changelog labels + reason.
3. **Issue 71 backend** — reject+reason endpoint, changelog actions, custom amount persisted. Frontend: Reject modal on queue + detail; custom amount lock; dispute changelog columns.
4. **Issue 88 backend** — `POST /chat/conversations` upserts empty threads; `GET /chat/search`; enrich `otherUser`. Frontend: search box, `/dashboard-chat/:userId`, Message on User/Driver profile.
5. **Issue 92 frontend** — raise map offline threshold; InfoWindow with name/vehicle/phone. **Backend** — `admin:rider_location` includes name, phone, vehicle, unique `riderId` per driver; explicit offline / `gpsStatus`.
6. **Issue 101 backend** — bulk: no silent skip; same distance pricing as single order; persist `total_distance`. Frontend: show created vs skipped (row + reason). Row **107** is the same skip bug.
7. **Issue 106 backend** — persist `tripNumber` + `bulkBatchId` on bulk create; return on order GET/list. Frontend: Trip # and Drop-off on bulk table; Trip number on order detail.
8. **Issue 109 backend** — `/report-and-analytics/stats` respects Today/MTD/YTD/Custom; add `/report-and-analytics/stats/detail?metric=`. Frontend: date filter on `/report-orders`; clickable KPI cards with charts + list.

Frontend can be done in this same admin repo. Do not add a new verify or surge endpoint. New/extended APIs: Issue 71 reject, Issue 88 chat search (conversations POST already exists and must upsert). Issue 92 is the existing admin socket, not a new REST route. Issue 101 extends `POST /order/orders/bulk` response; do not add a second bulk URL. Issue 106 is fields on that same bulk create + order GET. Issue 109 extends `GET /report-and-analytics/stats` and adds `GET /report-and-analytics/stats/detail`.

---

## Checklist

### 48

- [ ] Backend saves and returns `calculationIntervalMinutes`
- [ ] Surge recalculates on that interval (default 5)
- [ ] Frontend Interval column shows API value or `—`
- [ ] `/user-dynamic-surge` untouched

### 63

- [ ] Backend saves `reason` on verify
- [ ] GET returns `rejectionReason` / `rejectedAt`
- [ ] Email/SMS sent from channel flags
- [ ] Changelog `action` + `meta.type` = APPROVED/REJECTED with reason
- [ ] Driver app after reject is Rejected, not Waiting
- [ ] Registration data kept
- [ ] Frontend: Pending/Rejected filter works
- [ ] Frontend changelog shows REJECTED + reason

### 71

- [ ] Reject API with required reason; status REJECTED
- [ ] Changelog APPROVED / REJECTED / CLOSED, with admin name and dispute id
- [ ] Custom `totalAmount` stored as refund amount
- [ ] Frontend Reject button + reason modal on queue and detail
- [ ] Frontend Full refund locks amount; Custom allows edit
- [ ] Frontend changelog: Dispute Id, Date, Action, Changed By, View

### 88

- [ ] `POST /chat/conversations` creates an empty thread if none exists
- [ ] `GET /chat/search?q=` matches username, name, phone for USER and DRIVER; returns `userId`
- [ ] Conversation `otherUser` includes name, username, phone, role
- [ ] Frontend: Service Chat search lists matches and starts a thread
- [ ] Frontend: `/dashboard-chat/:userId` opens that person
- [ ] Frontend: Message on User list, User profile, Driver list, Driver profile (uses `userId`, not raider id)
- [ ] Admin can send the first message; the other person does not need to write first
- [ ] Driver-app “contact admin” button is out of scope for this repo

### 92

- [ ] Frontend: `OFFLINE_THRESHOLD_MS` ≈ 45s (not 1s) so markers do not blink
- [ ] Two online cars stay **CAR (2)** without refresh
- [ ] Hover InfoWindow: Driver ID, Name, Vehicle Type, Contact Number
- [ ] Click marker still opens `/driver-list/:riderId`
- [ ] Socket payload includes `driver.name`, `driver.phone`, `vehicle_type.vehicle_name`, unique `riderId`
- [ ] Explicit offline (or `is_online: false`) removes the marker without a page refresh
- [ ] `gpsStatus: "LOST"` flags the driver instead of deleting them (app work for GPS-off / tunnel)

### 101 (and 107 skip)

- [ ] 4 CSV data rows → 4 orders, or skipped rows returned with `csvRow` + `reason`
- [ ] Partial upload is a warning, not a silent Success
- [ ] `total_cost` matches single-order pricing for sender → drop-off distance
- [ ] `total_distance` saved and returned; driver app km ≠ 0
- [ ] Frontend Swal lists created count and each skipped row
- [ ] Issue 107 closed by the same skip fix

### 106

- [ ] Bulk create stores `tripNumber` (CSV data-row, 1-based) and `bulkBatchId`
- [ ] Skipped CSV rows do not renumber later trips
- [ ] `GET /order/:id`, `GET /order/bulk`, live/history lists return those fields
- [ ] Non-bulk orders have `tripNumber` / `bulkBatchId` = null
- [ ] Bulk table: Trip # + Drop-off (not sender-only)
- [ ] Order detail shows Trip number next to Order ID for bulk jobs

### 109

- [ ] `GET /report-and-analytics/stats?preset=` changes all six numbers (Today / MTD / YTD / Custom)
- [ ] Live all-time totals are not returned when a preset is sent
- [ ] `GET /report-and-analytics/stats/detail?metric=` returns charts + paginated list; counts match the card
- [ ] `/report-orders` date dropdown is Today | MTD | YTD | Custom; cards update without refresh
- [ ] Each of the six cards opens a detail view (list + charts named in the doc)
- [ ] `/kpi` (`kpi-stats`) still works; do not reuse it for these overview cards
