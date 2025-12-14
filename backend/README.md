# Mini ERP Stock - Backend

The robust Python/Django backend for the Mini ERP Stock application. It serves a RESTful API to manage inventory data and handles business logic.

🔗 **Frontend Repository:** You can find the corresponding React frontend here: [erp-stock-frontend](https://github.com/Evedbs/erp-stock-frontend)

## 🚀 Tech Stack
- **Framework:** Django 5+
- **API Toolkit:** Django REST Framework (DRF)
- **Database:** PostgreSQL
- **Language:** Python 3.10+

## ✨ Features
- **RESTful API:** Full CRUD endpoints for Products management.
- **Database Model:** Structured data with SKU, name, price, and stock quantity.
- **Admin Panel:** Built-in back-office for superuser management.
- **CORS Config:** Configured to communicate securely with the React frontend.

## 🛠️ Setup & Installation

### 1. Prerequisites
- Python installed.
- PostgreSQL installed and running.
- A created database named `minierp_db`.

### 2. Clone and Setup Environment

```bash
# Clone the repository
git clone [https://github.com/Evedbs/erp-stock-backend.git](https://github.com/Evedbs/erp-stock-backend.git)
cd erp-stock-backend

# Create Virtual Environment
python3 -m venv env

# Activate Virtual Environment
# On Mac/Linux:
source env/bin/activate
# On Windows:
# env\Scripts\activate