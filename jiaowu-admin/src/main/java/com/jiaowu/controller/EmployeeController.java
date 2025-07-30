package com.jiaowu.controller;

import com.jiaowu.entity.Employee;
import com.jiaowu.request.EmployeeCreateRequest;
import com.jiaowu.request.EmployeeQueryRequest;
import com.jiaowu.request.EmployeeStatusUpdateRequest;
import com.jiaowu.request.EmployeeUpdateRequest;
import com.jiaowu.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/create")
    public Employee create(@RequestBody EmployeeCreateRequest request) {
        Employee employee = new Employee();
        employee.setUsername(request.getUsername());
        employee.setPassword(request.getPassword());
        employee.setGender(request.getGender());
        employee.setNickname(request.getNickname());
        employee.setTitle(request.getTitle());
        employee.setEmail(request.getEmail());
        employee.setEnrollYear(request.getEnrollYear());
        employee.setStatus(request.getStatus());
        return employeeService.save(employee);
    }

    @PostMapping("/update/{id}")
    public Employee update(@PathVariable Long id, @RequestBody EmployeeUpdateRequest request) {
        Employee employee = new Employee();
        employee.setUsername(request.getUsername());
        employee.setPassword(request.getPassword());
        employee.setGender(request.getGender());
        employee.setNickname(request.getNickname());
        employee.setTitle(request.getTitle());
        employee.setEmail(request.getEmail());
        employee.setEnrollYear(request.getEnrollYear());
        employee.setStatus(request.getStatus());
        return employeeService.update(id, employee);
    }

    @PostMapping("/updateStatus/{id}")
    public Employee updateStatus(@PathVariable Long id, @RequestBody EmployeeStatusUpdateRequest request) {
        Employee employee = new Employee();
        employee.setStatus(request.getStatus());
        return employeeService.updateStatus(id, employee);
    }

    @PostMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        employeeService.delete(id);
    }

    @GetMapping("/get/{id}")
    public Employee getById(@PathVariable Long id) {
        return employeeService.findById(id);
    }

    @PostMapping("/query")
    public Page<Employee> getAll(@RequestBody EmployeeQueryRequest request) {
        Sort.Direction direction = "asc".equalsIgnoreCase(request.getOrder()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortObj = Sort.by(direction, request.getSort());
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sortObj);
        return employeeService.findAll(pageable, request.getUsername(), request.getNickname());
    }

    @PostMapping("/export")
    public ResponseEntity<byte[]> exportToCsv(@RequestBody EmployeeQueryRequest request) {
        byte[] csvData = employeeService.exportToCsv(request.getUsername(), request.getNickname());
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "职工信息.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }

}