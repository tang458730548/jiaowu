import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Spin, Button, message, Result } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { reportAPI } from '../../api/report/report';

const ReportPreviewPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState('');
  const [error, setError] = useState(false);

  // 处理HTML内容，修复图片路径
  const processImagePaths = (html) => {
    if (!html) return html;
    
    let processedHtml = html;
    
    // 处理img标签的src属性
    processedHtml = processedHtml.replace(
      /<img([^>]*)src=["']([^"']*)["']/gi,
      (match, attributes, src) => {
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
          const baseUrl = 'http://localhost:9901';
          const absoluteSrc = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
          console.log('转换图片路径:', src, '->', absoluteSrc);
          return `<img${attributes}src="${absoluteSrc}"`;
        }
        return match;
      }
    );
    
    // 处理CSS中的背景图片
    processedHtml = processedHtml.replace(
      /url\(['"]?([^'")\s]+)['"]?\)/gi,
      (match, url) => {
        if (url && !url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('#')) {
          const baseUrl = 'http://localhost:9901';
          const absoluteUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
          console.log('转换CSS图片路径:', url, '->', absoluteUrl);
          return `url("${absoluteUrl}")`;
        }
        return match;
      }
    );
    
    return processedHtml;
  };


  // 获取报告预览内容
  const fetchPreview = async () => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await reportAPI.previewReport(id);
      const rawHtml = response.data || response;
      
      // 处理HTML内容，修复图片路径
      const processedHtml = processImagePaths(rawHtml);
      setHtmlContent(processedHtml);
      setError(false);
      
      // 调试信息
      console.log('原始HTML内容:', rawHtml);
      console.log('处理后的HTML内容:', processedHtml);
    } catch (error) {
      console.error('获取报告预览失败:', error);
      setError(true);
      setHtmlContent('<div style="text-align: center; padding: 50px; color: #999;">获取报告预览失败</div>');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreview();
  }, [id]);

  // 返回列表
  const handleBack = () => {
    history.goBack();
  };

  // 打印报告
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>报告预览 - ID: ${id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // 下载报告
  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    message.success('报告下载成功');
  };

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <Result
            status="error"
            title="获取报告预览失败"
            subTitle="请检查报告ID是否正确，或稍后重试"
            extra={[
              <Button key="back" icon={<ArrowLeftOutlined />} onClick={handleBack}>
                返回
              </Button>
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title={`报告预览 - ID: ${id}`}
        extra={[
          <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint} style={{ marginRight: 8 }}>
            打印
          </Button>,
          <Button key="download" icon={<DownloadOutlined />} onClick={handleDownload} style={{ marginRight: 8 }}>
            下载
          </Button>,
          <Button key="back" icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回
          </Button>
        ]}
      >
        <div style={{ position: 'relative', minHeight: '60vh' }}>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '60vh' 
            }}>
              <Spin size="large" tip="加载报告预览中..." />
            </div>
          ) : (
            <div 
              style={{ 
                border: '1px solid #f0f0f0',
                borderRadius: '6px',
                padding: '20px',
                backgroundColor: '#fff'
              }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReportPreviewPage; 