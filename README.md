# Customer Churn Prediction Agent

An AI-powered customer analytics project that combines machine learning-based churn prediction with an LLM-powered customer-service agent to help businesses understand customer churn and improve customer retention.

### Main Use Case

The AI agent answers customer-service questions by retrieving relevant information from a knowledge base using ChromaDB and generating contextual responses through an LLM. Separately, the machine learning model predicts whether a customer is likely to churn based on customer data.

Combining these capabilities helps businesses identify customers at risk of leaving while providing an AI-powered interface for customer-service knowledge and support. Churn predictions can help prioritize retention efforts, while the agent helps users access relevant information more efficiently.

### Project Workflow

1. **Data Processing:** Clean and transform customer data into model-ready features.
2. **Churn Prediction:** Use a trained machine learning model to estimate customer churn risk.
3. **Knowledge Retrieval:** Retrieve relevant information from ChromaDB based on user questions.
4. **AI Agent Response:** Use LangChain and an LLM to generate contextual answers.
5. **API Integration:** Expose prediction and agent functionality through FastAPI.
6. **Pipeline Management:** Use Apache Airflow for workflow orchestration, MLflow for experiment tracking, and DVC for data versioning.

### Technologies Used

- **Python, Pandas, NumPy** — Data processing and analysis
- **Scikit-learn** — Machine learning and preprocessing
- **LangChain** — LLM integration and agent development
- **ChromaDB** — Vector storage and knowledge retrieval
- **FastAPI** — API development
- **Apache Airflow** — Workflow orchestration
- **MLflow** — Experiment tracking
- **DVC** — Data versioning
- **Docker** — Containerization
- **Render** — Deployment

### Project Links

- **Portfolio:** https://portfolio-ivory-three-55.vercel.app/
- **LinkedIn Project Post:** [View Project on LinkedIn](https://lnkd.in/p/g6tuGCxB)
