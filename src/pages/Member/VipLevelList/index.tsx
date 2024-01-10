import { setTextConfig, removeRule, rule, updateRule, deleteTextConfig } from '@/services/ant-design-pro/api';
import { getList, addData, removeData, updateData, } from './api';
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
import { Button, Drawer, Input, message, Popconfirm, Form, Upload, InputNumber, Modal, Row, Col } from 'antd';
import React, { useRef, useState, nextTick } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import './index.scss'
import dayjs from 'dayjs'

export const beforeUpload = (file: RcFile) => {
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





const TableList: React.FC = () => {

  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  // 当前操作的列
  const [currentRow, setCurrentRow] = useState<API.UserItem>();

  const [imageUrl, setImageUrl] = useState<string>(); // 上传图片的地址
  const [loading, setLoading] = useState(false); // 上传图片的loading
  const actionRef = useRef<ActionType>(); // 表格的action
  const addForm = useRef<FormInstance>(); // 添加会员的表单

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


  const intl = useIntl(); // 国际化配置


  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '会员名称',
      dataIndex: 'name',
      hideInForm: true,
    },
    {
      title: '图片',
      dataIndex: 'img',
      render: (text, record) => {
        return <img src={record.img} alt="" style={{ width: '100px' }} />
      }
    },
    {
      title: '价格范围',
      dataIndex: 'price_range',
      render: (text, record) => {
        return <div>{record.price_min}% ~ {record.price_max}%</div>
      }
    },
    {
      title: '每日订单量',
      dataIndex: 'order_count',
    },
    {
      title: '限制接单金额',
      dataIndex: 'order_amount_min',
    },
    {
      title: '升级奖励',
      dataIndex: 'upgrade_reward',
    },
    {
      title: '任务总量',
      dataIndex: 'task_total',
    },
    {
      title: '返还佣金比例',
      dataIndex: 'return_rate',
    },
    {
      title: '连单佣金比例',
      dataIndex: 'continue_rate',
    },
    {
      title: '提现限制',
      render: (text, record) => [
        <div className='form-basicinfo' key="withdraw">
          <div className='form-item flex'>
            <div className='form-item-value'>{record.withdraw_min} ~ {record.withdraw_max}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>每日提现次数：</div>
            <div className='form-item-value'>{record.withdraw_count}次</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>每天至少完成：</div>
            <div className='form-item-value'>{record.withdraw_order_count}单</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>手续费：</div>
            <div className='form-item-value'>{record.withdraw_fee}%</div>
          </div>
        </div>
      ]
    },


    // 操作列
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <div className='btn-block' key="btn-line1">
          <Button
            size="small"
            type="primary"
            onClick={async () => {
              await handleModalOpen(true);
              setCurrentRow(record); // 设置当前操作的列
              setImageUrl(record.img) // 设置图片
              addForm.current?.setFieldsValue(record); // 设置表单的值
            }}
          >编辑</Button>


          <Popconfirm
            key="deletePopconfirm"
            title="系统提示"
            description="确定删除该条数据吗?"
            onConfirm={async () => {
              await removeData(record.id)
              actionRef.current?.reload()
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button
              size="small"
              type="primary"
              danger
            >删除</Button>
          </Popconfirm>
        </div>
      ],
    }
  ];

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
  return (
    <PageContainer>
      <ProTable<API.UserItem, API.PageParams>
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
            <PlusOutlined />添加会员等级
          </Button>,
        ]}
        request={getList}
        search={false}
        columns={columns}
      />
      <ModalForm
        title={currentRow ? '编辑会员等级' : '添加会员等级'}
        formRef={addForm}
        width="800px"
        open={createModalOpen}
        onOpenChange={(open) => {
          // 表单关闭时重置表单
          if (!open) {
            addForm.current?.resetFields();
            setImageUrl('')
            setLoading(false)
            setCurrentRow(undefined); // 重置当前操作的列
          }
          handleModalOpen(open);
        }}
        onFinish={async (value) => {
          const params = {
            ...value,
          }
          let res: API.Result;
          if (currentRow) {
            //编辑
            params.id = currentRow.id
            res = await updateData(params as API.UpdateData);
          } else {
            // 新增
            res = await addData(params as API.AddData);
          }
          console.log('🚀  file: index.tsx:237  onFinish={  res:', res)
          if (res.success) {
            handleModalOpen(false);
            // 刷新表格
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          name="name"
          label="会员名称"
          rules={[{ required: true, message: '请输入会员名称' }]}
        />

        <Row gutter={[16, 16]}>

          <Col span={12}>
            {/* 会员图片 */}
            <Form.Item label="会员图片" name="img">
              <Upload
                name="file"
                listType="picture-card"
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
                    addForm.current?.setFieldsValue({ img: res.data.data.url });
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
          </Col>

          <Col span={12}>
            {/* 描述 */}
            <ProFormText
              name="description"
              label="描述"
            />
          </Col>
          <Col span={12}>
            {/* 限制接单金额 */}
            <Form.Item label="限制接单金额" name="order_amount_min" >
              <InputNumber defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 升级奖励 */}
            <Form.Item label="升级奖励" name="upgrade_reward">
              <InputNumber defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* 任务总数 */}
            <Form.Item label="任务总数" name="task_total">
              <InputNumber defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 订单总数 */}
            <Form.Item label="订单总数" name="order_count">
              <InputNumber defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 价格范围-最低 */}
            <Form.Item label="价格范围-最低" name="price_min">
              <InputNumber defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* 价格范围-最高 */}
            <Form.Item label="价格范围-最高" name="price_max">
              <InputNumber defaultValue={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 返现比例 */}
            <Form.Item label="返现比例" name="return_rate">
              <InputNumber defaultValue={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 连单佣金比例 */}
            <Form.Item label="连单佣金比例" name="continue_rate">
              <InputNumber defaultValue={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 最小提现金额 */}
            <Form.Item label="最小提现金额" name="withdraw_min">
              <InputNumber defaultValue={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 最大提现金额 */}
            <Form.Item label="最大提现金额" name="withdraw_max">
              <InputNumber defaultValue={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 单日提现次数 */}
            <Form.Item label="单日提现次数" name="withdraw_count">
              <InputNumber defaultValue={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 提现订单数 */}
            <Form.Item label="提现订单数" name="withdraw_order_count">
              <InputNumber defaultValue={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* 提现手续费 */}
            <Form.Item label="提现手续费" name="withdraw_fee">
              <InputNumber defaultValue={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>



      </ModalForm>

    </PageContainer >
  );
};

export default TableList;
