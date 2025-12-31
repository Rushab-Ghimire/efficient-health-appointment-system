# Efficient Health Appointment System

 <!-- Optional: Replace with a GIF of your app in action -->

An advanced, full-stack web application designed to streamline the process of booking and managing medical appointments. The system features a modern React frontend for a seamless user experience and a powerful Django backend with a REST API to handle all business logic, data, and AI-powered features.

---

## ✨ Core Features

This project is a comprehensive solution with distinct functionalities for patients, doctors, and administrators.

### For Patients:
- **Secure User Authentication:** Sign up and log in using either a username or email.
- **Doctor Discovery:** Browse and filter a list of available doctors by specialization.
- **AI-Powered Recommendations:** Describe symptoms in natural language to get intelligent recommendations for the right type of specialist, powered by semantic search.
- **Smart Appointment Booking:** Select a date and time from a dynamic calendar that shows real-time availability and disables booked or past slots.
- **Automated SMS Confirmations:** Receive instant appointment confirmation via SMS upon successful booking (integrated with Infobip/Twilio).
- **Appointment Management:** View a list of upcoming and past appointments, with the ability to cancel upcoming ones.
- **Profile Management:** View and update personal profile information.
- **Campus Navigation:** A static, interactive map to guide patients from the main entrance to the correct hospital building and ward for their appointment.

### For Doctors:
- **Dedicated Dashboard:** A private dashboard showing key statistics like today's appointments and total patients.
- **Schedule Management:** View a comprehensive list of all upcoming and past appointments.
- **Patient Notes:** Add and edit clinical notes for each completed appointment, creating a patient history.

### For Administrators:
- **Full-Featured Admin Panel:** A secure Django Admin interface to manage all users, doctors, and appointments.
- **Role Management:** Ability to assign roles (Patient, Doctor, Admin) to users.
- **Automated System Tasks:**
    - **No-Show Detection:** A management command to automatically scan for past, scheduled appointments and mark them as "No-Show".
    - **Appointment Reminders:** A scheduled command to send morning and 30-minute reminders to patients via SMS.

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Django & Django Rest Framework
- **Database:** PostgreSQL (with SQLite for development)
- **Authentication:** Token-based Authentication (DRF Authtoken)
- **AI / NLP:**
    - **Embeddings:** Hugging Face Sentence Transformers (`multi-qa-MiniLM-L6-cos-v1`)
    - **Vector Database:** Pinecone
    - **Orchestration:** LangChain
- **SMS Notifications:** Infobip (or Twilio)
- **Deployment:** Gunicorn & Nginx

### Frontend
- **Framework:** React
- **Routing:** React Router
- **API Communication:** Axios
- **Styling:** Tailwind CSS
- **UI Components:** `react-datepicker`, `lucide-react` icons

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- Python (3.10+)
- Node.js and npm
- PostgreSQL

### 1. Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://your-github-repository-link.git](https://your-github-repository-link.git)
    cd efficient-health-appointment-system/backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    # On Windows
    .\venv\Scripts\activate
    # On Mac/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up the PostgreSQL Database:**
    - Open `psql` and create a user and database:
      ```sql
      CREATE USER health_user WITH PASSWORD 'your_password';
      CREATE DATABASE health_db OWNER health_user;
      ```

5.  **Configure Environment Variables:**
    - Create a `.env` file in the `backend/` directory.
    - Copy the contents of `.env.example` (if it exists) or use the template below and fill in your credentials.
      ```
      SECRET_KEY=your_django_secret_key
      DEBUG=True
      DB_NAME=health_db
      DB_USER=health_user
      DB_PASSWORD=your_password
      DB_HOST=localhost
      DB_PORT=5432
      INFOBIP_BASE_URL=...
      INFOBIP_API_KEY=...
      INFOBIP_SENDER_ID=...
      PINECONE_API_KEY=...
      PINECONE_ENVIRONMENT=...
      ```

6.  **Run Database Migrations:**
    ```bash
    python manage.py migrate
    ```

7.  **Create an Admin Superuser:**
    ```bash
    python manage.py createsuperuser
    ```
    (Follow the prompts, using an email address for the login)

8.  **Run the Backend Server:**
    ```bash
    python manage.py runserver
    ```
    The backend will be running at `http://127.0.0.1:8000`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    # Open a new terminal
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    - Create a `.env` file in the `frontend/` directory.
    - Add the following line:
      ```
      REACT_APP_API_URL=http://127.0.0.1:8000
      ```

4.  **Run the Frontend Server:**
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

---

## 🤖 AI Feature Setup

To enable the AI Doctor Recommendation feature, you must populate the Pinecone vector database.

1.  **Set up a Pinecone account** and create an index with **384 dimensions** and the `cosine` metric.
2.  Add your `PINECONE_API_KEY` and `PINECONE_ENVIRONMENT` to the `backend/.env` file.
3.  Run the upsert script **once** to populate the index:
    ```bash
    # In the backend terminal (with venv activated)
    python upsert_pinecone.py
    ```
    All future updates to the doctor data will be synced automatically via Django Signals.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page]([https://your-github-repo-link/issues](https://your-github-repo-link/issues)) if you want to contribute.

---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
