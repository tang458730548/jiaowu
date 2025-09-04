package com.jiaowu.common.exception;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jiaowu.response.common.ResultResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * description:
 *      springSecurity 校验处理的统一异常类
 * @author tsc
 * @since 2025-9-4
 */
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {

        // 构建错误响应
        Map<String, String> errorMap = new HashMap<>(3);
        errorMap.put("错误原因", accessDeniedException.getMessage());
        errorMap.put("请求地址", request.getRequestURI());
        ResultResponse<Object> error = ResultResponse.error(HttpStatus.FORBIDDEN.value(), JSON.toJSONString(errorMap));

        // 设置响应格式和状态码
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpStatus.FORBIDDEN.value());

        // 写入JSON响应
        response.getWriter().write(objectMapper.writeValueAsString(error));
    }
}
