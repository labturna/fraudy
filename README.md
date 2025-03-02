# Fraudy - Fraud Detection & Notification System 🚨
Fraudy is a real-time fraud detection and alerting system built for monitoring Stellar blockchain transactions. It identifies suspicious activities such as double spending and high failure rates, storing fraudulent activity logs and notifying users through email, Slack, Telegram, and Discord.
# 🔹 Features

- ✅ Real-time transaction monitoring for Stellar accounts
- 🔄 Stores transactions in Redis before processing
- 🔍 Detects fraudulent activities, including:
* Double spending (Same sequence, different transactions)
* High failure rates (Excessive failed transactions)
* 🚀 Upcoming Features:
  - 🛑 Invalid Signatures (Detect transactions with forged signatures)
  - 🔁 Replay Attacks (Detect duplicate transactions)
  - 📊 Anomalous Volume (Detect unusually high transaction volumes)
  - 🆕 Suspicious New Accounts (Identify newly created accounts behaving abnormally)
- 📩 Sends alerts via:
  * Email
  * Slack
  * Telegram
  * Discord
 
📊 User-configurable notifications

🛠 Built with: Go, PostgreSQL, Redis, Stellar SDK

# 🛠 Tech Stack
- Backend: Go (Golang)
- Database: PostgreSQL
- Caching: Redis
- Blockchain API: Stellar Horizon API
- Message Queue: (Future Implementation)
- Deployment: Docker, Docker Compose

# 🔄 Future Improvements
- Add Webhook support for custom integrations
- Implement AI-based fraud detection
- Building a browser extension
- Introduce a front-end dashboard
