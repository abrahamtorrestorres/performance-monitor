package com.abraham.monitor.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "java_system_metrics") // Distinct table to avoid Node.js conflicts
public class SystemMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nodeName;
    private Double cpuUsage;
    private Double memoryUsage;
    
    @Column(name = "created_at")
    private LocalDateTime timestamp = LocalDateTime.now();
}
