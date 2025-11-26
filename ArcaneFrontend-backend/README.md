# Arcane Backend (Spring Boot)

This is a minimal Spring Boot backend for the ArcaneFrontend project. It provides:

- /api/auth/register and /api/auth/login
- /api/products (list & details)
- /api/cart (get/add/delete) - authenticated
- /api/orders (create & list by user) - authenticated

Quick start
1. Create a MySQL database named `arcane_db` and update `src/main/resources/application.properties` with your DB credentials.
2. (Optional) replace `app.jwtSecret` in `application.properties` with a secure random key.
3. Build and run:

   mvn clean package
   java -jar target/arcane-backend-0.0.1-SNAPSHOT.jar

4. The frontend's `js/config.js` uses `http://localhost:8080/api` as the base URL by default.

Notes & assumptions
- This implementation uses JWT for stateless auth. The login endpoint returns `{ code:0, data: { token, userId } }` like the frontend expects.
- Passwords are stored hashed (BCrypt).
- The `data.sql` file inserts a few sample products on startup when `spring.jpa.hibernate.ddl-auto=update`.

Next steps / Improvements
- Add proper DTOs and validation for request payloads.
- Improve error handling and return consistent messages.
- Add unit tests and CI checks.
- Harden JWT secret storage (use env or vault) and rotate keys.

