import React, { useState, useEffect } from 'react';
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
  DeleteOutlined 
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
const CommonTable = ({
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
  rowKey = 'id'
}) => {
  const [searchForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

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

  // 显示新增弹窗
  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    if (modalConfig.defaultValues) {
      form.setFieldsValue(modalConfig.defaultValues);
    }
    setModalVisible(true);
  };

  // 显示编辑弹窗
  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
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

    return (
      <div style={{ marginBottom: 16, padding: '16px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
        <Form 
          form={searchForm} 
          layout="inline" 
          onFinish={handleSearch}
          style={{ marginBottom: 0 }}
        >
          {searchConfig.fields.map((field, index) => (
            <Form.Item key={index} name={field.name} label={field.label}>
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
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  // 渲染操作按钮
  const renderActionButtons = () => {
    return (
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                {section.items.map((item, itemIndex) => (
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
                ))}
              </div>
            ))}
            <Divider style={{margin:'16px 0 8px 0'}}/>
            <div style={{textAlign:'center'}}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                style={{minWidth:120,marginRight:16}}
              >
                提交
              </Button>
              <Button 
                onClick={()=>setModalVisible(false)} 
                style={{minWidth:100}}
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
      {renderSearchForm()}
      {renderActionButtons()}
      
      <Table
        rowKey={rowKey}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        bordered
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
          pageSizeOptions: ['10', '20', '50', '100'],
          size: 'default'
        }}
        onChange={onTableChange}
      />

      {renderModal()}
    </div>
  );
};

export default CommonTable; 