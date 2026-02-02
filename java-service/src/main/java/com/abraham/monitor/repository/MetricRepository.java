package com.abraham.monitor.repository;

import com.abraham.monitor.model.SystemMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetricRepository extends JpaRepository<SystemMetric, Long> {
}
