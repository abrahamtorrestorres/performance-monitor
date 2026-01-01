# 🚀 Performance Monitor

> A production-ready, cloud-native performance monitoring and optimization platform with real-time dashboards, multi-node management, and comprehensive hardware analytics.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5.svg)](https://kubernetes.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

**Performance Monitor** is a comprehensive cloud-native performance monitoring and optimization service designed for modern cloud environments. It provides real-time system metrics, historical performance analytics, multi-node management, and intelligent optimization recommendations.

Originally developed as a demonstration project for Intel Cloud Internship, this project showcases expertise in:
- Cloud-native development (AWS, Kubernetes, Docker)
- RESTful API design and implementation
- Infrastructure as Code (Terraform)
- DevOps practices (CI/CD, containerization)
- Real-time data visualization
- Hardware-software integration

## ✨ Features

### 🖥️ Real-Time Monitoring Dashboard
- **Live System Metrics**: CPU, memory, storage, bandwidth monitoring
- **Interactive Charts**: Hourly performance history and real-time 5-minute windows
- **Hardware Information**: CPU name, GPU detection, temperature monitoring, OS details
- **Multi-Node Management**: Add, edit, and monitor multiple server nodes
- **Analytics & Reports**: Detailed performance analytics with historical insights

### 📊 Performance Analytics
- **Historical Data Visualization**: 24-hour hourly performance charts
- **Real-Time Performance Tracking**: Last 5 minutes with 30-second intervals
- **Smart Gap Handling**: Automatic interpolation and empty data trimming
- **Performance Statistics**: Average CPU, peak memory, total requests, uptime tracking

### 🔐 Security & Authentication
- **Session-Based Authentication**: Secure login system
- **Environment-Based Credentials**: Configurable via environment variables
- **Production-Ready Security**: No hardcoded credentials, proper secrets management

### 🏗️ Infrastructure
- **Docker Support**: Multi-stage builds, optimized images
- **Kubernetes Ready**: Complete K8s manifests with health probes
- **Terraform IaC**: Automated AWS infrastructure provisioning
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment

### 🔧 Advanced Features
- **Auto-Node Registration**: Automatically detects and registers local system
- **Real-Time Metrics Collection**: Automatic database persistence every 30 seconds
- **Performance Benchmarking**: Built-in CPU and memory stress tests
- **Optimization Recommendations**: AI-powered performance suggestions
- **Prometheus Metrics**: Expose metrics in Prometheus format

## 🖼️ Screenshots

### Dashboard Overview
- Real-time system metrics with live updates
- Interactive performance charts
- Hardware information display
- Multi-node status monitoring

### Analytics Page
- Historical performance trends
- Real-time performance tracking
- Statistical summaries
- Detailed insights

## 🛠️ Tech Stack

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Redis** - Caching layer
- **Winston** - Logging
- **Joi** - Input validation
- **Prometheus Client** - Metrics export

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js** - Data visualization
- **Modern CSS** - Responsive design with animations
- **Session Storage** - Client-side session management

### DevOps & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development
- **Kubernetes** - Container orchestration
- **Terraform** - Infrastructure as Code
- **AWS** - Cloud platform (VPC, RDS, ElastiCache, ECR)
- **GitHub Actions** - CI/CD automation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose
- (Optional) Kubernetes cluster
- (Optional) Terraform 1.0+ for AWS deployment

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/performance-monitor.git
cd performance-monitor
```

### 2. Start with Docker Compose

```bash
docker-compose up -d
```

The application will be available at:
- **Dashboard**: http://localhost:3000
- **API**: http://localhost:3000/api/v1

### 3. Login

Default credentials (development only):
- Username: `admin`
- Password: `admin`

**⚠️ IMPORTANT**: Change these credentials in production!

## 📦 Installation

### Local Development (without Docker)

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start PostgreSQL and Redis (or use Docker Compose for just these)
docker-compose up -d postgres redis

# Run the application
npm start
```

### Docker Installation

```bash
# Build the image
docker build -t performance-monitor:latest .

# Run the container
docker run -p 3000:3000 \
  -e DB_HOST=localhost \
  -e DB_PASSWORD=postgres \
  -e REDIS_URL=redis://localhost:6379 \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=your-secure-password \
  performance-monitor:latest
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file (or set environment variables):

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=performance_db
DB_USER=postgres
DB_PASSWORD=postgres

# Redis Configuration
REDIS_URL=redis://redis:6379

# Authentication (REQUIRED - Change in production!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

### Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong passwords** - Generate secure passwords for production
3. **Use secrets management** - Kubernetes Secrets, AWS Secrets Manager, etc.
4. **Rotate credentials regularly** - Change passwords periodically

## 📖 Usage

### Accessing the Dashboard

1. Navigate to http://localhost:3000
2. Login with your credentials
3. Explore the dashboard:
   - **Dashboard**: Real-time metrics and charts
   - **Nodes**: Manage server nodes
   - **Analytics**: Historical performance data
   - **Settings**: Configure update intervals

### API Usage

#### Authentication

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

#### Submit Performance Metrics

```bash
curl -X POST http://localhost:3000/api/v1/performance/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "cpuUsage": 45.5,
    "memoryUsage": 62.3,
    "networkThroughput": 1000.5,
    "latency": 25.2
  }'
