package com.jiaowu.request.platform;

public class ParamUpdateRequest {
    private String paramName;
    private String paramValue;
    private String paramType;
    private String paramGroup;
    private String description;
    private Boolean isEditable;
    private Boolean isRequired;
    private Integer status;

    public String getParamName() { return paramName; }
    public void setParamName(String paramName) { this.paramName = paramName; }

    public String getParamValue() { return paramValue; }
    public void setParamValue(String paramValue) { this.paramValue = paramValue; }

    public String getParamType() { return paramType; }
    public void setParamType(String paramType) { this.paramType = paramType; }

    public String getParamGroup() { return paramGroup; }
    public void setParamGroup(String paramGroup) { this.paramGroup = paramGroup; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsEditable() { return isEditable; }
    public void setIsEditable(Boolean isEditable) { this.isEditable = isEditable; }

    public Boolean getIsRequired() { return isRequired; }
    public void setIsRequired(Boolean isRequired) { this.isRequired = isRequired; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
} 