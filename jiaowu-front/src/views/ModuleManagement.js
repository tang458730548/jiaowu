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
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  DashboardOutlined,
  TableOutlined,
  FormOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BookOutlined,
  FileTextOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  CloudOutlined,
  DatabaseOutlined,
  ApiOutlined,
  ToolOutlined,
  SafetyOutlined,
  LockOutlined,
  KeyOutlined,
  BellOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  ShopOutlined,
  CarOutlined,
  RocketOutlined,
  StarOutlined,
  HeartOutlined,
  LikeOutlined,
  DislikeOutlined,
  SmileOutlined,
  FrownOutlined,
  MehOutlined,
  CrownOutlined,
  TrophyOutlined,
  GiftOutlined,
  FireOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  ExperimentOutlined,
  CompassOutlined,
  FlagOutlined,
  TrophyOutlined as TrophyIcon,
  GiftOutlined as GiftIcon
} from '@ant-design/icons';
import { moduleAPI } from '../api/module';

const { Title } = Typography;

// 图标选择器组件
const IconSelector = ({ value, onChange, ...props }) => {
  const iconList = [
    { name: 'UserOutlined', icon: <UserOutlined />, label: '用户' },
    { name: 'TeamOutlined', icon: <TeamOutlined />, label: '团队' },
    { name: 'AppstoreOutlined', icon: <AppstoreOutlined />, label: '应用' },
    { name: 'InfoCircleOutlined', icon: <InfoCircleOutlined />, label: '信息' },
    { name: 'DashboardOutlined', icon: <DashboardOutlined />, label: '仪表板' },
    { name: 'TableOutlined', icon: <TableOutlined />, label: '表格' },
    { name: 'FormOutlined', icon: <FormOutlined />, label: '表单' },
    { name: 'CalendarOutlined', icon: <CalendarOutlined />, label: '日历' },
    { name: 'BarChartOutlined', icon: <BarChartOutlined />, label: '柱状图' },
    { name: 'PieChartOutlined', icon: <PieChartOutlined />, label: '饼图' },
    { name: 'LineChartOutlined', icon: <LineChartOutlined />, label: '折线图' },
    { name: 'BookOutlined', icon: <BookOutlined />, label: '书籍' },
    { name: 'FileTextOutlined', icon: <FileTextOutlined />, label: '文档' },
    { name: 'PictureOutlined', icon: <PictureOutlined />, label: '图片' },
    { name: 'VideoCameraOutlined', icon: <VideoCameraOutlined />, label: '视频' },
    { name: 'AudioOutlined', icon: <AudioOutlined />, label: '音频' },
    { name: 'CloudOutlined', icon: <CloudOutlined />, label: '云' },
    { name: 'DatabaseOutlined', icon: <DatabaseOutlined />, label: '数据库' },
    { name: 'ApiOutlined', icon: <ApiOutlined />, label: 'API' },
    { name: 'ToolOutlined', icon: <ToolOutlined />, label: '工具' },
    { name: 'SafetyOutlined', icon: <SafetyOutlined />, label: '安全' },
    { name: 'LockOutlined', icon: <LockOutlined />, label: '锁' },
    { name: 'KeyOutlined', icon: <KeyOutlined />, label: '钥匙' },
    { name: 'BellOutlined', icon: <BellOutlined />, label: '铃铛' },
    { name: 'MailOutlined', icon: <MailOutlined />, label: '邮件' },
    { name: 'PhoneOutlined', icon: <PhoneOutlined />, label: '电话' },
    { name: 'GlobalOutlined', icon: <GlobalOutlined />, label: '全球' },
    { name: 'EnvironmentOutlined', icon: <EnvironmentOutlined />, label: '环境' },
    { name: 'HomeOutlined', icon: <HomeOutlined />, label: '首页' },
    { name: 'ShopOutlined', icon: <ShopOutlined />, label: '商店' },
    { name: 'CarOutlined', icon: <CarOutlined />, label: '汽车' },
    { name: 'RocketOutlined', icon: <RocketOutlined />, label: '火箭' },
    { name: 'StarOutlined', icon: <StarOutlined />, label: '星星' },
    { name: 'HeartOutlined', icon: <HeartOutlined />, label: '心形' },
    { name: 'LikeOutlined', icon: <LikeOutlined />, label: '点赞' },
    { name: 'DislikeOutlined', icon: <DislikeOutlined />, label: '点踩' },
    { name: 'SmileOutlined', icon: <SmileOutlined />, label: '微笑' },
    { name: 'FrownOutlined', icon: <FrownOutlined />, label: '皱眉' },
    { name: 'MehOutlined', icon: <MehOutlined />, label: '中性' },
    { name: 'CrownOutlined', icon: <CrownOutlined />, label: '皇冠' },
    { name: 'TrophyOutlined', icon: <TrophyIcon />, label: '奖杯' },
    { name: 'GiftOutlined', icon: <GiftIcon />, label: '礼物' },
    { name: 'FireOutlined', icon: <FireOutlined />, label: '火焰' },
    { name: 'ThunderboltOutlined', icon: <ThunderboltOutlined />, label: '闪电' },
    { name: 'BulbOutlined', icon: <BulbOutlined />, label: '灯泡' },
    { name: 'ExperimentOutlined', icon: <ExperimentOutlined />, label: '实验' },
    { name: 'CompassOutlined', icon: <CompassOutlined />, label: '指南针' },
    { name: 'FlagOutlined', icon: <FlagOutlined />, label: '旗帜' },
    { name: 'MenuOutlined', icon: <MenuOutlined />, label: '菜单' },
    { name: 'SettingOutlined', icon: <SettingOutlined />, label: '设置' },
    { name: 'FolderOutlined', icon: <FolderOutlined />, label: '文件夹' },
    { name: 'FileOutlined', icon: <FileOutlined />, label: '文件' }
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
  const [modalVisible, setModalVisible] = useState(false);
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

  // 处理树形数据，添加图标
  const processTreeData = (data) => {
    return data.map(item => ({
      ...item,
      key: item.id.toString(),
      title: item.moduleName,
      icon: getIconByType(item.moduleType, item.children && item.children.length > 0, item.icon),
      isVisible: item.isVisible,
      isEnabled: item.isEnabled,
      moduleData: item, // 保存原始模块数据，用于编辑时获取正确的字段值
      children: item.children ? processTreeData(item.children) : undefined
    }));
  };

  // 根据类型和icon字段获取图标
  const getIconByType = (moduleType, hasChildren, iconName) => {
    // 如果有指定的图标，优先使用
    if (iconName) {
      const iconMap = {
        'UserOutlined': <UserOutlined />,
        'TeamOutlined': <TeamOutlined />,
        'AppstoreOutlined': <AppstoreOutlined />,
        'InfoCircleOutlined': <InfoCircleOutlined />,
        'DashboardOutlined': <DashboardOutlined />,
        'TableOutlined': <TableOutlined />,
        'FormOutlined': <FormOutlined />,
        'CalendarOutlined': <CalendarOutlined />,
        'BarChartOutlined': <BarChartOutlined />,
        'PieChartOutlined': <PieChartOutlined />,
        'LineChartOutlined': <LineChartOutlined />,
        'BookOutlined': <BookOutlined />,
        'FileTextOutlined': <FileTextOutlined />,
        'PictureOutlined': <PictureOutlined />,
        'VideoCameraOutlined': <VideoCameraOutlined />,
        'AudioOutlined': <AudioOutlined />,
        'CloudOutlined': <CloudOutlined />,
        'DatabaseOutlined': <DatabaseOutlined />,
        'ApiOutlined': <ApiOutlined />,
        'ToolOutlined': <ToolOutlined />,
        'SafetyOutlined': <SafetyOutlined />,
        'LockOutlined': <LockOutlined />,
        'KeyOutlined': <KeyOutlined />,
        'BellOutlined': <BellOutlined />,
        'MailOutlined': <MailOutlined />,
        'PhoneOutlined': <PhoneOutlined />,
        'GlobalOutlined': <GlobalOutlined />,
        'EnvironmentOutlined': <EnvironmentOutlined />,
        'HomeOutlined': <HomeOutlined />,
        'ShopOutlined': <ShopOutlined />,
        'CarOutlined': <CarOutlined />,
        'RocketOutlined': <RocketOutlined />,
        'StarOutlined': <StarOutlined />,
        'HeartOutlined': <HeartOutlined />,
        'LikeOutlined': <LikeOutlined />,
        'DislikeOutlined': <DislikeOutlined />,
        'SmileOutlined': <SmileOutlined />,
        'FrownOutlined': <FrownOutlined />,
        'MehOutlined': <MehOutlined />,
        'CrownOutlined': <CrownOutlined />,
        'TrophyOutlined': <TrophyIcon />,
        'GiftOutlined': <GiftIcon />,
        'FireOutlined': <FireOutlined />,
        'ThunderboltOutlined': <ThunderboltOutlined />,
        'BulbOutlined': <BulbOutlined />,
        'ExperimentOutlined': <ExperimentOutlined />,
        'CompassOutlined': <CompassOutlined />,
        'FlagOutlined': <FlagOutlined />,
        'MenuOutlined': <MenuOutlined />,
        'SettingOutlined': <SettingOutlined />,
        'FolderOutlined': <FolderOutlined />,
        'FileOutlined': <FileOutlined />
      };
      
      if (iconMap[iconName]) {
        return iconMap[iconName];
      }
    }
    
    // 如果没有指定图标，根据类型返回默认图标
    switch (moduleType) {
      case 1: // 菜单
        return <MenuOutlined />;
      case 2: // 按钮
        return <FileOutlined />;
      case 3: // 页面
        return <FileOutlined />;
      default:
        return hasChildren ? <FolderOutlined /> : <FileOutlined />;
    }
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
    for (let item of data) {
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

  // 显示添加/编辑模态框
  const showModal = (node = null, parentKey = null) => {
    setEditingNode({ node, parentKey });
    if (node) {
      // 使用原始模块数据中的字段值
      const originalData = node.moduleData || node;
      form.setFieldsValue({
        moduleName: node.title,
        moduleCode: originalData.moduleCode || '',
        moduleType: originalData.moduleType || 1,
        parentId: originalData.parentId || 0,
        icon: originalData.icon || '', // 使用原始数据中的icon字段
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
      form.setFieldsValue({
        parentId: parentKey || 0,
        isVisible: true,
        isEnabled: true
      });
    }
    setModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { moduleName, moduleCode, moduleType, parentId, icon, path, component, permission, sortOrder, isVisible, isEnabled, description } = values;
      setLoading(true);
      
      if (editingNode.node) {
        // 编辑模式
        await moduleAPI.updateModule(editingNode.node.key, {
          moduleName,
          moduleCode,
          moduleType,
          parentId: parentId || 0,
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
      setModalVisible(false);
      form.resetFields();
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
    showModal(null, null);
  };

  // 添加子节点
  const addChildNode = (parentKey) => {
    showModal(null, parentKey);
  };

  // 编辑节点
  const editNode = (node) => {
    showModal(node, null);
  };

  // 渲染节点标题
  const renderTitle = (node) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <span>{node.title}</span>
          <Space size="small" style={{ marginLeft: 8 }}>
            {node.isVisible !== undefined && (
              <Badge 
                status={node.isVisible === 1 ? 'success' : 'default'} 
                text={node.isVisible === 1 ? '可见' : '隐藏'} 
                size="small"
              />
            )}
            {node.isEnabled !== undefined && (
              <Badge 
                status={node.isEnabled === 1 ? 'success' : 'error'} 
                text={node.isEnabled === 1 ? '启用' : '禁用'} 
                size="small"
              />
            )}
          </Space>
        </div>
        <Space size="small" style={{ marginLeft: 8 }}>
          <Tooltip title="添加子模块">
            <Button 
              type="text" 
              size="small" 
              icon={<PlusOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                addChildNode(node.key);
              }}
            />
          </Tooltip>
          <Tooltip title="编辑模块">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                editNode(node);
              }}
            />
          </Tooltip>
          <Tooltip title="删除模块">
            <Popconfirm
              title="确定要删除这个模块吗？"
              onConfirm={() => handleDelete(node.key)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="text" 
                size="small" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      </div>
    );
  };

  // 处理树节点选择
  const onSelect = (selectedKeys, info) => {
    setSelectedKeys(selectedKeys);
  };

  // 处理树节点展开
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            <MenuOutlined style={{ marginRight: 8 }} />
            模块管理
          </Title>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadModuleTree}
              loading={treeLoading}
            >
              刷新
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={addRootNode}
            >
              添加根模块
            </Button>
          </Space>
        </div>
        
        <Row gutter={24}>
          <Col span={12}>
            <Card title="模块树" size="small">
              <Spin spinning={treeLoading}>
                <Tree
                  treeData={treeData}
                  selectedKeys={selectedKeys}
                  expandedKeys={expandedKeys}
                  onSelect={onSelect}
                  onExpand={onExpand}
                  titleRender={renderTitle}
                  showIcon
                  showLine
                  style={{ minHeight: 400 }}
                />
              </Spin>
            </Card>
          </Col>
          
          <Col span={12}>
            <Card title="模块信息" size="small">
              {selectedKeys.length > 0 ? (
                <div>
                  {(() => {
                    const selectedNode = findNode(treeData, selectedKeys[0]);
                    return (
                      <>
                        <p><strong>模块名称：</strong>{selectedNode?.title}</p>
                        <p><strong>模块编码：</strong>{selectedNode?.moduleCode || '-'}</p>
                        <p><strong>父级模块：</strong>{selectedNode?.parentId || 0}</p>
                        <p><strong>模块类型：</strong>
                          {selectedNode?.moduleType === 1 ? '菜单' : 
                           selectedNode?.moduleType === 2 ? '按钮' : 
                           selectedNode?.moduleType === 3 ? '页面' : '-'}
                        </p>
                        <p><strong>路由路径：</strong>{selectedNode?.path || '-'}</p>
                        <p><strong>组件路径：</strong>{selectedNode?.component || '-'}</p>
                        <p><strong>权限标识：</strong>{selectedNode?.permission || '-'}</p>
                        <p><strong>排序号：</strong>{selectedNode?.sortOrder || 0}</p>
                        <p><strong>层级：</strong>{selectedNode?.level || 1}</p>
                        <p><strong>是否可见：</strong>
                          <Badge 
                            status={selectedNode?.isVisible === 1 ? 'success' : 'default'} 
                            text={selectedNode?.isVisible === 1 ? '可见' : '隐藏'} 
                          />
                        </p>
                        <p><strong>是否启用：</strong>
                          <Badge 
                            status={selectedNode?.isEnabled === 1 ? 'success' : 'error'} 
                            text={selectedNode?.isEnabled === 1 ? '启用' : '禁用'} 
                          />
                        </p>
                        <p><strong>子模块数量：</strong>
                          {selectedNode?.children?.length || 0}
                        </p>
                        <p><strong>模块描述：</strong></p>
                        <div style={{ 
                          padding: '8px 12px', 
                          backgroundColor: '#f5f5f5', 
                          borderRadius: 4,
                          marginTop: 4
                        }}>
                          {selectedNode?.description || '暂无描述'}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                  请选择一个模块查看详细信息
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Card>

      <Modal
        title={editingNode?.node ? '编辑模块' : '添加模块'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        destroyOnClose
        confirmLoading={loading}
        width={650}
        footer={null}
        bodyStyle={{ maxHeight: '70vh', overflow: 'hidden' }}
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
          <Form form={form} layout="horizontal" onFinish={handleSubmit} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Divider orientation="left" style={{ fontWeight: 'bold' }}>基本信息</Divider>
            <Form.Item name="moduleName" label={<span>模块名称 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请输入模块名称' }]}> 
              <Input placeholder="请输入模块名称" />
            </Form.Item>
            <Form.Item name="moduleCode" label={<span>模块编码 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请输入模块编码' }]}> 
              <Input placeholder="请输入模块编码" />
            </Form.Item>
            <Form.Item name="moduleType" label={<span>模块类型 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请选择模块类型' }]}> 
              <Select placeholder="请选择模块类型">
                <Select.Option value={1}>菜单</Select.Option>
                <Select.Option value={2}>按钮</Select.Option>
                <Select.Option value={3}>页面</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="parentId" label="父级模块"> 
              <Input placeholder="请输入父级模块ID" type="number" />
            </Form.Item>
            
            <Divider orientation="left" style={{ fontWeight: 'bold' }}>配置信息</Divider>
            <Form.Item name="icon" label="图标"> 
              <IconSelector />
            </Form.Item>
            <Form.Item name="path" label="路由路径"> 
              <Input placeholder="请输入路由路径" />
            </Form.Item>
            <Form.Item name="component" label="组件路径"> 
              <Input placeholder="请输入组件路径" />
            </Form.Item>
            <Form.Item name="permission" label="权限标识"> 
              <Input placeholder="请输入权限标识" />
            </Form.Item>
            <Form.Item name="sortOrder" label="排序号"> 
              <Input placeholder="请输入排序号" type="number" />
            </Form.Item>
            <Form.Item name="isVisible" label="是否可见" valuePropName="checked"> 
              <Switch 
                checkedChildren="可见" 
                unCheckedChildren="隐藏"
                defaultChecked={true}
              />
            </Form.Item>
            <Form.Item name="isEnabled" label="是否启用" valuePropName="checked"> 
              <Switch 
                checkedChildren="启用" 
                unCheckedChildren="禁用"
                defaultChecked={true}
              />
            </Form.Item>
            <Form.Item name="description" label="模块描述"> 
              <Input.TextArea placeholder="请输入模块描述" rows={3} />
            </Form.Item>
            
            <Divider style={{margin:'16px 0 8px 0'}}/>
            <div style={{textAlign:'center'}}>
              <Button type="primary" htmlType="submit" loading={loading} style={{minWidth:120,marginRight:16}}>提交</Button>
              <Button onClick={()=>setModalVisible(false)} style={{minWidth:100}}>取消</Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ModuleManagement; 