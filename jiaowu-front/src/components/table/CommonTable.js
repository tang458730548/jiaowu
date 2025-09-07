import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Select,
  Radio,
  Divider,
  DatePicker,
  Tooltip,
  Tag,
  InputNumber,
  Switch
} from 'antd';
import {
  ReloadOutlined,
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

/**
 * 通用表格组件
 * @param {Object} props
 * @param {string} props.title - 页面标题
 * @param {Array} props.columns - 表格列配置
 * @param {Array} props.dataSource - 数据源
 * @param {boolean} props.loading - 加载状态
 * @param {Object} props.pagination - 分页配置
 * @param {Function} props.onTableChange - 表格变化回调
 * @param {Function} props.onSearch - 搜索回调
 * @param {Function} props.onReset - 重置回调
 * @param {Function} props.onAdd - 新增回调
 * @param {Function} props.onEdit - 编辑回调
 * @param {Function} props.onDelete - 删除回调
 * @param {Function} props.onExport - 导出回调
 * @param {Function} props.onRefresh - 刷新回调
 * @param {Function} props.onStatusChange - 状态变化回调
 * @param {Object} props.searchConfig - 搜索配置
 * @param {Object} props.modalConfig - 弹窗配置
 * @param {string} props.addButtonText - 新增按钮文本
 * @param {string} props.exportButtonText - 导出按钮文本
 * @param {boolean} props.showAddButton - 是否显示新增按钮
 * @param {boolean} props.showExportButton - 是否显示导出按钮
 * @param {boolean} props.showRefreshButton - 是否显示刷新按钮
 */
const CommonTable = forwardRef(({
  title = '数据列表',
  columns = [],
  dataSource = [],
  loading = false,
  pagination = {},
  onTableChange,
  onSearch,
  onReset,
  onAdd,
  onEdit,
  onDelete,
  onExport,
  onRefresh,
  onStatusChange,
  searchConfig = {},
  modalConfig = {},
  addButtonText = '新增',
  exportButtonText = '导出数据',
  showAddButton = true,
  showExportButton = true,
  showRefreshButton = true,
  rowKey = 'id',
  tableScrollY = 350,
}, ref) => {
  const [searchForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [tableSorter, setTableSorter] = useState({ sortField: null, sortOrder: null });
  const [searchExpanded, setSearchExpanded] = useState(false); // 搜索区域展开状态

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    showEditModal: (record) => {
      setEditingRecord(record);
      form.setFieldsValue(record);
      setModalVisible(true);
    }
  }));

  // 处理搜索
  const handleSearch = (values) => {
    if (onSearch) {
      onSearch(values);
    }
  };

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields();
    if (onReset) {
      onReset();
    }
  };

  // 切换搜索区域展开状态
  const toggleSearchExpanded = () => {
    setSearchExpanded(!searchExpanded);
  };

  // 显示新增弹窗
  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    if (modalConfig.defaultValues) {
      form.setFieldsValue(modalConfig.defaultValues);
    }
    setModalVisible(true);
  };

  // 处理弹窗确认
  const handleModalOk = () => {
    form.validateFields().then(async values => {
      try {
        if (editingRecord) {
          if (onEdit) {
            await onEdit(editingRecord.id, values);
          }
        } else {
          if (onAdd) {
            await onAdd(values);
          }
        }
        setModalVisible(false);
      } catch (error) {
        message.error(error.message || (editingRecord ? '修改失败' : '添加失败'));
      }
    });
  };

  // 处理删除
  const handleDelete = async (id) => {
    if (onDelete) {
      await onDelete(id);
    }
  };

  // 处理状态变化
  const handleStatusChange = async (id, value) => {
    if (onStatusChange) {
      await onStatusChange(id, value);
    }
  };

  // 处理导出
  const handleExport = async () => {
    if (onExport) {
      await onExport();
    }
  };

  // 处理刷新
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // 渲染搜索表单
  const renderSearchForm = () => {
    if (!searchConfig.fields || searchConfig.fields.length === 0) {
      return null;
    }

    const fields = searchConfig.fields;
    const hasMoreThanThree = fields.length > 3;
    
    // 将字段按每行3个进行分组
    const groupFields = (fields) => {
      const groups = [];
      for (let i = 0; i < fields.length; i += 3) {
        groups.push(fields.slice(i, i + 3));
      }
      return groups;
    };

    const allFieldGroups = groupFields(fields);
    const firstRowFields = allFieldGroups[0] || [];
    const expandedFields = allFieldGroups.slice(1).flat(); // 展开的字段（第4个及以后）

    return (
      <div style={{
        marginBottom: 8,
        backgroundColor: '#fafafa',
        borderRadius: '6px',
        padding: '8px',
        position: 'relative',
        zIndex: searchExpanded ? 10 : 1 // 展开时提高层级
      }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 0 }}
        >
          {/* 第一行：始终显示前3个字段 */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: searchExpanded && expandedFields.length > 0 ? '8px' : '0',
            alignItems: 'center'
          }}>
            {firstRowFields.map((field, fieldIndex) => (
              <Form.Item key={fieldIndex} name={field.name} label={field.label} style={{ marginBottom: 0 }}>
              {field.type === 'select' ? (
                <Select
                  placeholder={field.placeholder}
                  allowClear
                  style={{ width: field.width || 200 }}
                  options={field.options}
                />
              ) : field.type === 'number' ? (
                <InputNumber
                  placeholder={field.placeholder}
                  style={{ width: field.width || 200 }}
                  min={field.min}
                  max={field.max}
                />
              ) : (
                <Input
                  placeholder={field.placeholder}
                  allowClear
                  style={{ width: field.width || 200 }}
                />
              )}
            </Form.Item>
          ))}
            
            {/* 操作按钮 */}
            <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              重置
            </Button>
              {hasMoreThanThree && (
                <Button
                  type="primary"
                  icon={searchExpanded ? <UpOutlined /> : <DownOutlined />}
                  onClick={toggleSearchExpanded}
                  style={{ marginLeft: 8 }}
                >
                  {searchExpanded ? '收起' : '展开更多'}
                </Button>
              )}
          </Form.Item>
          </div>
        </Form>

        {/* 展开的额外字段 - 使用绝对定位覆盖在操作按钮区域上方 */}
        {searchExpanded && hasMoreThanThree && expandedFields.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fafafa',
            border: '1px solid #d9d9d9',
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            padding: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 11
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center'
            }}>
              {expandedFields.map((field, fieldIndex) => (
                <Form.Item key={`expanded-${fieldIndex}`} name={field.name} label={field.label} style={{ marginBottom: 0 }}>
                  {field.type === 'select' ? (
                    <Select
                      placeholder={field.placeholder}
                      allowClear
                      style={{ width: field.width || 200 }}
                      options={field.options}
                    />
                  ) : field.type === 'number' ? (
                    <InputNumber
                      placeholder={field.placeholder}
                      style={{ width: field.width || 200 }}
                      min={field.min}
                      max={field.max}
                    />
                  ) : (
                    <Input
                      placeholder={field.placeholder}
                      allowClear
                      style={{ width: field.width || 200 }}
                    />
                  )}
                </Form.Item>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染操作按钮
  const renderActionButtons = () => {
    return (
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {showAddButton && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddModal}
              style={{ marginRight: 8 }}
            >
              {addButtonText}
            </Button>
          )}
          {showExportButton && (
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              style={{ marginRight: 8 }}
            >
              {exportButtonText}
            </Button>
          )}
        </div>
        {showRefreshButton && (
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>
        )}
      </div>
    );
  };

  // 渲染弹窗
  const renderModal = () => {
    if (!modalConfig.fields || modalConfig.fields.length === 0) {
      return null;
    }

    return (
      <Modal
        title={editingRecord ? modalConfig.editTitle || '编辑' : modalConfig.addTitle || '新增'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
        confirmLoading={loading}
        width={modalConfig.width || 650}
        footer={null}
        bodyStyle={{ maxHeight: '70vh', overflow: 'hidden' }}
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
          <Form
            form={form}
            layout="horizontal"
            onFinish={handleModalOk}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {modalConfig.fields.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <Divider orientation="left" style={{ fontWeight: 'bold' }}>
                    {section.title}
                  </Divider>
                )}
                {section.items.map((item, itemIndex) => {
                  // 检查是否在编辑模式下且该字段设置了 showInEdit: false
                  if (editingRecord && item.showInEdit === false) {
                    return null; // 编辑时不显示该字段
                  }

                  return (
                    <Form.Item
                      key={itemIndex}
                      name={item.name}
                      label={item.label}
                      rules={item.rules}
                    >
                      {item.type === 'input' && (
                        <Input placeholder={item.placeholder} />
                      )}
                      {item.type === 'password' && (
                        <Input.Password placeholder={item.placeholder} />
                      )}
                      {item.type === 'textarea' && (
                        <TextArea placeholder={item.placeholder} rows={item.rows || 4} />
                      )}
                      {item.type === 'select' && (
                        <Select placeholder={item.placeholder}>
                          {item.options.map(option => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                      {item.type === 'radio' && (
                        <Radio.Group>
                          {item.options.map(option => (
                            <Radio key={option.value} value={option.value}>
                              {option.label}
                            </Radio>
                          ))}
                        </Radio.Group>
                      )}
                      {item.type === 'number' && (
                        <InputNumber
                          placeholder={item.placeholder}
                          style={{ width: '100%' }}
                          min={item.min}
                          max={item.max}
                        />
                      )}
                      {item.type === 'date' && (
                        <DatePicker
                          showTime={item.showTime}
                          style={{ width: '100%' }}
                          disabled={item.disabled}
                        />
                      )}
                      {item.type === 'switch' && (
                        <Switch
                          checkedChildren={item.checkedText}
                          unCheckedChildren={item.uncheckedText}
                        />
                      )}
                    </Form.Item>
                  );
                })}
              </div>
            ))}
            <Divider style={{ margin: '16px 0 8px 0' }} />
            <div style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ minWidth: 120, marginRight: 16 }}
              >
                提交
              </Button>
              <Button
                onClick={() => setModalVisible(false)}
                style={{ minWidth: 100 }}
              >
                取消
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      {/* 搜索区域 */}
        {renderSearchForm()}

      {/* 操作按钮区域 */}
        {renderActionButtons()}

      {/* 表格区域 - 添加容器确保滚动条正确显示 */}
      <div style={{
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        overflow: 'auto' // 确保滚动条显示
        }}>
          <Table
            rowKey={rowKey}
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            bordered={false}
            pagination={false}
            size="small"
            style={{ 
              margin: 0,
            }}
            onChange={(paginationArg, filtersArg, sorterArg) => {
              const sorterItem = Array.isArray(sorterArg) ? (sorterArg[0] || {}) : (sorterArg || {});
              const sortField = (sorterItem.field || sorterItem.columnKey) || null;
              const sortOrder = sorterItem.order || null;
              setTableSorter({ sortField, sortOrder });
              const safePageSize = Number(pagination.pageSize) || 10;
              if (onTableChange) {
                onTableChange(
                  { current: 1, pageSize: safePageSize, total: Number(pagination.total) || 0 },
                  {},
                  { field: sortField, order: sortOrder }
                );
              }
            }}
            scroll={{ 
            y: tableScrollY,
            }}
          />
        </div>

      {/* 分页区域 */}
        <div style={{
        padding: '8px 12px',
          backgroundColor: '#fafafa',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        minHeight: '48px'
        }}>
          {(() => {
            const total = Number(pagination.total) || 0;
            const pageSize = Number(pagination.pageSize) || 10;
            const currentPage = Number(pagination.current) || 1;
            const totalPages = Math.max(1, Math.ceil(total / pageSize));
            const canGoPrev = currentPage > 1;
            const canGoNext = currentPage < totalPages && totalPages > 0;

            return (
              <>
                <div style={{ color: '#666', fontSize: '13px' }}>
                  共 {total} 条记录
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button
                    size="small"
                    disabled={!canGoPrev}
                    onClick={() => onTableChange && onTableChange(
                      { current: canGoPrev ? currentPage - 1 : 1, pageSize, total },
                      {},
                      { field: tableSorter.sortField, order: tableSorter.sortOrder }
                    )}
                    style={{ height: '28px', fontSize: '12px' }}
                  >
                    上一页
                  </Button>
                  <span style={{ fontSize: '13px', color: '#666', margin: '0 4px' }}>
                    第 {currentPage} 页，共 {totalPages} 页
                  </span>
                  <Button
                    size="small"
                    disabled={!canGoNext}
                    onClick={() => onTableChange && onTableChange(
                      { current: canGoNext ? currentPage + 1 : totalPages, pageSize, total },
                      {},
                      { field: tableSorter.sortField, order: tableSorter.sortOrder }
                    )}
                    style={{ height: '28px', fontSize: '12px' }}
                  >
                    下一页
                  </Button>
                  <Select
                    size="small"
                    value={pageSize}
                    onChange={(value) => onTableChange && onTableChange(
                      { current: 1, pageSize: Number(value) || 10, total },
                      {},
                      { field: tableSorter.sortField, order: tableSorter.sortOrder }
                    )}
                    style={{ width: 80, height: '28px' }}
                  >
                    <Option value={10}>10条/页</Option>
                    <Option value={20}>20条/页</Option>
                    <Option value={50}>50条/页</Option>
                    <Option value={100}>100条/页</Option>
                  </Select>
                </div>
              </>
            );
          })()}
      </div>

      {renderModal()}
    </div>
  );
});

export default CommonTable; 