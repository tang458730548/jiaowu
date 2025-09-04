package com.jiaowu.request.common;

import lombok.Data;

@Data
public class PageRequest {

    private int page = 0;

    private int size = 10;

    private String sort = "id";

    private String order = "desc";
}
