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
|                    | 14 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/88ff65a7688053eb7270e782e3142208c4b55473| add delete button to event view modal | required by user story 9|
|                    | 14 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/849b0a30885a48fad9e3ff70602a8243f79f01ef | add confirmation dialogue before event deletion | required by user story 9|
|                    | 14 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/781cabcb040c87cd64ed8d0ecee5f585749a8d4d | api call to remove event from calendar on confirmation | required by user story 9|
| **@julituchi** | 7 April  | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/6d41b1778fca52fae76bbaf270947b8cd004d909 | Implements a GET /trips/{id}/events endpoint that returns trip events grouped by day, along with supporting entities, repositories, DTOs, and auto-login on registration | Enables clients to fetch a structured daily event schedule for a trip with proper authorization checks, while also streamlining the registration flow by making the token immediately usable |
|                    | 11 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/c979814840fb7aa64a76f9504410d27500759261 | Centralizes membership enforcement into a single checkMembership method in TripService, and updates TripController and EventService to use it | Eliminates duplicated authorization logic, making membership checks consistent and easier to maintain across all trip-related endpoints |
| **@Raminminn** | 5 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/237865674d24299ce4ed5dafd12199ff56dd3643 | Added a share link button which allows the user to copy the link to the trip to share with others | Allows users to join a trip via a link to co-edit a shared itinerary |
|                    | 14 April   | (https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/62b842ef56f0b9b786661e26ab02bbedb78d8b2b) | added online indicator for members | members of the trip are able to see who is co-editing/viewing the trip in real-time |
|                    | 14 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/4f15cfc53ef58b17bbb9099dda378af523e2c067 | added number of members in trip | allows you to see how many people are participating in the trip |
| **@yarablaser** | 03 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/8c1d5a126b2ab26985d9c2e64253bcb511c22a78 | adding protectedRoute component | preventing unauthorized access to user pages |
|                    | 03 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/254fc931471ea6b5234d8bffcebad24894c0093c | addStop modal UI | user can add an event to the trip  |
|                    | 06 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/fdfb2a2140237ca31878fb7514c74fa2692dbb9e | leaveTrip button and modal UI | user can leave a trip if they wish to no longer participate |
|                    | 06 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/36a8f5515bc77c65f8aca12c8ef16ce248ec4646 | add stops to the calendar | user can see daily events planned |
|                    | 12 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/634b58b9750099d7201c1a118e5c03fab1d4720d | connecting google places API | user can search for real places/restaurants/attractions to plan trip destinations |
|                    | 13 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/ba992801d56d5ef80e7d491e9625de45b773a3c5 | view stop modal | user can see stop details and then choose to edit/delete from there |
| **@dsgji4g4** | 2 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/d238235aafa2ff43cafc3802b64487ee623a3e71 | implemented the join function via a share link  | Key feature that binds users with a trip. New joiners are set to be "MEMBER". |

---

