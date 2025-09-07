package com.jiaowu.controller.platform;

import com.jiaowu.entity.platform.TbJwEmployee;
import com.jiaowu.request.platform.EmployeeCreateRequest;
import com.jiaowu.request.platform.EmployeeQueryRequest;
import com.jiaowu.request.platform.EmployeeStatusUpdateRequest;
import com.jiaowu.request.platform.EmployeeUpdateRequest;
import com.jiaowu.service.platform.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/create")
    public TbJwEmployee create(@RequestBody EmployeeCreateRequest request) {
        TbJwEmployee employee = new TbJwEmployee();
        employee.setUsername(request.getUsername());
        employee.setGender(request.getGender());
        employee.setNickname(request.getNickname());
        employee.setTitle(request.getTitle());
        employee.setEmail(request.getEmail());
        employee.setEnrollYear(request.getEnrollYear());
        employee.setStatus(request.getStatus());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        return employeeService.save(employee);
    }

    @PostMapping("/update/{id}")
    public TbJwEmployee update(@PathVariable Long id, @RequestBody EmployeeUpdateRequest request) {
        TbJwEmployee employee = new TbJwEmployee();
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
    public TbJwEmployee updateStatus(@PathVariable Long id, @RequestBody EmployeeStatusUpdateRequest request) {
        TbJwEmployee employee = new TbJwEmployee();
        employee.setStatus(request.getStatus());
        return employeeService.updateStatus(id, employee);
    }

    @PostMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        employeeService.delete(id);
    }

    @GetMapping("/get/{id}")
    public TbJwEmployee getById(@PathVariable Long id) {
        return employeeService.findById(id);
    }

    @PostMapping("/query")
    public Page<TbJwEmployee> getAll(@RequestBody EmployeeQueryRequest request) {
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