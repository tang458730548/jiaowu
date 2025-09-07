package com.jiaowu.service.platform;

import com.jiaowu.entity.platform.TbJwParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ParamService {
    TbJwParam save(TbJwParam param);
    TbJwParam update(Long id, TbJwParam param);
    void delete(Long id);
    TbJwParam findById(Long id);
    Page<TbJwParam> findAll(Pageable pageable);
    Page<TbJwParam> findAll(Pageable pageable, String paramName, String paramKey, String paramGroup, String paramType, Integer status);
    TbJwParam updateStatus(Long id, Integer status);
    byte[] exportToCsv(String paramName, String paramKey, String paramGroup, String paramType, Integer status);
} 