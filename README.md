# 🚀 Performance Monitor

> A cloud-native performance monitoring platform with real-time analytics, multi-node management, and hardware optimization insights.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5.svg)](https://kubernetes.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Overview

**Performance Monitor** provides real-time system metrics (CPU, memory, network), historical analytics, and intelligent optimization recommendations. Built for modern cloud environments, it features a responsive dashboard, multi-node tracking, and production-ready infrastructure support.

## ✨ Key Features

- **Real-Time Dashboard**: Live monitoring of system resources and hardware stats (CPU temp, GPU).
- **Analytics & History**: 24-hour performance trends with smart gap handling.
- **Multi-Node Management**: Monitor multiple servers from a central interface.
- **Optimization**: AI-powered suggestions for resource scaling.
- **Infrastructure**: Docker & K8s ready, Terraform for AWS, Prometheus metrics.
- **Security**: Session auth, secure headers, and environment-based config.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, PostgreSQL, Redis, Winston, Joi.
- **Frontend**: Vanilla JS, Chart.js, Modern CSS.
- **DevOps**: Docker, Kubernetes, Terraform, AWS, GitHub Actions.

## 🚀 Quick Start (Docker)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/performance-monitor.git
    cd performance-monitor
    ```

2.  **Start services:**
    ```bash
    docker-compose up -d
    ```

3.  **Access:**
    -   **Dashboard**: `http://localhost:3000` (Login: `admin` / `admin`)
    -   **API**: `http://localhost:3000/api`


## ☁️ AWS Deployment

We provide a helper script to generate the necessary configuration files for AWS.

1.  **Configure:**
    ```bash
    ./scripts/configure-aws.sh
    ```
    This will interactively ask for your region and credentials, then generate `terraform.tfvars` and `kubernetes/secret.yaml`.

2.  **Deploy Infrastructure:**
    ```bash
    cd terraform
    terraform init
    terraform apply
    ```

3.  **Deploy App:**
    ```bash
    # Connect to the new cluster
    aws eks update-kubeconfig --name intel-cloud-cluster --region us-east-1
    
    # Deploy resources
    kubectl apply -f ../kubernetes/
    ```

## 📦 Local Development

1.  **Install dependencies**: `npm install`
2.  **Configure**: Copy `.env.example` to `.env` and set DB credentials.
3.  **Start DBs**: `docker-compose up -d postgres redis`
4.  **Run**: `npm run dev`
5.  **Test**: `npm test`

## ⚙️ Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Application port |
| `DB_HOST` | postgres | Database hostname |
| `REDIS_URL` | redis://redis:6379 | Redis connection string |
| `ADMIN_USERNAME` | admin | **Change in production** |
| `ADMIN_PASSWORD` | admin | **Change in production** |

## 📡 API Endpoints

-   **Auth**: `/api/v1/auth/login`, `/logout`, `/check`
-   **Performance**: `/api/v1/performance/metrics` (POST/GET), `/analyze`, `/benchmark`
-   **System**: `/api/v1/system/metrics`, `/process`
-   **Nodes**: `/api/v1/nodes` (CRUD operations)
-   **Health**: `/api/v1/health`, `/ready`, `/live` (K8s probes)

## 📁 Project Structure

```
performance-monitor/
├── src/                # Backend source (controllers, services, routes)
├── public/             # Frontend assets (HTML, CSS, JS)
├── kubernetes/         # K8s deployment manifests
├── terraform/          # AWS Infrastructure as Code
├── tests/              # Unit and integration tests
└── docker-compose.yml  # Local container orchestration
```

## 🤝 Contributing

Contributions are welcome! Open a PR or issue to suggest improvements.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.