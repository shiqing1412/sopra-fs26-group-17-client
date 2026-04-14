# Contributions

Every member has to complete at least 2 meaningful tasks per week, where a
single development task should have a granularity of 0.5-1 day. The completed
tasks have to be shown in the weekly TA meetings. You have one "Joker" to miss
one weekly TA meeting and another "Joker" to once skip continuous progress over
the remaining weeks of the course. Please note that you cannot make up for
"missed" continuous progress, but you can "work ahead" by completing twice the
amount of work in one week to skip progress on a subsequent week without using
your "Joker". Please communicate your planning **ahead of time**.

Note: If a team member fails to show continuous progress after using their
Joker, they will individually fail the overall course (unless there is a valid
reason).

**You MUST**:

- Have two meaningful contributions per week.

**You CAN**:

- Have more than one commit per contribution.
- Have more than two contributions per week.
- Link issues to contributions descriptions for better traceability.

**You CANNOT**:

- Link the same commit more than once.
- Use a commit authored by another GitHub user.

---

## Contributions Week 1 - [24 March] to [31 March]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@shiqing1412** | 29 March   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/9959ccdb206791d68c72ceca0d78b688e43456fd | add home page with hero section, navigation, and styled background  | we need a home page |
|                    | 29 March   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/8fceb8eab65a6e947b6dde474b064ec62e981e34 | implmented trip dashboard and create new trip UI | main function |
| **@julituchi** | 26 March   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/62438c56a3b3427c457952662ea3b3a5b17e6b85 | Add POST /users endpoint with username and password validation | without it, no one can register |
|                    | 28 March   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/e5694390c277126dd073caa38d41787a35739e8e | Hash password with BCrypt before persisting user | hashing with BCrypt ensures that even if the database is compromised, user passwords cannot be recovered |
|                    | 29 March   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/d9c3fb8fc07ec9925f19f734bd647ac3d559b1ab | Validate password and passwordConfirm match in POST /users | Prevents users from accidentally registering with a mistyped password |
| **@Raminminn** | 27 March   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/82c003b1bb361a505fd7e80b18d73d86c3501dbb | Created a register page with corresponding error messages and allows the user to register (fixes in later commits) | the user needs to create an account to be able to use the web-app |
|                    | 28 March   | https://github.com/shiqing1412/sopra-fs26-group-17-client/pull/18/changes/b599265511fff92402c7fd926b0067e913e38f18 | Added a basic page with the navigation bar at the top for the travel dashboard | We need the dashboard to display the user's trips and create a new trip |
|                    | 30 March   | https://github.com/shiqing1412/sopra-fs26-group-17-client/pull/42/changes/7fbc500aa8f9525723961db25d9aa8f9ab53fd47 | Added a column-style calendar overview for the days of the trip (fixes in later commits) | The user gets to have an overview of each day of the trip with events they can add into it |
| **@yarablaser** | 26 March   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/24df8a45aabed5af067a665fe0f9f8867e105b67 | login page UI, general style for login/registration | registered users should be able to log back in, as content is user-specific |  
|                    | 28 March   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/7712e928263adafc5d684b9bca70c499bd31c042 | login function & error handling | Without error messages, user won't know what went wrong during login |
|                    | 30 March   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/4bd8c5c136d9fe43d24c15adc89b986863ec5cc2 | logout button (different commit) & function | User should be able to log out of their private account |
|                    | 31 March   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/353beae1f85961fe24f6bd4c6866a88ce85f81e7 | option to go from trips/id back to trips page | User might want to switch between different trips |
| **@dsgji4g4** | 27 March  | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/364639ffc05befbbf995d851099729f8de3d3c76 | Update: POST /login endpoint, validate credentials, issue session token  | Basic login function is the gate for users to retrieve relevant info and acquire the right access. |
|                    | 27 March  | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/7356a9710ceb1a76307e16187a999b08f4aaa7b0 | POST /logout endpoint that invalidates session token | Flush and invalidate the token to ensure users' info won't be accessed after logout. |
|                    | 29 March   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/20ceb861bb290617f8966f849b344c7ad4aa0bc1 | Add POST trip endpoint | Set endpoints for one of the main features: create a trip |en | Flush and invalidate the token to ensure users' info won't be accessed after logout. |
|                    | 29 March   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/20ceb861bb290617f8966f849b344c7ad4aa0bc7  | Important feature: creating a trip |
|                    | 31 March  | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/3957e543e0eb778a1c784733f0442e02d8be5c12 | Persist trip with authenticated user as owner | Initialised the creator of the trip as the owner of the trip |
|                    | 31 March   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/8bda07b7fdcf279e721650a74e80a47077fc5b30 | Create initial membership for the creator | Implement Membership entity to realize our key feature- forming a group to plan the trip together |
|                    | 31 March   | https://github.com/shiqing1412/sopra-fs26-group-17-server/pull/87/changes/a468990800a4a3e1149ea47a71b2d1de85243e68 | Generate a unique share code for the trip | Members join the group via a unique share code generated when the trip is created |


