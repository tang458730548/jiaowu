import React, { useState, useEffect } from 'react';
import { 
  Tree, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Popconfirm, 
  Space, 
  Card,
  Row,
  Col,
  Typography,
  Tooltip,
  Badge,
  Spin,
  Select,
  Divider,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  FolderOutlined,
  FileOutlined,
  MenuOutlined,
  SettingOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { moduleAPI } from '../../api/platform/module';  
import { getIconByType, getIconMap } from '../../utils/iconUtils';

const { Title } = Typography;

// 图标选择器组件
const IconSelector = ({ value, onChange, ...props }) => {
  const iconMap = getIconMap();
  const iconList = [
    { name: 'UserOutlined', icon: iconMap['UserOutlined'], label: '用户' },
    { name: 'TeamOutlined', icon: iconMap['TeamOutlined'], label: '团队' },
    { name: 'AppstoreOutlined', icon: iconMap['AppstoreOutlined'], label: '应用' },
    { name: 'InfoCircleOutlined', icon: iconMap['InfoCircleOutlined'], label: '信息' },
    { name: 'DashboardOutlined', icon: iconMap['DashboardOutlined'], label: '仪表板' },
    { name: 'TableOutlined', icon: iconMap['TableOutlined'], label: '表格' },
    { name: 'FormOutlined', icon: iconMap['FormOutlined'], label: '表单' },
    { name: 'CalendarOutlined', icon: iconMap['CalendarOutlined'], label: '日历' },
    { name: 'BarChartOutlined', icon: iconMap['BarChartOutlined'], label: '柱状图' },
    { name: 'PieChartOutlined', icon: iconMap['PieChartOutlined'], label: '饼图' },
    { name: 'LineChartOutlined', icon: iconMap['LineChartOutlined'], label: '折线图' },
    { name: 'BookOutlined', icon: iconMap['BookOutlined'], label: '书籍' },
    { name: 'FileTextOutlined', icon: iconMap['FileTextOutlined'], label: '文档' },
    { name: 'PictureOutlined', icon: iconMap['PictureOutlined'], label: '图片' },
    { name: 'VideoCameraOutlined', icon: iconMap['VideoCameraOutlined'], label: '视频' },
    { name: 'AudioOutlined', icon: iconMap['AudioOutlined'], label: '音频' },
    { name: 'CloudOutlined', icon: iconMap['CloudOutlined'], label: '云' },
    { name: 'DatabaseOutlined', icon: iconMap['DatabaseOutlined'], label: '数据库' },
    { name: 'ApiOutlined', icon: iconMap['ApiOutlined'], label: 'API' },
    { name: 'ToolOutlined', icon: iconMap['ToolOutlined'], label: '工具' },
    { name: 'SafetyOutlined', icon: iconMap['SafetyOutlined'], label: '安全' },
    { name: 'LockOutlined', icon: iconMap['LockOutlined'], label: '锁' },
    { name: 'KeyOutlined', icon: iconMap['KeyOutlined'], label: '钥匙' },
    { name: 'BellOutlined', icon: iconMap['BellOutlined'], label: '铃铛' },
    { name: 'MailOutlined', icon: iconMap['MailOutlined'], label: '邮件' },
    { name: 'PhoneOutlined', icon: iconMap['PhoneOutlined'], label: '电话' },
    { name: 'GlobalOutlined', icon: iconMap['GlobalOutlined'], label: '全球' },
    { name: 'EnvironmentOutlined', icon: iconMap['EnvironmentOutlined'], label: '环境' },
    { name: 'HomeOutlined', icon: iconMap['HomeOutlined'], label: '首页' },
    { name: 'ShopOutlined', icon: iconMap['ShopOutlined'], label: '商店' },
    { name: 'CarOutlined', icon: iconMap['CarOutlined'], label: '汽车' },
    { name: 'RocketOutlined', icon: iconMap['RocketOutlined'], label: '火箭' },
    { name: 'StarOutlined', icon: iconMap['StarOutlined'], label: '星星' },
    { name: 'HeartOutlined', icon: iconMap['HeartOutlined'], label: '心形' },
    { name: 'LikeOutlined', icon: iconMap['LikeOutlined'], label: '点赞' },
    { name: 'DislikeOutlined', icon: iconMap['DislikeOutlined'], label: '点踩' },
    { name: 'SmileOutlined', icon: iconMap['SmileOutlined'], label: '微笑' },
    { name: 'FrownOutlined', icon: iconMap['FrownOutlined'], label: '皱眉' },
    { name: 'MehOutlined', icon: iconMap['MehOutlined'], label: '中性' },
    { name: 'CrownOutlined', icon: iconMap['CrownOutlined'], label: '皇冠' },
    { name: 'TrophyOutlined', icon: iconMap['TrophyOutlined'], label: '奖杯' },
    { name: 'GiftOutlined', icon: iconMap['GiftOutlined'], label: '礼物' },
    { name: 'FireOutlined', icon: iconMap['FireOutlined'], label: '火焰' },
    { name: 'ThunderboltOutlined', icon: iconMap['ThunderboltOutlined'], label: '闪电' },
    { name: 'BulbOutlined', icon: iconMap['BulbOutlined'], label: '灯泡' },
    { name: 'ExperimentOutlined', icon: iconMap['ExperimentOutlined'], label: '实验' },
    { name: 'CompassOutlined', icon: iconMap['CompassOutlined'], label: '指南针' },
    { name: 'FlagOutlined', icon: iconMap['FlagOutlined'], label: '旗帜' },
    { name: 'MenuOutlined', icon: iconMap['MenuOutlined'], label: '菜单' },
    { name: 'SettingOutlined', icon: iconMap['SettingOutlined'], label: '设置' },
    { name: 'FolderOutlined', icon: iconMap['FolderOutlined'], label: '文件夹' },
    { name: 'FileOutlined', icon: iconMap['FileOutlined'], label: '文件' }
  ];

  const [visible, setVisible] = useState(false);

  const handleIconSelect = (iconName) => {
    onChange(iconName);
    setVisible(false);
  };

  return (
    <div>
      <Input
        {...props}
        placeholder="请选择图标"
        value={value}
        readOnly
        onClick={() => setVisible(true)}
        suffix={
          value ? (
            <span style={{ fontSize: '16px' }}>
              {iconList.find(item => item.name === value)?.icon}
            </span>
          ) : (
            <SettingOutlined />
          )
        }
      />
      <Modal
        title="选择图标"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={600}
        bodyStyle={{ maxHeight: '400px', overflow: 'auto' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
          {iconList.map((item) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 8px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: value === item.name ? '#e6f7ff' : '#fff',
                borderColor: value === item.name ? '#1890ff' : '#d9d9d9'
              }}
              onClick={() => handleIconSelect(item.name)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = value === item.name ? '#e6f7ff' : '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = value === item.name ? '#e6f7ff' : '#fff';
              }}
            >
              <span style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

const ModuleManagement = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [editingNode, setEditingNode] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);

  // 加载模块树数据
  const loadModuleTree = async () => {
    setTreeLoading(true);
    try {
      const response = await moduleAPI.getModuleTree();
      // 处理后端返回的数据，添加图标
      const processedData = processTreeData(response.data || response);
      setTreeData(processedData);
      
      // 设置默认展开的节点
      const defaultExpandedKeys = processedData.map(item => item.key);
      setExpandedKeys(defaultExpandedKeys);
    } catch (error) {
      message.error('加载模块树失败：' + (error.message || '未知错误'));
      // 如果接口失败，使用空数据
      setTreeData([]);
      setExpandedKeys([]);
    } finally {
      setTreeLoading(false);
    }
  };

  // 处理树形数据
  const processTreeData = (data) => {
    return data.map(item => {
      return {
        ...item,
        key: item.id.toString(),
        title: item.moduleName,
        isVisible: item.isVisible,
        isEnabled: item.isEnabled,
        moduleData: item, // 保存原始模块数据，用于编辑时获取正确的字段值
        children: item.children ? processTreeData(item.children) : undefined
      };
    });
  };

  // 根据类型和icon字段获取图标
  const getModuleIcon = (moduleType, hasChildren, iconName) => {
    return getIconByType(iconName, moduleType, hasChildren);
  };

  // 生成父级模块选项
  const generateParentOptions = (data, level = 0, excludeKey = null) => {
    const options = [];
    
    data.forEach(item => {
      // 排除当前编辑的节点
      if (item.key === excludeKey) {
        return;
      }
      
      const prefix = '　'.repeat(level); // 使用全角空格作为缩进
      const hasChildren = item.children && item.children.length > 0;
      const icon = hasChildren ? '📁' : '📄';
      
      options.push({
        value: item.key,
        label: `${prefix}${icon} ${item.title}`,
        disabled: false
      });
      
      // 递归处理子节点，但排除当前编辑节点的所有子节点
      if (item.children && item.children.length > 0) {
        const childOptions = generateParentOptions(item.children, level + 1, excludeKey);
        options.push(...childOptions);
      }
    });
    
    return options;
  };

  useEffect(() => {
    loadModuleTree();
  }, []);

  // 生成唯一key
  const generateKey = () => {
    return Date.now().toString();
  };

  // 递归查找节点
  const findNode = (data, key) => {
    for (const item of data) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const found = findNode(item.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // 递归删除节点
  const removeNode = (data, key) => {
    return data.map(item => {
      if (item.key === key) {
        return null;
      }
      if (item.children) {
        item.children = removeNode(item.children, key).filter(Boolean);
      }
      return item;
    }).filter(Boolean);
  };

  // 递归更新节点
  const updateNode = (data, key, newData) => {
    return data.map(item => {
      if (item.key === key) {
        return { ...item, ...newData };
      }
      if (item.children) {
        item.children = updateNode(item.children, key, newData);
      }
      return item;
    });
  };

  // 递归添加节点
  const addNode = (data, parentKey, newNode) => {
    return data.map(item => {
      if (item.key === parentKey) {
        if (!item.children) {
          item.children = [];
        }
        item.children.push(newNode);
      } else if (item.children) {
        item.children = addNode(item.children, parentKey, newNode);
      }
      return item;
    });
  };

  // 设置编辑状态
  const setEditMode = (node = null, parentKey = null) => {
    setEditingNode({ node, parentKey });
    
    if (node) {
      // 使用原始模块数据中的字段值
      const originalData = node.moduleData || node;
      form.setFieldsValue({
        moduleName: node.title,
        moduleCode: originalData.moduleCode || '',
        moduleType: originalData.moduleType || 1,
        parentId: originalData.parentId || 0,
        level: originalData.level || 1,
        icon: originalData.icon || '',
        path: originalData.path || '',
        component: originalData.component || '',
        permission: originalData.permission || '',
        sortOrder: originalData.sortOrder || 0,
        isVisible: originalData.isVisible === 1,
        isEnabled: originalData.isEnabled === 1,
        description: originalData.description || ''
      });
    } else {
      form.resetFields();
      // 计算新模块的level
      const newLevel = calculateLevel(parentKey);
      form.setFieldsValue({
        parentId: parentKey || 0,
        level: newLevel,
        moduleType: 0, // 默认选择目录类型
        isVisible: true,
        isEnabled: true
      });
    }
  };

  // 计算模块层级
  const calculateLevel = (parentId) => {
    if (!parentId || parentId === 0) {
      return 1; // 根模块层级为1
    }
    
    // 查找父级模块
    const parentNode = findNode(treeData, parentId.toString());
    if (parentNode) {
      const parentLevel = parentNode.moduleData?.level || 1;
      return parentLevel + 1;
    }
    
    return 1; // 默认层级为1
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { moduleName, moduleCode, moduleType, parentId, icon, path, component, permission, sortOrder, isVisible, isEnabled, description } = values;
      setLoading(true);
      
      // 计算模块层级
      const level = calculateLevel(parentId);
      
      if (editingNode.node) {
        // 编辑模式
        await moduleAPI.updateModule(editingNode.node.key, {
          moduleName,
          moduleCode,
          moduleType,
          parentId: parentId || 0,
          level, // 添加level字段
          icon,
          path,
          component,
          permission,
          sortOrder: sortOrder || 0,
          isVisible: isVisible ? 1 : 0,
          isEnabled: isEnabled ? 1 : 0,
          description
        });
        message.success('模块更新成功！');
      } else {
        // 添加模式
        await moduleAPI.createModule({
          moduleName,
          moduleCode,
          moduleType,
          parentId: parentId || 0,
          level, // 添加level字段
          icon,
          path,
          component,
          permission,
          sortOrder: sortOrder || 0,
          isVisible: isVisible ? 1 : 0,
          isEnabled: isEnabled ? 1 : 0,
          description
        });
        message.success('模块添加成功！');
      }
      
      // 重新加载模块树
      await loadModuleTree();
      form.resetFields();
      setEditingNode(null);
      setSelectedKeys([]);
    } catch (error) {
      message.error('操作失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 删除节点
  const handleDelete = async (key) => {
    try {
      const node = findNode(treeData, key);
      if (node && node.children && node.children.length > 0) {
        message.warning('该模块下还有子模块，请先删除子模块！');
        return;
      }
      
      await moduleAPI.deleteModule(key);
      message.success('模块删除成功！');
      
      // 重新加载模块树
      await loadModuleTree();
    } catch (error) {
      message.error('删除失败：' + (error.message || '未知错误'));
    }
  };

  // 添加根节点
  const addRootNode = () => {
    setEditMode(null, null);
  };

  // 添加子节点
  const addChildNode = (parentKey) => {
    setEditMode(null, parentKey);
  };

  // 添加子目录
  const addChildDirectory = (parentKey) => {
    setEditMode(null, parentKey);
    // 设置默认值为目录类型
    setTimeout(() => {
      form.setFieldsValue({
        moduleType: 0
      });
    }, 100);
  };

  // 编辑节点
  const editNode = (node) => {
    setEditMode(node, null);
  };

  // 渲染节点标题
  const renderTitle = (node) => {
    const hasChildren = node.children && node.children.length > 0;
    const isDirectory = node.moduleData?.moduleType === 0;
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <span style={{ 
          color: isDirectory || hasChildren ? '#faad14' : '#1890ff', 
          marginRight: 8,
          fontSize: '16px'
        }}>
          {isDirectory || hasChildren ? <FolderOutlined /> : <FileOutlined />}
        </span>
        <span>{node.title}</span>
      </div>
    );
  };

  // 处理树节点选择
  const onSelect = (selectedKeys, info) => {
    setSelectedKeys(selectedKeys);
    
    // 当选择节点时，自动进入编辑模式
    if (selectedKeys.length > 0) {
      const selectedNode = findNode(treeData, selectedKeys[0]);
      if (selectedNode) {
        setEditMode(selectedNode, null);
      }
    } else {
      form.resetFields();
      setEditingNode(null);
    }
  };

  // 处理树节点展开
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0, marginBottom: 16 }}>
            <MenuOutlined style={{ marginRight: 8 }} />
            模块管理
          </Title>
        </div>
        
        <Row gutter={24} style={{ height: 'calc(100vh - 200px)' }}>
          <Col span={8}>
            <Card title="模块树" size="small" style={{ height: '100%' }}>
              <Spin spinning={treeLoading}>
                <Tree
                  treeData={treeData}
                  selectedKeys={selectedKeys}
                  expandedKeys={expandedKeys}
                  onSelect={onSelect}
                  onExpand={onExpand}
                  titleRender={renderTitle}
                  showLine
                  style={{ height: 'calc(100vh - 280px)', overflow: 'auto' }}
                />
              </Spin>
            </Card>
          </Col>
          
          <Col span={16}>
            <Card 
              title={editingNode?.node ? '编辑模块' : editingNode ? '新增模块' : '模块信息'} 
              size="small"
              style={{ height: '100%' }}
            >
              <div style={{ height: 'calc(100vh - 280px)' }}>
                {/* 操作按钮区域 */}
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    {editingNode && selectedKeys.length > 0 ? (
                      <>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />}
                          onClick={() => {
                            if (editingNode.node) {
                              addChildNode(editingNode.node.key);
                            } else if (editingNode.parentKey) {
                              addChildNode(editingNode.parentKey);
                            }
                          }}
                        >
                          新增
                        </Button>
                        <Button 
                          type="primary" 
                          htmlType="submit" 
                          loading={loading}
                          onClick={() => form.submit()}
                        >
                          修改
                        </Button>
                        {editingNode.node && (
                          <Popconfirm
                            title="确定要删除这个模块吗？"
                            onConfirm={() => {
                              if (editingNode.node) {
                                handleDelete(editingNode.node.key);
                              }
                            }}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button 
                              danger 
                              icon={<DeleteOutlined />}
                            >
                              删除
                            </Button>
                          </Popconfirm>
                        )}
                      </>
                    ) : selectedKeys.length > 0 && (
                      <>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const selectedNode = findNode(treeData, selectedKeys[0]);
                            if (selectedNode) {
                              addChildNode(selectedNode.key);
                            }
                          }}
                        >
                          新增
                        </Button>
                        <Button 
                          icon={<EditOutlined />}
                          onClick={() => {
                            const selectedNode = findNode(treeData, selectedKeys[0]);
                            if (selectedNode) {
                              editNode(selectedNode);
                            }
                          }}
                        >
                          修改
                        </Button>
                        <Button 
                          type="primary" 
                          icon={<FolderOutlined />}
                          onClick={() => {
                            const selectedNode = findNode(treeData, selectedKeys[0]);
                            if (selectedNode) {
                              addChildDirectory(selectedNode.key);
                            }
                          }}
                        >
                          添加
                        </Button>
                        <Popconfirm
                          title="确定要删除这个模块吗？"
                          onConfirm={() => {
                            if (selectedKeys.length > 0) {
                              handleDelete(selectedKeys[0]);
                            }
                          }}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button 
                            danger 
                            icon={<DeleteOutlined />}
                          >
                            删除
                          </Button>
                        </Popconfirm>
                      </>
                    )}
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={addRootNode}
                    >
                      添加根目录
                    </Button>
                    <Button 
                      icon={<ReloadOutlined />} 
                      onClick={loadModuleTree}
                      loading={treeLoading}
                    >
                      刷新
                    </Button>
                  </Space>
                </div>
                
                {editingNode ? (
                  <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="moduleName" label={<span>模块名称 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请输入模块名称' }]}>
                          <Input placeholder="请输入模块名称" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="moduleCode" label={<span>模块编码 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请输入模块编码' }]}>
                          <Input placeholder="请输入模块编码" />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="moduleType" label={<span>模块类型 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请选择模块类型' }]}>
                          <Select placeholder="请选择模块类型">
                            <Select.Option value={0}>目录</Select.Option>
                            <Select.Option value={1}>菜单</Select.Option>
                            <Select.Option value={2}>按钮</Select.Option>
                            <Select.Option value={3}>页面</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="parentId" label="父级模块">
                          <Select 
                            placeholder="请选择父级模块" 
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(value) => {
                              const newLevel = calculateLevel(value);
                              form.setFieldsValue({ level: newLevel });
                            }}
                          >
                            <Select.Option value={0}>无（根模块）</Select.Option>
                            {generateParentOptions(treeData, 0, editingNode?.node ? editingNode.node.key : null).map(option => (
                              <Select.Option key={option.value} value={option.value} disabled={option.disabled}>
                                {option.label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="level" label="模块层级">
                          <Input placeholder="模块层级" readOnly />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="icon" label="图标">
                          <IconSelector />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="path" label="路由路径">
                          <Input placeholder="请输入路由路径" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="component" label="组件路径">
                          <Input placeholder="请输入组件路径" />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="permission" label="权限标识">
                          <Input placeholder="请输入权限标识" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="sortOrder" label="排序号">
                          <Input placeholder="请输入排序号" type="number" />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="isVisible" label="是否可见" valuePropName="checked">
                          <Switch 
                            checkedChildren="可见" 
                            unCheckedChildren="隐藏"
                            defaultChecked={true}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="isEnabled" label="是否启用" valuePropName="checked">
                          <Switch 
                            checkedChildren="启用" 
                            unCheckedChildren="禁用"
                            defaultChecked={true}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Form.Item name="description" label="模块描述">
                      <Input.TextArea placeholder="请输入模块描述" rows={3} />
                    </Form.Item>
                    
                    <Form.Item>
                      <Space>
                        <Button 
                          type="primary" 
                          htmlType="submit" 
                          loading={loading}
                        >
                          {editingNode?.node ? '确认修改' : '确认新增'}
                        </Button>
                        <Button 
                          onClick={() => {
                            form.resetFields();
                            setEditingNode(null);
                            setSelectedKeys([]);
                          }}
                        >
                          取消
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                ) : (
                  <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                    {selectedKeys.length > 0 ? '请选择一个模块查看详细信息' : '请选择一个模块进行编辑或点击添加按钮新增模块'}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Card>


    </div>
  );
};

export default ModuleManagement; 