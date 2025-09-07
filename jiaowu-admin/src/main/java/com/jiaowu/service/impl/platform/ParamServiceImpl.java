package com.jiaowu.service.impl.platform;

import com.jiaowu.entity.platform.TbJwParam;
import com.jiaowu.repository.platform.ParamRepository;
import com.jiaowu.service.platform.ParamService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ParamServiceImpl implements ParamService {

    @Autowired
    private ParamRepository paramRepository;

    @Override
    public TbJwParam save(TbJwParam param) {
        return paramRepository.save(param);
    }

    @Override
    public TbJwParam update(Long id, TbJwParam param) {
        Optional<TbJwParam> optional = paramRepository.findById(id);
        if (optional.isPresent()) {
            TbJwParam exist = optional.get();
            if (StringUtils.isNotBlank(param.getParamName())) {
                exist.setParamName(param.getParamName());
            }
            if (StringUtils.isNotBlank(param.getParamValue())) {
                exist.setParamValue(param.getParamValue());
            }
            if (StringUtils.isNotBlank(param.getParamType())) {
                exist.setParamType(param.getParamType());
            }
            if (StringUtils.isNotBlank(param.getParamGroup())) {
                exist.setParamGroup(param.getParamGroup());
            }
            exist.setDescription(param.getDescription());
            if (param.getIsEditable() != null) {
                exist.setIsEditable(param.getIsEditable());
            }
            if (param.getIsRequired() != null) {
                exist.setIsRequired(param.getIsRequired());
            }
            if (param.getStatus() != null) {
                exist.setStatus(param.getStatus());
            }
            exist.setUpdateTime(new Date().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
            return paramRepository.save(exist);
        }
        return null;
    }

    @Override
    public void delete(Long id) {
        paramRepository.deleteById(id);
    }

    @Override
    public TbJwParam findById(Long id) {
        return paramRepository.findById(id).orElse(null);
    }

    @Override
    public Page<TbJwParam> findAll(Pageable pageable) {
        return paramRepository.findAll(pageable);
    }

    @Override
    public Page<TbJwParam> findAll(Pageable pageable, String paramName, String paramKey, String paramGroup, String paramType, Integer status) {
        return paramRepository.findParamsWithConditions(paramName, paramKey, paramGroup, paramType, status, pageable);
    }

    @Override
    public TbJwParam updateStatus(Long id, Integer status) {
        Optional<TbJwParam> optional = paramRepository.findById(id);
        if (optional.isPresent()) {
            TbJwParam p = optional.get();
            p.setStatus(status);
            p.setUpdateTime(new Date().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
            return paramRepository.save(p);
        }
        return null;
    }

    @Override
    public byte[] exportToCsv(String paramName, String paramKey, String paramGroup, String paramType, Integer status) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
             OutputStreamWriter writer = new OutputStreamWriter(outputStream, StandardCharsets.UTF_8)) {

            writer.write('\ufeff');
            writer.write("ID,参数键,参数名称,参数值,类型,分组,可编辑,必填,状态,创建时间,更新时间\n");

            Page<TbJwParam> page = paramRepository.findParamsWithConditions(paramName, paramKey, paramGroup, paramType, status, Pageable.unpaged());
            List<TbJwParam> params = page.getContent();

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            for (TbJwParam p : params) {
                String line = p.getId() + "," +
                        p.getParamKey() + "," +
                        p.getParamName() + "," +
                        (p.getParamValue() != null ? p.getParamValue().replace("\n", " ").replace(",", " ") : "") + "," +
                        p.getParamType() + "," +
                        p.getParamGroup() + "," +
                        (Boolean.TRUE.equals(p.getIsEditable()) ? 1 : 0) + "," +
                        (Boolean.TRUE.equals(p.getIsRequired()) ? 1 : 0) + "," +
                        (p.getStatus() != null ? p.getStatus() : 1) + "," +
                        (p.getCreateTime() != null ? sdf.format(java.sql.Timestamp.valueOf(p.getCreateTime())) : "") + "," +
                        (p.getUpdateTime() != null ? sdf.format(java.sql.Timestamp.valueOf(p.getUpdateTime())) : "") +
                        "\n";
                writer.write(line);
            }

            writer.flush();
            return outputStream.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("导出CSV失败", e);
        }
    }

    @Override
    public String findByParamKey(String key) {
        Optional<TbJwParam> optional = paramRepository.findByParamKey(key);
        if(optional.isPresent()){
            return optional.get().getParamValue();
        }
        return  "";
    }
} 