## Contributions Week 3 - [15 April] to [21 April]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@shiqing1412** | 21 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/e3937540a0c1b963c79ba89afca1d8a9f9e458d2 | fix share link join for unauthenticated users and direct navigation | Before the fix it would throw an error |
|                    | 21 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/b7fdf6df0e1ef2d6fd8a8af87ee4b0562a39e5f7 | fix member and avatar diaplay of a trip | Before the fix the member always shows 0
|                    | 16 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/4ffa42b27d812373be80cf94d0f822644fdedaa6 | integration with backend - Post Events | we need persistence layer  for events|
|                    | 16 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/cec1644bd9a4206150f27b9302d8254ad00a025b | integration with backend - Get Events  | we need persistence layer  for events |
| **@julituchi** | 16 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/4b3fc25cbe7fd8c58cda81a336c6c93747faa317 | Implements the ability for trip members to create events with Google Places location data via a new validated and authorized POST endpoint. | This is relevant because it ensures authorized users can add consistent, location-aware events within a trip |
|                    | 16 April  | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/577b4847fedb2fa77d1c4b5e70442dedb485b6fc | Adds input validation to the event creation flow to ensure all required fields are present and valid | It prevents incomplete or invalid data from being stored. |
|                    | 20 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/93fe0c5bb6547e6a75ac117c63077b26b72f7a51 | Adds unit tests for EventService, covering all public methods and private validation helpers | Test coverage, helped in finding a bug in the code |
| **@Raminminn** | 16 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/c5000d00d67d8c026c7726626c6dd3a0b81e53ec | event cards in chronological order and avatar of person who created the event | better overview of all events in the itinerary as it's sorted by time. allows members to see who created the trip for better organization. |
|                    | 21 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/pull/116/changes/d488f440297a3b3b43449d27eb4822748e8a6de1 | pool trip page every 5 sec | for automatic updating the page for the real-time aspect |
|                    | 21 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/pull/116/changes/1248d0f02cb9d8973c33fa0bede161c17e625d7a | ensures updating without disrupting open modals | to not delete open modals by accident when polling |
| **@yarablaser** | 17 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/627ea867f96c80c8c3aaa5ecae9812b27dc217d4 | edit stop modal | user can edit previously created stops |
|                    | 17 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/63d5a1ce3e743282c8ae52834495b94690958585 | StopModal component | easier overview over the different stop modals since UI is quite similar |
|                    | 17 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/49d8ff098584b03ec173012004acc683bb30a040 | view stop modal | different modal than edit modal for easier distinction // allows user to view details and decide to delete/edit stop |
| **@dsgji4g4** | 16 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/90ce257a62108b3aa6d54aec01ee6bb175496251 | Implement "edit an event" function | Critical function |
|                    | 16 April  | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/7f575a905f40d6526f27a858828dcccda88813be | Implement "delete an event" function | Critical function |
|                    | 19 April  | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/7f575a905f40d6526f27a858828dcccda88813be | UserServiceTest | Create tests to en hance robustness of UserService |
|                    | 20 April  | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/7f575a905f40d6526f27a858828dcccda88813be | TripServiceTest | Create tests to enhance robustness of TestService |

---

## Contributions Week 4 - [22 April] to [28 April]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@shiqing1412** | 20 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/33b02736a801e2e585f90bc1850d361f6f6b15d5 | Add TripServiceIntegrationTest | improve test coverage for M3|
|                    | 20 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/5674ed4f2dd8e941900ace3bfc5dd0ae401bca09 | Add TripControllerTest | improve test coverage for M3 |
| **@julituchi** | 28 April  | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/e95fbe720013d28c1e3f09e2ecac4ffed31ca3ec | Adds endTime to events, enforces time and endTime as required fields on event creation and update, adds method for detecting overlapping events | To have a way to detect overlapping events. |
|                    | 23 April  | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/d64672292cf311142dc8f81dda0646b569254221 | Optimises GET /trips/{tripId}/events to be safe for 5-second polling by adding HTTP ETag-based conditional responses and removing redundant logic | Optimisation. |
| **@Raminminn** | 27 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/d8d0e66a19e0505b91e172efc79353731b958763 | added left panel in trip/id page | needed to add a map overview and list of members later on |
|                    | 28 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/efbb82f109345a07fea8f59995844587335cce3c | display list of members that are part of the trip | to get an overview of all the people that are in the trip and not only the ones that are online |
| **@yarablaser** | 28 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/1e5501bebebe22cbcfff910f85ff9983722f02ad | added map to itinerary | will be able to visually show locations of stops |
|                    | 28 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/631148efd3825f7f2252d87572a204e5498ccef1 | stop markers | user can see where on the map the stops take place |
|                    | 28 April   | https://github.com/shiqing1412/sopra-fs26-group-17-client/commit/d3cb36836651efee457ec4a4503678f9c3db8750 | highlight stops when clicking on a pin | user can see which event was planned for a specific location |
| **@dsgji4g4** | 28 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/c7ec4125155f2a6ace50274f4316621dd9bab9f1 | Track member last seen timestamp for trip presence | Start to implement presence indicator |
|                    | 28 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/f5c70915c9ccf5e702ad7e2ed8bd611446372858 | Update EventService| To track members' presence, need to do modifications for membership-based validation and fix related failures |

---

## Contributions Week 5 - [29 April] to [5 May]

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
| **@dsgji4g4** | 29 April   | https://github.com/shiqing1412/sopra-fs26-group-17-server/commit/5bd946f6d3806781a51c4b7e4c4c61eb0c4386d0 | Finalize trip-level presence tracking | Key feature. Enables users to view recent active members  |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 6 - [6 May] to [12 May]

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
