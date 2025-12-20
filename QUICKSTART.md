# Quick Start Guide

Get the Intel Cloud Performance Service up and running in minutes!

## Option 1: Docker Compose (Recommended for Quick Start)

```bash
# 1. Navigate to project directory
cd cloud-project

# 2. Start all services
docker-compose up -d

# 3. Check if services are running
docker-compose ps

# 4. Test the API
curl http://localhost:3000/api/v1/health

# 5. View logs
docker-compose logs -f app
```

## Option 2: Local Development

### Prerequisites Setup

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Linux
   sudo apt-get install postgresql
   sudo systemctl start postgresql
   
   # Create database
   createdb performance_db
   ```

2. **Install Redis**
   ```bash
   # macOS
   brew install redis
   brew services start redis
   
   # Linux
   sudo apt-get install redis-server
   sudo systemctl start redis
   ```

3. **Install Node.js Dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env if needed (defaults should work for local)
   ```

5. **Start the Application**
   ```bash
   npm start
   ```

6. **Test the API**
   ```bash
   curl http://localhost:3000/api/v1/health
   ```

## Option 3: Kubernetes (Minikube)

### Prerequisites
- Minikube installed and running
- kubectl configured

```bash
# 1. Start Minikube
minikube start

# 2. Create secrets
kubectl create secret generic app-secrets \
  --from-literal=db-user=postgres \
  --from-literal=db-password=postgres

# 3. Apply configurations
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/postgres-deployment.yaml
kubectl apply -f kubernetes/redis-deployment.yaml
kubectl apply -f kubernetes/deployment.yaml

# 4. Check status
kubectl get pods
kubectl get services

# 5. Port forward to access locally
kubectl port-forward service/intel-cloud-performance-service 3000:80
```

## Testing the API

### Health Check
```bash
curl http://localhost:3000/api/v1/health
```

### Submit Performance Metrics
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

### Get Metrics
```bash
curl http://localhost:3000/api/v1/performance/metrics
```

### Run Benchmark
```bash
curl http://localhost:3000/api/v1/performance/benchmark
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env or docker-compose.yml
PORT=3001
```

### Database Connection Issues
- Ensure PostgreSQL is running
- Check credentials in .env file
- Verify database exists: `psql -l | grep performance_db`

### Redis Connection Issues
- Ensure Redis is running: `redis-cli ping`
- Check REDIS_URL in .env

### Docker Issues
```bash
# Clean up and restart
docker-compose down -v
docker-compose up -d
```

## Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Check [EXAMPLES.md](EXAMPLES.md) for more API usage examples
3. Explore the codebase structure
4. Set up CI/CD with GitHub Actions
5. Deploy to AWS using Terraform

## Project Highlights

✅ **Node.js REST API** - Express.js with clean architecture  
✅ **Docker** - Multi-stage builds, optimized images  
✅ **Kubernetes** - Production-ready deployments  
✅ **Terraform** - Complete AWS infrastructure  
✅ **CI/CD** - GitHub Actions pipeline  
✅ **PostgreSQL** - Relational database  
✅ **Redis** - Caching layer  
✅ **Health Checks** - Kubernetes probes  
✅ **Prometheus Metrics** - Monitoring ready  
✅ **Testing** - Jest test suite  

Perfect for demonstrating cloud-native development skills! 🚀

