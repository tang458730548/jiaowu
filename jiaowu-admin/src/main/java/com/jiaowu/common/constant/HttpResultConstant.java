package com.jiaowu.common.constant;

/**
 * description:
 * http返回消息的常量类
 *
 * @author tsc
 * @since 2025-9-4
 */
public class HttpResultConstant {

    public static final String ERROR_MESSAGE = "系统异常，请联系管理员";
    public static final String USER_REPEAT = "用户名已存在，请使用其他用户名";

    public static final String NO_AUTHORIZATION = "请求头中缺少有效的Authorization信息";

    public static final String PARSE_TOKEN_ERROR = "Token解析失败";

    public static final String TOKEN_EXPIRE = "Token无效或已过期";


}