---

## Contributions Week 2 - [1 April] to [14 April]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@shiqing1412** | 6 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/b59f16c6f44732c91fba910a7cbd1e65bd74b989 | UI for join a trip via a link | main user story |
|                    | 6 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/ed2063b55c6b8c494285e955cd87e6446de73508 | show already a member message if user is already in the trip | otherwise user will try to join repeatedly |
|                    | 6 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/3e12c59c2c90b5136d692fd68fa01e837411c6f4 | if not loged in, redirect to login and complete join after authentication  | required by user story |
|                    | 6 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/64e97abb6b16e7038f191ee9f142a9ab75b999af | call POST /trips/join/{joinToken} on confirm when logged in | required by user story |
| **@julituchi** | 7 April  | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/6d41b1778fca52fae76bbaf270947b8cd004d909 | Implements a GET /trips/{id}/events endpoint that returns trip events grouped by day, along with supporting entities, repositories, DTOs, and auto-login on registration | Enables clients to fetch a structured daily event schedule for a trip with proper authorization checks, while also streamlining the registration flow by making the token immediately usable |
|                    | 11 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/c979814840fb7aa64a76f9504410d27500759261 | Centralizes membership enforcement into a single checkMembership method in TripService, and updates TripController and EventService to use it | Eliminates duplicated authorization logic, making membership checks consistent and easier to maintain across all trip-related endpoints |
| **@Raminminn** | 5 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/237865674d24299ce4ed5dafd12199ff56dd3643 | Added a share link button which allows the user to copy the link to the trip to share with others | Allows users to join a trip via a link to co-edit a shared itinerary |
|                    | 14 April   | (https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/62b842ef56f0b9b786661e26ab02bbedb78d8b2b) | added online indicator for members | members of the trip are able to see who is co-editing/viewing the trip in real-time |
| **@yarablaser** | 03 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/8c1d5a126b2ab26985d9c2e64253bcb511c22a78 | adding protectedRoute component | preventing unauthorized access to user pages |
|                    | 03 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/254fc931471ea6b5234d8bffcebad24894c0093c | addStop modal UI | user can add an event to the trip  |
|                    | 06 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/fdfb2a2140237ca31878fb7514c74fa2692dbb9e | leaveTrip button and modal UI | user can leave a trip if they wish to no longer participate |
|                    | 06 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/36a8f5515bc77c65f8aca12c8ef16ce248ec4646 | add stops to the calendar | user can see daily events planned |
| **@dsgji4g4** | 2 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/d238235aafa2ff43cafc3802b64487ee623a3e71 | implemented the join function via a share link  | Key feature that binds users with a trip. New joiners are set to be "MEMBER". |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 3 - [15 April] to [21 April]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@shiqing1412** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@julituchi** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@Raminminn** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@yarablaser** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@dsgji4g4** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 4 - [start date] to [end date]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@shiqing1412** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@julituchi** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@Raminminn** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@yarablaser** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@dsgji4g4** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 5 - [start date] to [end date]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@shiqing1412** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@julituchi** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@Raminminn** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@yarablaser** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@dsgji4g4** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 6 - [start date] to [end date]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@shiqing1412** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@julituchi** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@Raminminn** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@yarablaser** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@dsgji4g4** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
