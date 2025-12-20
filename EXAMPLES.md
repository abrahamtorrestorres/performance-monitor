# API Usage Examples

## Health Check Examples

### Basic Health Check
```bash
curl http://localhost:3000/api/v1/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Database connection successful"
    },
    "redis": {
      "status": "healthy",
      "message": "Redis connection successful"
    },
    "memory": {
      "status": "healthy",
      "used": "45.23 MB",
      "total": "128.00 MB",
      "percentage": "35.33%"
    }
  }
}
```

## Performance Metrics Examples

### Submit Performance Metrics
```bash
curl -X POST http://localhost:3000/api/v1/performance/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "cpuUsage": 45.5,
    "memoryUsage": 62.3,
    "networkThroughput": 1000.5,
    "latency": 25.2,
    "metadata": {
      "type": "system",
      "instance": "web-server-1",
      "region": "us-east-1"
    }
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "cpu_usage": 45.5,
    "memory_usage": 62.3,
    "network_throughput": 1000.5,
    "latency": 25.2,
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "message": "Performance metrics saved successfully"
}
```

### Get Metrics with Filters
```bash
curl "http://localhost:3000/api/v1/performance/metrics?startDate=2024-01-01&endDate=2024-01-31&limit=50"
```

### Get Specific Metric
```bash
curl http://localhost:3000/api/v1/performance/metrics/550e8400-e29b-41d4-a716-446655440000
```

### Analyze Performance
```bash
curl -X POST http://localhost:3000/api/v1/performance/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "cpuUsage": 85,
    "memoryUsage": 70,
    "latency": 120
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "metrics": {
      "cpuUsage": 85,
      "memoryUsage": 70,
      "latency": 120
    },
    "recommendations": [
      {
        "type": "cpu",
        "severity": "high",
        "message": "High CPU usage detected. Consider scaling horizontally or optimizing workloads.",
        "suggestion": "Review CPU-intensive processes and consider load balancing"
      },
      {
        "type": "latency",
        "severity": "high",
        "message": "High latency detected. Investigate network or processing bottlenecks.",
        "suggestion": "Review network configuration and database query performance"
      }
    ],
    "score": 50
  },
  "message": "Performance analysis completed"
}
```

### Get Optimization Recommendations
```bash
curl http://localhost:3000/api/v1/performance/optimization?type=cpu
```

Response:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "opt-1",
      "type": "cpu",
      "title": "Enable CPU Burst Performance Mode",
      "description": "Configure Intel Turbo Boost for burst workloads",
      "impact": "high",
      "effort": "medium"
    }
  ]
}
```

### Run Benchmark
```bash
curl http://localhost:3000/api/v1/performance/benchmark
```

Response:
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "duration": "15ms",
    "throughput": "66666.67 ops/sec",
    "operations": 1000,
    "cpuUsage": {
      "user": 15000,
      "system": 5000
    },
    "memoryUsage": {
      "rss": 52428800,
      "heapTotal": 20971520,
      "heapUsed": 15728640,
      "external": 1024
    }
  },
  "message": "Benchmark completed successfully"
}
```

## Prometheus Metrics

### Get Prometheus Metrics
```bash
curl http://localhost:3000/api/v1/metrics
```

Response (Prometheus format):
```
# HELP http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",route="/api/v1/health",status_code="200",le="0.1"} 10
http_request_duration_seconds_bucket{method="GET",route="/api/v1/health",status_code="200",le="0.3"} 10
...

# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/api/v1/health",status_code="200"} 10
...
```

## Docker Compose Examples

### Start all services
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f app
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes
```bash
docker-compose down -v
```

## Kubernetes Examples

### Apply all configurations
```bash
kubectl apply -f kubernetes/
```

### Check pod status
```bash
kubectl get pods -l app=intel-cloud-performance-service
```

### View logs
```bash
kubectl logs -f deployment/intel-cloud-performance-service
```

### Scale deployment
```bash
kubectl scale deployment intel-cloud-performance-service --replicas=5
```

### Port forward for local access
```bash
kubectl port-forward service/intel-cloud-performance-service 3000:80
```

## Terraform Examples

### Initialize Terraform
```bash
cd terraform
terraform init
```

### Plan infrastructure changes
```bash
terraform plan -var="db_password=your-password"
```

### Apply infrastructure
```bash
terraform apply -var="db_password=your-password"
```

### Destroy infrastructure
```bash
terraform destroy -var="db_password=your-password"
```

### View outputs
```bash
terraform output
```

