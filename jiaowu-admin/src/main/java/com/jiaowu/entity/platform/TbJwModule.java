package com.jiaowu.entity.platform;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "tb_jw_module")
public class TbJwModule implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "module_name", nullable = false, length = 100)
    private String moduleName;

    @Column(name = "module_code", nullable = false, unique = true, length = 50)
    private String moduleCode;

    @Column(name = "module_type")
    private Integer moduleType;

    @Column(length = 100)
    private String icon;

    @Column(length = 200)
    private String path;

    @Column(length = 200)
    private String component;

    @Column(length = 100)
    private String permission;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column
    private Integer level;

    @Column(name = "is_visible")
    private Integer isVisible;

    @Column(name = "is_enabled")
    private Integer isEnabled;

    @Column(length = 500)
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_time", updatable = false)
    private Date createTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "update_time")
    private Date updateTime;

    @Column(name = "create_by")
    private Long createBy;

    @Column(name = "update_by")
    private Long updateBy;

    // 树形结构相关字段（非数据库字段）
    @Transient
    private List<TbJwModule> children;

    @Transient
    private Boolean hasChildren;

    @Transient
    private String parentName;

    // 模块类型常量
    public static final Integer TYPE_MENU = 1;
    public static final Integer TYPE_BUTTON = 2;
    public static final Integer TYPE_PAGE = 3;

    // 状态常量
    public static final Integer STATUS_VISIBLE = 1;
    public static final Integer STATUS_HIDDEN = 0;
    public static final Integer STATUS_ENABLED = 1;
    public static final Integer STATUS_DISABLED = 0;

    // 构造函数
    public TbJwModule() {}

    public TbJwModule(Long id, Long parentId, String moduleName, String moduleCode) {
        this.id = id;
        this.parentId = parentId;
        this.moduleName = moduleName;
        this.moduleCode = moduleCode;
    }

    // getter 和 setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }

    public String getModuleName() { return moduleName; }
    public void setModuleName(String moduleName) { this.moduleName = moduleName; }

    public String getModuleCode() { return moduleCode; }
    public void setModuleCode(String moduleCode) { this.moduleCode = moduleCode; }

    public Integer getModuleType() { return moduleType; }
    public void setModuleType(Integer moduleType) { this.moduleType = moduleType; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public String getComponent() { return component; }
    public void setComponent(String component) { this.component = component; }

    public String getPermission() { return permission; }
    public void setPermission(String permission) { this.permission = permission; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Integer getIsVisible() { return isVisible; }
    public void setIsVisible(Integer isVisible) { this.isVisible = isVisible; }

    public Integer getIsEnabled() { return isEnabled; }
    public void setIsEnabled(Integer isEnabled) { this.isEnabled = isEnabled; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getCreateTime() { return createTime; }
    public void setCreateTime(Date createTime) { this.createTime = createTime; }

    public Date getUpdateTime() { return updateTime; }
    public void setUpdateTime(Date updateTime) { this.updateTime = updateTime; }

    public Long getCreateBy() { return createBy; }
    public void setCreateBy(Long createBy) { this.createBy = createBy; }

    public Long getUpdateBy() { return updateBy; }
    public void setUpdateBy(Long updateBy) { this.updateBy = updateBy; }

    public List<TbJwModule> getChildren() { return children; }
    public void setChildren(List<TbJwModule> children) { this.children = children; }

    public Boolean getHasChildren() { return hasChildren; }
    public void setHasChildren(Boolean hasChildren) { this.hasChildren = hasChildren; }

    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }

    // 业务方法
    public boolean isRoot() {
        return parentId == null || parentId == 0;
    }

    public boolean isMenu() {
        return TYPE_MENU.equals(moduleType);
    }

    public boolean isButton() {
        return TYPE_BUTTON.equals(moduleType);
    }

    public boolean isPage() {
        return TYPE_PAGE.equals(moduleType);
    }

    public boolean isVisible() {
        return STATUS_VISIBLE.equals(isVisible);
    }

    public boolean isEnabled() {
        return STATUS_ENABLED.equals(isEnabled);
    }

    @Override
    public String toString() {
        return "Module{" +
                "id=" + id +
                ", parentId=" + parentId +
                ", moduleName='" + moduleName + '\'' +
                ", moduleCode='" + moduleCode + '\'' +
                ", moduleType=" + moduleType +
                ", level=" + level +
                ", isVisible=" + isVisible +
                ", isEnabled=" + isEnabled +
                '}';
    }
} 