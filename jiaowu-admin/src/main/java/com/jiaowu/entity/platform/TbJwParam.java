package com.jiaowu.entity.platform;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 系统参数实体类
 */
@Entity
@Table(name = "tb_jw_param")
public class TbJwParam {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 参数键
     */
    @Column(name = "param_key", nullable = false, unique = true, length = 100)
    private String paramKey;
    
    /**
     * 参数名称
     */
    @Column(name = "param_name", nullable = false, length = 100)
    private String paramName;
    
    /**
     * 参数值
     */
    @Column(name = "param_value", columnDefinition = "TEXT")
    private String paramValue;
    
    /**
     * 参数类型：string, number, boolean, json, text
     */
    @Column(name = "param_type", nullable = false, length = 20)
    private String paramType;
    
    /**
     * 参数分组：system, security, file, email, cache, database
     */
    @Column(name = "param_group", nullable = false, length = 50)
    private String paramGroup;
    
    /**
     * 参数描述
     */
    @Column(name = "description", length = 500)
    private String description;
    
    /**
     * 是否可编辑：0-不可编辑，1-可编辑
     */
    @Column(name = "is_editable", nullable = false)
    private Boolean isEditable = true;
    
    /**
     * 是否必填：0-非必填，1-必填
     */
    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = false;
    
    /**
     * 状态：0-禁用，1-启用
     */
    @Column(name = "status", nullable = false)
    private Integer status = 1;
    
    /**
     * 创建时间
     */
    @Column(name = "create_time", nullable = false)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @Column(name = "update_time")
    private LocalDateTime updateTime;
    
    /**
     * 创建人
     */
    @Column(name = "create_by", length = 50)
    private String createBy;
    
    /**
     * 更新人
     */
    @Column(name = "update_by", length = 50)
    private String updateBy;
    
    // 构造函数
    public TbJwParam() {
        this.createTime = LocalDateTime.now();
    }
    
    // Getter和Setter方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getParamKey() {
        return paramKey;
    }
    
    public void setParamKey(String paramKey) {
        this.paramKey = paramKey;
    }
    
    public String getParamName() {
        return paramName;
    }
    
    public void setParamName(String paramName) {
        this.paramName = paramName;
    }
    
    public String getParamValue() {
        return paramValue;
    }
    
    public void setParamValue(String paramValue) {
        this.paramValue = paramValue;
    }
    
    public String getParamType() {
        return paramType;
    }
    
    public void setParamType(String paramType) {
        this.paramType = paramType;
    }
    
    public String getParamGroup() {
        return paramGroup;
    }
    
    public void setParamGroup(String paramGroup) {
        this.paramGroup = paramGroup;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Boolean getIsEditable() {
        return isEditable;
    }
    
    public void setIsEditable(Boolean isEditable) {
        this.isEditable = isEditable;
    }
    
    public Boolean getIsRequired() {
        return isRequired;
    }
    
    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired;
    }
    
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }
    
    public LocalDateTime getCreateTime() {
        return createTime;
    }
    
    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }
    
    public LocalDateTime getUpdateTime() {
        return updateTime;
    }
    
    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }
    
    public String getCreateBy() {
        return createBy;
    }
    
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }
    
    public String getUpdateBy() {
        return updateBy;
    }
    
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }
}
