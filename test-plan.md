# MotoCare Maintenance Tracker - Test Plan

## Covered test cases

### Authentication - UI

1. Register with valid credentials succeeds.
2. Register with duplicate credentials is rejected.
3. Register with missing required fields is rejected.
4. Register with invalid email is rejected.
5. Register with invalid password is rejected.
6. Register cancel flow returns to login.
7. Login with valid credentials succeeds.
8. Login with unregistered credentials is rejected.
9. Login with missing email is rejected.
10. Login with missing password is rejected.
11. Login with invalid email is rejected.
12. Login with invalid password is rejected.
13. Successful login lands on the garage page.

### Garage / Bikes - UI

1. Empty garage state is shown when no bikes exist.
2. Add bike with valid data succeeds.
3. Add bike with missing required fields is rejected.
4. Add bike with invalid year is rejected.
5. Add bike with invalid odometer is rejected.
6. Edit bike with valid data succeeds.
7. Edit bike cancel flow keeps original data.
8. Edit bike with missing required fields is rejected.
9. Edit bike with invalid year is rejected.
10. Edit bike with invalid odometer is rejected.
11. Delete bike succeeds.
12. Deleting one bike does not affect another bike.

### Maintenance scheduling - UI

1. Open maintenance schedule modal succeeds.
2. Save maintenance schedule with valid data succeeds.
3. Save maintenance schedule with invalid values is rejected.
4. Cancel maintenance schedule flow keeps original state.
5. Maintenance schedule persists after page reload.
6. Maintenance schedule is isolated between maintenance items.
7. Maintenance schedule is isolated between bikes.

### Maintenance logging - UI

1. Open maintenance log modal succeeds.
2. Save maintenance log with valid data succeeds.
3. Save maintenance log with invalid values is rejected.
4. Cancel maintenance log flow keeps original state.
5. Maintenance log persists after page reload.
6. Newer maintenance log replaces the currently displayed log.
7. Maintenance log is isolated between maintenance items.
8. Maintenance log is isolated between bikes.

### Maintenance history - UI

1. Empty maintenance history state is shown when no logs exist.
2. Maintenance history updates after logging maintenance.
3. Maintenance history persists after page reload.
4. Maintenance history is isolated between bikes.

### Maintenance status - UI

1. Status counters are shown correctly when no maintenance logs exist.
2. On Track status is calculated correctly.
3. Due Soon by kilometers is calculated correctly.
4. Due Soon by days is calculated correctly.
5. Overdue by kilometers is calculated correctly.
6. Overdue by days is calculated correctly.
7. Maintenance status is isolated between bikes.

### Authentication - API

1. Register with valid credentials returns success.
2. Register with duplicate email is rejected.
3. Register with invalid email is rejected.
4. Register with missing email is rejected.
5. Register with missing password is rejected.
6. Register with short password is rejected.
7. Register with long password is rejected.
8. Login with valid credentials returns success.
9. Login with wrong password is rejected.
10. Login with non-existing email is rejected.
11. Login with missing email is rejected.
12. Login with missing password is rejected.

### Garage / Maintenance - API

1. Garage API test coverage exists.
2. Maintenance API test coverage exists.
