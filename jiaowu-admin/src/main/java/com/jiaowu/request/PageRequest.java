package com.jiaowu.request;

public class PageRequest {
    private int page = 0;
    private int size = 10;
    private String sort = "id";
    private String order = "desc";

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public String getSort() { return sort; }
    public void setSort(String sort) { this.sort = sort; }

    public String getOrder() { return order; }
    public void setOrder(String order) { this.order = order; }
}
