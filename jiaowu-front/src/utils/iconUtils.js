import { 
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
  MenuOutlined,
  SettingOutlined,
  FolderOutlined,
  FileOutlined
} from '@ant-design/icons';

// 图标映射表
export const iconMap = {
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
  'TrophyOutlined': <TrophyOutlined />,
  'GiftOutlined': <GiftOutlined />,
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

/**
 * 根据图标名称获取图标组件
 * @param {string} iconName - 图标名称
 * @param {number} moduleType - 模块类型
 * @param {boolean} hasChildren - 是否有子节点
 * @returns {React.ReactElement} 图标组件
 */
export const getIconByType = (iconName, moduleType, hasChildren = false) => {
  // 如果有指定的图标，优先使用
  if (iconName && iconMap[iconName]) {
    return iconMap[iconName];
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

/**
 * 获取图标映射表
 * @returns {Object} 图标映射表
 */
export const getIconMap = () => {
  return iconMap;
}; 