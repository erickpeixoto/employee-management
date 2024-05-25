# Fullstack Assessment

This project is a simple employee maintenance web application built as part of the Fullstack Assessment. It consists of a backend server and a frontend client to manage employees and departments. The following instructions outline the project setup, architecture, and how to run the application.

## Project Structure

This project is structured as a monorepo with the following main directories:

- **apps/**: Contains the client and server applications.
  - **client/**: The frontend application built with Next.js and React.
  - **server/**: The backend application built with NestJS.
- **packages/**: Contains shared configurations and libraries.
- **ts-contract/**: Contains TypeScript type definitions and API contracts.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 18)
- Bun (package manager, version 1.0.27 or higher)
- A database tool like SQLite, PostgreSQL, or MySQL (depending on your configuration)

### Installation

1. Clone the repository:
    ```bash
    git clone https://git.number8.com/erick.peixoto/fullstack-assesment.git
    cd fullstack-assessment
    ```

2. Install dependencies:
    ```bash
    bun install
    ```

3. Set up environment variables:
    Create a `.env` file in the root of the project with the following content (example for SQLite):
    ```env
    DATABASE_URL="file:./dev.db"
    ```

### Database Setup

The database setup and initial seeding are integrated into the development script. No additional steps are required.

### Running the Application

1. Start the backend server and frontend client:
    ```bash
    bun run dev
    ```

The backend server will start on `http://localhost:3535`, and the frontend client will start on `http://localhost:3000`.

### Running Tests

To run the tests, use the following commands:

- For unit tests:
    ```bash
    bun run test:cov
    ```

- For end-to-end tests:
    ```bash
    bun run test:e2e
    ```

![Unity Tests](apps/client/public/repo/unity-tests.png)

## Architecture

### Backend (Server)

The backend is built with NestJS and provides the following RESTful endpoints:

- `GET /api/employees/GetAllEmployees`
- `GET /api/employees/GetEmployeeById`
- `GET /api/employees/GetDepartmentHistory`
- `POST /api/employees/CreateEmployee`
- `PUT /api/employees/UpdateEmployee`
- `DELETE /api/employees/DeleteEmployee`
- `GET /api/departments/GetAllDepartments`

The backend also includes Swagger for API documentation, available at `http://localhost:3000/api`.

### Frontend (Client)

The frontend is built with Next.js and React. It provides a user interface to manage employees and departments, including features like:

- Viewing the list of employees
- Creating a new employee
- Viewing employee details
- Updating employee department
- Deactivating/activating employees
- Deleting employees
- Viewing department change history

## Key Features

- **Employee List Page**: Displays a list of employees with their details. Users can view, update, deactivate, and delete employees from this page.
- **Employee Details View**: Provides detailed information about an employee, including a dropdown to change the department, a deactivate button, and a department history table.
- **Confirm Delete Modal**: A modal to confirm the deletion of an employee, ensuring that users do not accidentally delete records.
- **Smart UI Patterns**: Ensures maintainable and legible code with a focus on good code design and architecture.

## Design Patterns and Best Practices

- **Component-Based Architecture**: The frontend is built with reusable components for maintainability.
- **API Contracts**: TypeScript contracts ensure type safety and consistency between the frontend and backend.
- **State Management**: React Query is used for data fetching and state management.
- **Responsive Design**: The UI is responsive and works well on different screen sizes.

## Packages and Libraries

### Client

- Next.js
- React
- React Hook Form
- React Query
- Tailwind CSS
- NextUI
- Date-fns

### Server

- NestJS
- Prisma
- Swagger
- Zod

### Shared

- TypeScript
- Zod

## Conclusion

This project demonstrates a fullstack application with a focus on maintainable and scalable code. The architecture follows best practices and modern development methodologies, ensuring a solid foundation for future development.

---

### Links

- **Coverage Tests**: [Coverage Report](http://localhost:3535/coverage)
- **Swagger**: [API Documentation](http://localhost:3535/api)
- **Frontend**: [Frontend Application](http://localhost:3000)
