# Smart Waste AI Dashboard 🗑️🤖

A next-generation, IoT-driven waste management system designed for urban efficiency. This dashboard uses real-time telemetry and AI analytics to predict overflow, optimize routes, and reduce environmental impact.

---

## 🌟 Key Features

- **Real-time Monitoring:** Track bin fill levels across multiple zones (e.g., Saibaba Colony, RS Puram) via an interactive IoT uplink.
- **Predictive Analytics:** AI-powered "Synaptic Hotzones" predict overflow probabilities with high accuracy using Groq-based statistical modeling.
- **Dynamic Route Optimization:** Intelligent scheduling for collection trucks based on live priority levels.
- **Sustainability Hub:** Track CO2 reduction and ROI on environmental impact initiatives.
- **Admin Control:** Comprehensive management of physical bin infrastructure and fleet operations.

## 🏗️ Architecture

### Frontend (User Interface)
- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for modern, responsive glassmorphism design.
- **Visualizations:** [Recharts](https://recharts.org/) for neural flow and predictive radar charts.
- **Mapping:** [React Leaflet](https://react-leaflet.js.org/) for real-time fleet tracking.
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend (AI & Logic Engine)
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI Integration:** [Groq Cloud API](https://groq.com/) for fast inference on predictive models.
- **Database:** Mock DB service with real-time simulation engine.
- **Utilities:** Pydantic for data validation and `python-dotenv` for configuration.

---

## 🚀 Setup & Installation

### Prerequisites
- **Python 3.8+**
- **Node.js 18+**
- **npm** or **yarn**



   ```


---

## 📂 Project Structure

```text
smart-waste-dashboard/
├── backend/
│   ├── main.py            # API Gateway & Entry Point
│   ├── routers/           # Domain-specific API Endpoints
│   ├── services/          # Business logic and Mock DB
│   ├── simulation/        # IoT Telemetry Simulator
│   └── models/            # Pydantic Schemas
├── frontend/
│   ├── src/
│   │   ├── pages/         # Dashboard, Analytics, Routes, Map
│   │   ├── components/    # Reusable UI widgets & AI Assistant
│   │   ├── lib/           # Utility functions (cn, etc.)
│   │   └── App.jsx        # Routing configuration
```

---

## 🌍 Impact
This project aims to reduce urban carbon footprints by streamlining waste collection logistics, potentially reducing truck fuel consumption by up to **42.8%** (projected ROI).

---
*Built with ❤️ for a Greener Future.*











1st terminal 

cd ai-smart-dustbin
cd backend
.\venv\scripts\activate
uvicorn main:app --reload


2nd terminal

cd ai-smart-dustbin
cd frontend
npm run dev

 Open the dashboard at `http://localhost:5173`.