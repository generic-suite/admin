import { setTextConfig, removeRule, rule, updateRule, deleteTextConfig } from '@/services/ant-design-pro/api';
import { getProductList, addProduct, removeProduct, updateProduct } from './api';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'; // 添加图标
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Input, message, Popconfirm, Form, Upload, InputNumber } from 'antd';
import React, { useRef, useState, nextTick } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';


const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

/**
 * 新建文本配置
 * @param fields
 */
const handleAddText = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    const res = await setTextConfig({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请重试！');
    return false;
  }
}

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};


const delData = async (e) => {
  const hide = message.loading('正在删除');
  try {
    await removeProduct(e.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试！');
    return false;
  }
}


const TableList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  // 区分弹窗为新增还是编辑
  const [isUpdate, setIsUpdate] = useState<boolean>(false);


  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );



  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const addForm = useRef<FormInstance>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();


  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: <FormattedMessage id="pages.product.productlist.name" />,
      dataIndex: 'good_name',
      hideInForm: true,

    },
    {
      title: <FormattedMessage id="pages.product.productlist.img" />,
      dataIndex: 'good_img',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => [
        <img src={record.good_img} style={{ width: '100px' }} key='img' />
      ]
    },
    {
      title: <FormattedMessage id="pages.product.productlist.price" />,
      dataIndex: 'price',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="component.createTime" />,
      dataIndex: 'create_time',
      hideInSearch: true,
    },
    // 操作列
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={async () => {
            await handleModalOpen(true);
            addForm.current?.setFieldsValue(record);
            setImageUrl(record.good_img)
            setIsUpdate(true) // 重置为编辑
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" />
        </a>,
        <Popconfirm
          key="deletePopconfirm"
          title="系统提示"
          description="确定删除该条文本配置信息吗?"
          onConfirm={async () => {
            await delData(record)
            actionRef.current?.reload()
          }}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger >
            <FormattedMessage
              id="pages.searchTable.delete"
            />
          </Button>
        </Popconfirm>

      ],
    }
  ];

  return (
    <PageContainer>
      <ProTable<API.ProductListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getProductList}
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.product.productlist.manage',
        })}
        formRef={addForm}
        width="800px"
        open={createModalOpen}
        onOpenChange={(open) => {
          // 表单关闭时重置表单
          if (!open) {
            addForm.current?.resetFields();
            setImageUrl('')
            setLoading(false)
            setIsUpdate(false) // 重置为新增
          }
          handleModalOpen(open);
        }}
        onFinish={async (value) => {
          let res;
          if (isUpdate) {
            // 编辑
            const params = {
              ...value,
              id: addForm.current?.getFieldValue('id')
            }
            res = await updateProduct(params as API.ProductListItem);
          }
          else {
            res = await addProduct(value as API.ProductListItem);
          }
          if (res.success) {
            handleModalOpen(false);
            // 刷新表格
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        {/* 产品名称 */}
        <ProFormText
          width="md"
          name="good_name"
          label="产品名称"
          placeholder="请输入产品名称"
          rules={[{ required: true, message: '请输入产品名称' }]}
        />
        {/* 产品图片 */}
        <Form.Item label="产品图片" name="good_img">
          <Upload
            name="file"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            maxCount={1}
            customRequest={async (e) => {
              console.log(e)
              const hide = message.loading('正在上传');
              try {
                const formData = new FormData();
                formData.append('file', e.file);
                const fetchUpload = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData
                })
                const res = await fetchUpload.json()
                console.log(res)
                if (res.data.code === 200) {
                  setImageUrl(res.data.data.url)
                }
                addForm.current?.setFieldsValue({ good_img: res.data.data.url });
                hide();
                message.success('上传成功');
                return true;
              } catch (error) {
                hide();
                message.error('上传失败，请重试！');
                return false;
              }
            }}
          >
            {imageUrl ? <img src={imageUrl} style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        {/* 产品价格 */}
        <Form.Item label="产品价格" name="price">
          <InputNumber min={0} />
        </Form.Item>


      </ModalForm>
    </PageContainer >
  );
};

export default TableList;
