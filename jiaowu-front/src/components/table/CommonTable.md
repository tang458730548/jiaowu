# CommonTable 通用表格组件

## 概述

CommonTable 是一个高度可配置的通用表格组件，集成了搜索、分页、新增、编辑、删除、导出等功能，可以大大减少重复代码，提高开发效率。

## 功能特性

- ✅ 搜索表单（支持多种输入类型）
- ✅ 分页表格（支持排序）
- ✅ 新增/编辑弹窗（支持多种表单控件）
- ✅ 删除确认
- ✅ 数据导出
- ✅ 刷新功能
- ✅ 状态切换
- ✅ 完全可配置

## 基本用法

```jsx
import CommonTable from '../components/CommonTable';

const MyPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 表格列配置
  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    // ... 更多列
  ];

  // 搜索配置
  const searchConfig = {
    fields: [
      {
        name: 'name',
        label: '姓名',
        type: 'input',
        placeholder: '请输入姓名',
        width: 200
      }
    ]
  };

  // 弹窗配置
  const modalConfig = {
    addTitle: '新增用户',
    editTitle: '编辑用户',
    fields: [
      {
        title: '基本信息',
        items: [
          {
            name: 'name',
            label: '姓名',
            type: 'input',
            placeholder: '请输入姓名',
            rules: [{ required: true, message: '请输入姓名' }]
          }
        ]
      }
    ]
  };

  return (
    <CommonTable
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
      onTableChange={handleTableChange}
      onSearch={handleSearch}
      onReset={handleReset}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onExport={handleExport}
      onRefresh={handleRefresh}
      searchConfig={searchConfig}
      modalConfig={modalConfig}
      addButtonText="新增用户"
      exportButtonText="导出数据"
    />
  );
};
```

## Props 说明

### 基础属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '数据列表' | 页面标题 |
| columns | Array | [] | 表格列配置 |
| dataSource | Array | [] | 数据源 |
| loading | boolean | false | 加载状态 |
| pagination | Object | {} | 分页配置 |
| rowKey | string | 'id' | 行键值 |

### 回调函数

| 属性 | 类型 | 说明 |
|------|------|------|
| onTableChange | Function | 表格变化回调（分页、排序） |
| onSearch | Function | 搜索回调 |
| onReset | Function | 重置回调 |
| onAdd | Function | 新增回调 |
| onEdit | Function | 编辑回调 |
| onDelete | Function | 删除回调 |
| onExport | Function | 导出回调 |
| onRefresh | Function | 刷新回调 |
| onStatusChange | Function | 状态变化回调 |

### 配置属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| searchConfig | Object | {} | 搜索表单配置 |
| modalConfig | Object | {} | 弹窗表单配置 |
| addButtonText | string | '新增' | 新增按钮文本 |
| exportButtonText | string | '导出数据' | 导出按钮文本 |
| showAddButton | boolean | true | 是否显示新增按钮 |
| showExportButton | boolean | true | 是否显示导出按钮 |
| showRefreshButton | boolean | true | 是否显示刷新按钮 |

## 搜索配置 (searchConfig)

```jsx
const searchConfig = {
  fields: [
    {
      name: 'name',           // 字段名
      label: '姓名',          // 标签
      type: 'input',          // 类型：input/select/number
      placeholder: '请输入姓名', // 占位符
      width: 200,             // 宽度
      options: [              // 选项（select类型需要）
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' }
      ],
      min: 0,                 // 最小值（number类型）
      max: 100                // 最大值（number类型）
    }
  ]
};
```

### 支持的搜索字段类型

- `input`: 文本输入框
- `select`: 下拉选择框
- `number`: 数字输入框

## 弹窗配置 (modalConfig)

```jsx
const modalConfig = {
  addTitle: '新增用户',        // 新增标题
  editTitle: '编辑用户',       // 编辑标题
  width: 650,                // 弹窗宽度
  defaultValues: {           // 默认值
    status: 1
  },
  fields: [                  // 表单字段配置
    {
      title: '基本信息',       // 分组标题
      items: [               // 字段列表
        {
          name: 'name',      // 字段名
          label: '姓名',     // 标签
          type: 'input',     // 类型
          placeholder: '请输入姓名',
          rules: [           // 验证规则
            { required: true, message: '请输入姓名' }
          ],
          options: [         // 选项（select/radio类型需要）
            { value: '1', label: '选项1' },
            { value: '2', label: '选项2' }
          ],
          rows: 4,          // 行数（textarea类型）
          min: 0,           // 最小值（number类型）
          max: 100,         // 最大值（number类型）
          showTime: true,   // 显示时间（date类型）
          disabled: false,  // 是否禁用（date类型）
          checkedText: '开启',    // 开启文本（switch类型）
          uncheckedText: '关闭'   // 关闭文本（switch类型）
        }
      ]
    }
  ]
};
```

### 支持的表单字段类型

- `input`: 文本输入框
- `password`: 密码输入框
- `textarea`: 多行文本
- `select`: 下拉选择框
- `radio`: 单选框组
- `number`: 数字输入框
- `date`: 日期选择器
- `switch`: 开关

## 完整示例

### 用户管理页面

