package com.jiaowu.filter;

import com.jiaowu.common.constant.HttpResultConstant;
import com.jiaowu.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import java.io.IOException;

/**
 * description:
 *
 * @author tsc
 * @since 2025-9-3
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AccessDeniedHandler accessDeniedHandler;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        // 不拦截的路径列表
        return "/api/verification/generate".equals(requestUri) ||
                "/api/login/employee".equals(requestUri) ||
                "/api/login/logout".equals(requestUri);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        // 1. 检查请求头是否存在
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            // 使用AccessDeniedHandler处理异常，而非直接throw
            accessDeniedHandler.handle(
                    request,
                    response,
                    new AccessDeniedException(HttpResultConstant.NO_AUTHORIZATION)
            );
            return; // 终止过滤器链，避免继续执行
        }

        // 2. 提取并验证Token（其他逻辑）
        String jwt = authorizationHeader.substring(7);
        String username = null;
        try {
            username = jwtUtil.extractUsername(jwt);
        } catch (Exception e) {
            accessDeniedHandler.handle(
                    request,
                    response,
                    new AccessDeniedException(HttpResultConstant.PARSE_TOKEN_ERROR)
            );
            return;
        }

        // 3. 验证Token有效性
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (!jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                accessDeniedHandler.handle(
                        request,
                        response,
                        new AccessDeniedException(HttpResultConstant.TOKEN_EXPIRE)
                );
                return;
            }

            // 设置认证信息
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        // 继续执行过滤器链
        chain.doFilter(request, response);
    }
}