```

#### Get Metrics

```bash
curl http://localhost:3000/api/v1/performance/metrics?limit=10
```

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | User logout |
| GET | `/api/v1/auth/check` | Check authentication status |

### Performance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/performance/metrics` | Submit performance metrics |
| GET | `/api/v1/performance/metrics` | Get metrics (with filters) |
| GET | `/api/v1/performance/metrics/:id` | Get specific metric |
| POST | `/api/v1/performance/analyze` | Analyze performance |
| GET | `/api/v1/performance/optimization` | Get optimization recommendations |
| GET | `/api/v1/performance/benchmark` | Run benchmark test |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/system/metrics` | Get real-time system metrics |
| POST | `/api/v1/system/collect` | Save system metrics to database |
| GET | `/api/v1/system/process` | Get process-specific metrics |

### Node Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/nodes` | List all nodes |
| POST | `/api/v1/nodes` | Add a new node |
| GET | `/api/v1/nodes/:id` | Get node details |
| PUT | `/api/v1/nodes/:id` | Update node |
| DELETE | `/api/v1/nodes/:id` | Delete node |
| GET | `/api/v1/nodes/:id/status` | Check node status |

### Health Check Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Overall health status |
| GET | `/api/v1/health/ready` | Kubernetes readiness probe |
| GET | `/api/v1/health/live` | Kubernetes liveness probe |

### Metrics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/metrics` | Prometheus metrics |

## 🐳 Deployment

### Docker Compose (Recommended for Local)

```bash
docker-compose up -d
```

### Kubernetes Deployment

```bash
# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=db-password=your-password \
  --from-literal=admin-username=admin \
  --from-literal=admin-password=your-password

# Apply configurations
kubectl apply -f kubernetes/
```

### AWS Deployment with Terraform

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Load Balancer (AWS)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┴───────────────────┐
        │                                      │
┌───────▼────────┐                   ┌────────▼────────┐
│  Kubernetes    │                   │   Kubernetes    │
│  Service (3x)  │                   │   Service (3x)  │
└───────┬────────┘                   └─────────┬───────┘
        │                                      │
        │         ┌──────────────────┐         │
        └────────►│  PostgreSQL RDS  │◄────────┘
        │         └──────────────────┘
        │
        │         ┌───────────────────┐
        └────────►│ Redis ElastiCache │
                  └───────────────────┘
```

### Component Overview

- **Frontend Dashboard**: Single-page application with real-time updates
- **REST API**: Express.js backend with comprehensive endpoints
- **Database**: PostgreSQL for persistent metric storage
- **Cache**: Redis for performance optimization
- **Monitoring**: Prometheus metrics and health checks
- **Infrastructure**: Terraform for AWS resource provisioning

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Development mode with auto-reload
npm run dev
```

## 📁 Project Structure

```
performance-monitor/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── config/           # Database, Redis config
│   ├── middleware/       # Validation, etc.
│   ├── utils/            # Logger, helpers, auto-registration
│   └── server.js         # Application entry point
├── public/
│   └── index.html        # Dashboard UI
├── kubernetes/           # K8s manifests
├── terraform/            # Infrastructure as Code
├── .github/workflows/    # CI/CD pipelines
├── Dockerfile            # Container definition
├── docker-compose.yml    # Local development
├── package.json          # Dependencies
└── README.md            # This file
```

## 🎓 Learning Outcomes

This project demonstrates:

1. **Cloud-Native Development**: Building applications for cloud environments
2. **Containerization**: Docker best practices and multi-stage builds
3. **Orchestration**: Kubernetes deployments, services, and health probes
4. **Infrastructure as Code**: Terraform for reproducible infrastructure
5. **CI/CD**: Automated testing, building, and deployment
6. **REST API Design**: Well-structured, documented APIs
7. **Real-Time Dashboards**: Interactive data visualization
8. **Database Integration**: PostgreSQL with connection pooling
9. **Caching Strategies**: Redis for performance optimization
10. **Security**: Best practices for container and cloud security

## 🔮 Future Enhancements

- [ ] JWT-based authentication
- [ ] User management and roles
- [ ] Rate limiting
- [ ] GraphQL API option
- [ ] Intel hardware monitoring API integration
- [ ] AI/ML workload optimization recommendations
- [ ] Distributed tracing
- [ ] Advanced alerting system
- [ ] Multi-cloud provider support
- [ ] Mobile app support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

Created as a demonstration project showcasing cloud-native development skills and best practices.

## 🙏 Acknowledgments

- Demonstrates expertise in cloud platforms, containerization, and DevOps
- Showcases modern web development practices

---

**⭐ If you find this project useful, please consider giving it a star!**
