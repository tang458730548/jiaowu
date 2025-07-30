package com.jiaowu.controller;

import com.jiaowu.entity.Employee;
import com.jiaowu.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/create")
    public Employee create(@RequestBody Employee employee) {
        return employeeService.save(employee);
    }

    @PostMapping("/update/{id}")
    public Employee update(@PathVariable Long id, @RequestBody Employee employee) {
        return employeeService.update(id, employee);
    }

    @PostMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        employeeService.delete(id);
    }

    @GetMapping("/get/{id}")
    public Employee getById(@PathVariable Long id) {
        return employeeService.findById(id);
    }

    @GetMapping("/query")
    public Page<Employee> getAll(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "10") int size
                                ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Employee> all = employeeService.findAll(pageable);
        return all;
    }
} 