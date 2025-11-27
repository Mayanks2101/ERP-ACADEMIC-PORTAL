package com.example.academicerp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "employee",
    indexes = @Index(columnList = "department_id", unique = true, name = "UK_employee_department")
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT")
    private Integer id;

    @Column(length = 255, nullable = true)
    private String email;

    @Column(name = "name", length = 255, nullable = true)
    private String name;

    @Column(name = "title", length = 255, nullable = true)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "department_id",
        foreignKey = @ForeignKey(
            name = "FK_employee_department",
            foreignKeyDefinition = "FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL"
        )
    )
    private Department department;
}
