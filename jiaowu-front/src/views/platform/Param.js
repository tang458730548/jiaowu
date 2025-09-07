import React, { useState, useEffect, useRef } from 'react';
import { Button, message, Switch, Popconfirm, Tag, Tooltip, Space } from 'antd';
import {
  SettingOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import CommonTable from '../../components/table/CommonTable';
import { paramAPI } from '../../api/platform/param';

const Param = () => {
  const [params, setParams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState({});
  const tableRef = useRef();

  // 获取参数列表（对接后端）
  const fetchParams = async (page = 0, pageSize = 10, sortField = 'id', sortOrder = 'descend', filtersOverride) => {
    setLoading(true);
    try {
      const effectiveFilters = filtersOverride !== undefined ? filtersOverride : searchParams;
      const request = {
        page,
        size: pageSize,
        sort: sortField || 'id',
        order: sortOrder === 'ascend' ? 'asc' : 'desc',
        paramName: effectiveFilters.paramName || null,
        paramKey: effectiveFilters.paramKey || null,
        paramGroup: effectiveFilters.paramGroup || null,
        paramType: effectiveFilters.paramType || null,
        status: effectiveFilters.status !== undefined ? effectiveFilters.status : null,
      };
      const res = await paramAPI.queryParams(request);
      const content = res.content || [];
      const totalElements = res.totalElements || 0;
      const number = (typeof res.number === 'number') ? res.number : page; // 后端页码(0基)
      const size = res.size || pageSize;
      setParams(content);
      setPagination({ current: Number(number) + 1, pageSize: Number(size), total: Number(totalElements) });
    } catch (e) {
      message.error(e.message || '获取参数列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParams(0, pagination.pageSize, null, null, searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 删除参数
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await paramAPI.deleteParam(id);
      message.success('删除成功');
      fetchParams(pagination.current - 1, pagination.pageSize, null, null, searchParams);
    } catch (e) {
      message.error(e.message || '删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 修改状态
  const handleStatusChange = async (id, checked) => {
    try {
      await paramAPI.updateParamStatus(id, checked ? 1 : 0);
      message.success('状态修改成功');
      fetchParams(pagination.current - 1, pagination.pageSize, null, null, searchParams);
    } catch (e) {
      message.error(e.message || '状态修改失败');
    }
  };

  // 新增参数
  const handleAdd = async (values) => {
    setLoading(true);
    try {
      await paramAPI.createParam(values);
      message.success('添加成功');
      fetchParams(pagination.current - 1, pagination.pageSize, null, null, searchParams);
    } catch (error) {
      message.error(error.message || '添加失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 编辑参数
  const handleEdit = async (id, values) => {
    setLoading(true);
    try {
      await paramAPI.updateParam(id, values);
      message.success('修改成功');
      fetchParams(pagination.current - 1, pagination.pageSize, null, null, searchParams);
    } catch (error) {
      message.error(error.message || '修改失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 分页和排序
  const handleTableChange = (pag = {}, filters = {}, sorter = {}) => {
    const current = Number(pag.current) || 1;
    const pageSize = Number(pag.pageSize) || 10;
    const sortField = sorter.field || sorter.columnKey || 'id';
    const sortOrder = sorter.order || 'descend';
    fetchParams(current - 1, pageSize, sortField, sortOrder, searchParams);
  };

  // 搜索
  const handleSearch = (values) => {
    setSearchParams(values);
    setPagination({ ...pagination, current: 1 });
    // 立刻用本次条件查询，避免等待状态更新
    fetchParams(0, pagination.pageSize, null, null, values);
  };

  // 重置搜索
  const handleReset = () => {
    const empty = {};
    setSearchParams(empty);
    setPagination({ ...pagination, current: 1 });
    fetchParams(0, pagination.pageSize, null, null, empty);
  };

  // 导出数据
  const handleExport = async () => {
    try {
      const request = {
        page: 0,
        size: 100000,
        sort: 'id',
        order: 'desc',
        paramName: (searchParams.paramName || null),
        paramKey: (searchParams.paramKey || null),
        paramGroup: (searchParams.paramGroup || null),
        paramType: (searchParams.paramType || null),
        status: (searchParams.status !== undefined ? searchParams.status : null),
      };
      const response = await paramAPI.exportParams(request);
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      let fileName = '系统参数.csv';
      const disposition = response.headers && (response.headers['content-disposition'] || response.headers['Content-Disposition']);
      if (disposition) {
        const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^;"]+)"?/i);
        const encoded = (match && (match[1] || match[2])) || '';
        try {
          fileName = decodeURIComponent(encoded);
        } catch (_) {}
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error(error.message || '导出失败');
    }
  };

  // 刷新
  const handleRefresh = () => {
    fetchParams(pagination.current - 1, pagination.pageSize, null, null, searchParams);
  };

  // 获取参数类型标签颜色
  const getTypeColor = (type) => {
    const colorMap = {
      string: 'blue',
      number: 'green',
      boolean: 'orange',
      json: 'purple',
      text: 'cyan'
    };
    return colorMap[type] || 'default';
  };

  // 获取参数组标签颜色
  const getGroupColor = (group) => {
    const colorMap = {
      system: 'red',
      security: 'volcano',
      file: 'gold',
      email: 'lime',
      cache: 'blue',
      database: 'purple'
    };
    return colorMap[group] || 'default';
  };

  const columns = [
    {
      title: '参数名称',
      dataIndex: 'paramName',
      key: 'paramName',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      width: 120,
      ellipsis: true
    },
    {
      title: '参数键',
      dataIndex: 'paramKey',
      key: 'paramKey',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      width: 150,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <code style={{ background: '#f5f5f5', padding: '2px 4px', borderRadius: '3px' }}>
            {text}
          </code>
        </Tooltip>
      )
    },
    {
      title: '参数值',
      dataIndex: 'paramValue',
      key: 'paramValue',
      width: 150,
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title={text}>
          <span style={{
            background: record.paramType === 'boolean' ? '#f0f0f0' : 'transparent',
            padding: record.paramType === 'boolean' ? '2px 6px' : '0',
            borderRadius: '3px',
            fontFamily: record.paramType === 'json' ? 'monospace' : 'inherit'
          }}>
            {record.paramType === 'boolean' ? (text === 'true' ? '是' : '否') : text}
          </span>
        </Tooltip>
      )
    },
    {
      title: '类型',
      dataIndex: 'paramType',
      key: 'paramType',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      width: 80,
      render: (type) => (
        <Tag color={getTypeColor(type)}>
          {type === 'string' ? '字符串' :
            type === 'number' ? '数字' :
              type === 'boolean' ? '布尔' :
                type === 'json' ? 'JSON' :
                  type === 'text' ? '文本' : type}
        </Tag>
      )
    },
    {
      title: '分组',
      dataIndex: 'paramGroup',
      key: 'paramGroup',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      width: 80,
      render: (group) => (
        <Tag color={getGroupColor(group)}>
          {group === 'system' ? '系统' :
            group === 'security' ? '安全' :
              group === 'file' ? '文件' :
                group === 'email' ? '邮件' :
                  group === 'cache' ? '缓存' :
                    group === 'database' ? '数据库' : group}
        </Tag>
      )
    },
    {
      title: '可编辑',
      dataIndex: 'isEditable',
      key: 'isEditable',
      width: 80,
      render: (isEditable) => (
        <Tag color={isEditable ? 'green' : 'red'}>
          {isEditable ? '是' : '否'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status, record) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          size="small"
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              if (tableRef.current) {
                tableRef.current.showEditModal(record);
              }
            }}
          >
            查看
          </Button>
          {record.isEditable && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                if (tableRef.current) {
                  tableRef.current.showEditModal(record);
                }
              }}
            >
              编辑
            </Button>
          )}
          <Popconfirm
            title="确定要删除这个参数吗？"
            onConfirm={() => handleDelete(record.id)}
            disabled={!record.isEditable}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={!record.isEditable}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 搜索配置
  const searchConfig = {
    fields: [
      {
        name: 'paramName',
        label: '参数名称',
        type: 'input',
        placeholder: '请输入参数名称',
        width: 200
      },
      {
        name: 'paramKey',
        label: '参数键',
        type: 'input',
        placeholder: '请输入参数键',
        width: 200
      },
      {
        name: 'paramGroup',
        label: '参数组',
        type: 'select',
        placeholder: '请选择参数组',
        width: 150,
        options: [
          { value: 'system', label: '系统' },
          { value: 'security', label: '安全' },
          { value: 'file', label: '文件' },
          { value: 'email', label: '邮件' },
          { value: 'cache', label: '缓存' },
          { value: 'database', label: '数据库' }
        ]
      },
      {
        name: 'paramType',
        label: '参数类型',
        type: 'select',
        placeholder: '请选择参数类型',
        width: 150,
        options: [
          { value: 'string', label: '字符串' },
          { value: 'number', label: '数字' },
          { value: 'boolean', label: '布尔' },
          { value: 'json', label: 'JSON' },
          { value: 'text', label: '文本' }
        ]
      },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        placeholder: '请选择状态',
        width: 120,
        options: [
          { value: 1, label: '启用' },
          { value: 0, label: '禁用' }
        ]
      }
    ]
  };

  // 弹窗配置
  const modalConfig = {
    addTitle: '新增参数',
    editTitle: '编辑参数',
    width: 700,
    fields: [
      {
        title: '基本信息',
        items: [
          {
            name: 'paramName',
            label: <span>参数名称 <span style={{ color: 'red' }}>*</span></span>,
            type: 'input',
            placeholder: '请输入参数名称',
            rules: [{ required: true, message: '请输入参数名称' }]
          },
          {
            name: 'paramKey',
            label: <span>参数键 <span style={{ color: 'red' }}>*</span></span>,
            type: 'input',
            placeholder: '请输入参数键，如：system.name',
            rules: [
              { required: true, message: '请输入参数键' },
              { pattern: /^[a-zA-Z][a-zA-Z0-9.]*$/, message: '参数键只能包含字母、数字和点号，且以字母开头' }
            ]
          },
          {
            name: 'paramValue',
            label: <span>参数值 <span style={{ color: 'red' }}>*</span></span>,
            type: 'textarea',
            placeholder: '请输入参数值',
            rows: 3,
            rules: [{ required: true, message: '请输入参数值' }]
          }
        ]
      },
      {
        title: '分类信息',
        items: [
          {
            name: 'paramType',
            label: <span>参数类型 <span style={{ color: 'red' }}>*</span></span>,
            type: 'select',
            options: [
              { value: 'string', label: '字符串' },
              { value: 'number', label: '数字' },
              { value: 'boolean', label: '布尔' },
              { value: 'json', label: 'JSON' },
              { value: 'text', label: '文本' }
            ],
            rules: [{ required: true, message: '请选择参数类型' }]
          },
          {
            name: 'paramGroup',
            label: <span>参数组 <span style={{ color: 'red' }}>*</span></span>,
            type: 'select',
            options: [
              { value: 'system', label: '系统' },
              { value: 'security', label: '安全' },
              { value: 'file', label: '文件' },
              { value: 'email', label: '邮件' },
              { value: 'cache', label: '缓存' },
              { value: 'database', label: '数据库' }
            ],
            rules: [{ required: true, message: '请选择参数组' }]
          }
        ]
      },
      {
        title: '权限设置',
        items: [
          {
            name: 'isEditable',
            label: '是否可编辑',
            type: 'radio',
            options: [
              { value: true, label: '可编辑' },
              { value: false, label: '只读' }
            ]
          },
          {
            name: 'isRequired',
            label: '是否必填',
            type: 'radio',
            options: [
              { value: true, label: '必填' },
              { value: false, label: '可选' }
            ]
          }
        ]
      },
      {
        title: '其他信息',
        items: [
          {
            name: 'description',
            label: '参数描述',
            type: 'textarea',
            placeholder: '请输入参数描述',
            rows: 3
          }
        ]
      }
    ]
  };

  return (
    <CommonTable
      ref={tableRef}
      title="系统参数管理"
      columns={columns}
      dataSource={params}
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
      addButtonText="新增参数"
      exportButtonText="导出参数"
      rowKey="id"
    ></CommonTable>
  );
};

export default Param;
