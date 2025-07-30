CREATE TABLE `tb_jw_verification_code` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `code` VARCHAR(4) NOT NULL COMMENT '验证码',
  `session_id` VARCHAR(100) NOT NULL COMMENT '会话ID',
  `username` VARCHAR(50) DEFAULT NULL COMMENT '用户名',
  `create_time` DATETIME NOT NULL COMMENT '创建时间',
  `expire_time` DATETIME NOT NULL COMMENT '过期时间',
  `used` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已使用 0-未使用 1-已使用',
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_username` (`username`),
  KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='验证码表'; 