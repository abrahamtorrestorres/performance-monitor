package com.abraham.monitor.controller;

import com.abraham.monitor.model.SystemMetric;
import com.abraham.monitor.repository.MetricRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/java/metrics") // distinct path
public class MetricController {

    private final MetricRepository repository;

    public MetricController(MetricRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SystemMetric> getAllMetrics() {
        return repository.findAll();
    }

    @PostMapping
    public SystemMetric ingestMetric(@RequestBody SystemMetric metric) {
        return repository.save(metric);
    }
    
    @GetMapping("/health")
    public String healthCheck() {
        return "Java Service is Running";
    }
}
