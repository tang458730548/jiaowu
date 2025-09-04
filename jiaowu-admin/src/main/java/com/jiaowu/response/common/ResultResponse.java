package com.jiaowu.response.common;

import lombok.Data;

/**
 * 通用响应结果封装类
 *
 * @author tsc
 * @since 1.0.0
 */
@Data
public class ResultResponse<T> {

    private Integer code;
    private String message;
    private T data;

    public ResultResponse() {
    }

    public ResultResponse(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public ResultResponse(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 成功响应
     */
    public static <T> ResultResponse<T> success() {
        return new ResultResponse<>(200, "操作成功");
    }

    /**
     * 成功响应（带数据）
     */
    public static <T> ResultResponse<T> success(T data) {
        return new ResultResponse<>(200, "操作成功", data);
    }

    /**
     * 成功响应（自定义消息）
     */
    public static <T> ResultResponse<T> success(String message, T data) {
        return new ResultResponse<>(200, message, data);
    }

    /**
     * 失败响应
     */
    public static <T> ResultResponse<T> error() {
        return new ResultResponse<>(500, "操作失败");
    }

    /**
     * 失败响应（自定义消息）
     */
    public static <T> ResultResponse<T> error(String message) {
        return new ResultResponse<>(500, message);
    }

    /**
     * 失败响应（自定义状态码和消息）
     */
    public static <T> ResultResponse<T> error(Integer code, String message) {
        return new ResultResponse<>(code, message);
    }
} 