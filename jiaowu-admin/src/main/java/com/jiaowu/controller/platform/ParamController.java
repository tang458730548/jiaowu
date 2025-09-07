package com.jiaowu.controller.platform;

import com.jiaowu.entity.platform.TbJwParam;
import com.jiaowu.request.platform.ParamCreateRequest;
import com.jiaowu.request.platform.ParamQueryRequest;
import com.jiaowu.request.platform.ParamStatusUpdateRequest;
import com.jiaowu.request.platform.ParamUpdateRequest;
import com.jiaowu.service.platform.ParamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/params")
public class ParamController {

    @Autowired
    private ParamService paramService;

    @PostMapping("/create")
    public TbJwParam create(@RequestBody ParamCreateRequest request) {
        TbJwParam param = new TbJwParam();
        param.setParamKey(request.getParamKey());
        param.setParamName(request.getParamName());
        param.setParamValue(request.getParamValue());
        param.setParamType(request.getParamType());
        param.setParamGroup(request.getParamGroup());
        param.setDescription(request.getDescription());
        param.setIsEditable(request.getIsEditable() != null ? request.getIsEditable() : true);
        param.setIsRequired(request.getIsRequired() != null ? request.getIsRequired() : false);
        param.setStatus(request.getStatus() != null ? request.getStatus() : 1);
        return paramService.save(param);
    }

    @PostMapping("/update/{id}")
    public TbJwParam update(@PathVariable Long id, @RequestBody ParamUpdateRequest request) {
        TbJwParam param = new TbJwParam();
        param.setParamName(request.getParamName());
        param.setParamValue(request.getParamValue());
        param.setParamType(request.getParamType());
        param.setParamGroup(request.getParamGroup());
        param.setDescription(request.getDescription());
        param.setIsEditable(request.getIsEditable());
        param.setIsRequired(request.getIsRequired());
        param.setStatus(request.getStatus());
        return paramService.update(id, param);
    }

    @PostMapping("/updateStatus/{id}")
    public TbJwParam updateStatus(@PathVariable Long id, @RequestBody ParamStatusUpdateRequest request) {
        return paramService.updateStatus(id, request.getStatus());
    }

    @PostMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        paramService.delete(id);
    }

    @GetMapping("/get/{id}")
    public TbJwParam getById(@PathVariable Long id) {
        return paramService.findById(id);
    }

    @PostMapping("/query")
    public Page<TbJwParam> query(@RequestBody ParamQueryRequest request) {
        Sort.Direction direction = "asc".equalsIgnoreCase(request.getOrder()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortObj = Sort.by(direction, request.getSort());
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sortObj);
        return paramService.findAll(pageable, request.getParamName(), request.getParamKey(), request.getParamGroup(), request.getParamType(), request.getStatus());
    }

    @PostMapping("/export")
    public ResponseEntity<byte[]> export(@RequestBody ParamQueryRequest request) {
        byte[] csvData = paramService.exportToCsv(request.getParamName(), request.getParamKey(), request.getParamGroup(), request.getParamType(), request.getStatus());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "系统参数.csv");
        return ResponseEntity.ok().headers(headers).body(csvData);
    }
} 