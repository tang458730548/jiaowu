package com.jiaowu.request.platform;

public class ParamQueryRequest {
    private int page = 0;
    private int size = 10;
    private String sort = "createTime";
    private String order = "desc";

    private String paramName;
    private String paramKey;
    private String paramGroup;
    private String paramType;
    private Integer status;

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public String getSort() { return sort; }
    public void setSort(String sort) { this.sort = sort; }

    public String getOrder() { return order; }
    public void setOrder(String order) { this.order = order; }

    public String getParamName() { return paramName; }
    public void setParamName(String paramName) { this.paramName = paramName; }

    public String getParamKey() { return paramKey; }
    public void setParamKey(String paramKey) { this.paramKey = paramKey; }

    public String getParamGroup() { return paramGroup; }
    public void setParamGroup(String paramGroup) { this.paramGroup = paramGroup; }

    public String getParamType() { return paramType; }
    public void setParamType(String paramType) { this.paramType = paramType; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
} 