```jsx
import React, { useState, useEffect } from 'react';
import { Button, message, Switch, Popconfirm } from 'antd';
import { userAPI } from '../api/user';
import CommonTable from '../components/CommonTable';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 获取数据
  const fetchUsers = async (page = 0, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await userAPI.getUserList({ page, size: pageSize });
      const data = response.data || response;
      setUsers(data.content || []);
      setPagination({
        current: (data.number || 0) + 1,
        pageSize: data.size || pageSize,
        total: data.totalElements || 0,
      });
    } catch (e) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0, 10);
  }, []);

  // 表格列配置
  const columns = [
    { 
      title: '用户名', 
      dataIndex: 'username', 
      key: 'username',
      sorter: true
    },
    { 
      title: '姓名', 
      dataIndex: 'name', 
      key: 'name',
      sorter: true
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status, record) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="正常"
          unCheckedChildren="禁用"
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record.id, record)}>编辑</Button>
          <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // 搜索配置
  const searchConfig = {
    fields: [
      {
        name: 'username',
        label: '用户名',
        type: 'input',
        placeholder: '请输入用户名',
        width: 200
      },
      {
        name: 'name',
        label: '姓名',
        type: 'input',
        placeholder: '请输入姓名',
        width: 200
      }
    ]
  };

  // 弹窗配置
  const modalConfig = {
    addTitle: '新增用户',
    editTitle: '编辑用户',
    width: 650,
    defaultValues: {
      status: 1
    },
    fields: [
      {
        title: '账号信息',
        items: [
          {
            name: 'username',
            label: <span>用户名 <span style={{color:'red'}}>*</span></span>,
            type: 'input',
            placeholder: '请输入用户名',
            rules: [{ required: true, message: '请输入用户名' }]
          },
          {
            name: 'password',
            label: <span>密码 <span style={{color:'red'}}>*</span></span>,
            type: 'password',
            placeholder: '请输入密码',
            rules: [{ required: true, message: '请输入密码' }]
          }
        ]
      },
      {
        title: '基本信息',
        items: [
          {
            name: 'name',
            label: <span>姓名 <span style={{color:'red'}}>*</span></span>,
            type: 'input',
            placeholder: '请输入姓名',
            rules: [{ required: true, message: '请输入姓名' }]
          },
          {
            name: 'email',
            label: <span>邮箱 <span style={{color:'red'}}>*</span></span>,
            type: 'input',
            placeholder: '请输入邮箱',
            rules: [
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' }
            ]
          },
          {
            name: 'status',
            label: <span>状态 <span style={{color:'red'}}>*</span></span>,
            type: 'radio',
            options: [
              { value: 1, label: '正常' },
              { value: 0, label: '禁用' }
            ],
            rules: [{ required: true, message: '请选择状态' }]
          }
        ]
      }
    ]
  };

  // 事件处理函数
  const handleTableChange = (pag, filters, sorter) => {
    fetchUsers(pag.current - 1, pag.pageSize);
  };

  const handleSearch = (values) => {
    // 处理搜索逻辑
  };

  const handleReset = () => {
    // 处理重置逻辑
  };

  const handleAdd = async (values) => {
    // 处理新增逻辑
  };

  const handleEdit = async (id, values) => {
    // 处理编辑逻辑
  };

  const handleDelete = async (id) => {
    // 处理删除逻辑
  };

  const handleExport = async () => {
    // 处理导出逻辑
  };

  const handleRefresh = () => {
    fetchUsers(pagination.current - 1, pagination.pageSize);
  };

  const handleStatusChange = async (id, checked) => {
    // 处理状态变化逻辑
  };

  return (
    <CommonTable
      title="用户管理"
      columns={columns}
      dataSource={users}
      loading={loading}
      pagination={pagination}
      onTableChange={handleTableChange}
      onSearch={handleSearch}
      onReset={handleReset}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onExport={handleExport}
      onRefresh={handleRefresh}
      onStatusChange={handleStatusChange}
      searchConfig={searchConfig}
      modalConfig={modalConfig}
      addButtonText="新增用户"
      exportButtonText="导出数据"
      rowKey="id"
    />
  );
};

export default UserList;
```

## 注意事项

1. **API响应格式**: 组件假设API返回格式为 `{ code: 200, message: "操作成功", data: { content: [], ... } }`
2. **分页参数**: 后端分页从0开始，前端从1开始，组件会自动处理转换
3. **表单验证**: 使用Antd的Form验证规则
4. **错误处理**: 组件会捕获并显示错误信息
5. **状态管理**: 组件内部管理弹窗状态，外部只需要提供回调函数

## 扩展功能

如果需要更多自定义功能，可以：

1. 继承CommonTable组件
2. 使用组合模式包装CommonTable
3. 通过props传递自定义渲染函数
4. 添加更多配置选项

## 最佳实践

1. **配置化**: 尽量使用配置而不是硬编码
2. **类型安全**: 使用TypeScript获得更好的类型检查
3. **错误处理**: 在回调函数中妥善处理错误
4. **性能优化**: 对于大数据量，考虑虚拟滚动
5. **用户体验**: 添加适当的加载状态和反馈 