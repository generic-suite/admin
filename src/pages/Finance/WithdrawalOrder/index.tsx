import { updateRule, deleteTextConfig } from '@/services/ant-design-pro/api';
import { getList, update } from './api';
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
import { statusMap } from './config'


const TableList: React.FC = () => {

  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  // 当前操作的列
  const [currentRow, setCurrentRow] = useState<API.UserItem>();

  const actionRef = useRef<ActionType>(); // 表格的action
  const auditForm = useRef<FormInstance>(); // 审核的表单

  const intl = useIntl(); // 国际化配置


  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      hideInForm: true,
    },
    {
      title: '银行信息',
      dataIndex: 'bank_name',
      hideInSearch: true,
      render: (_, record) => [
        <div className='form-walletinfo' key="walletinfo">
          <div className='form-item flex'>
            <div className='form-item-label'>银行名称</div>
            <div className='form-item-value'>{record.bank_name || '-'}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>银行卡号</div>
            <div className='form-item-value'>{record.bank_card || '-'}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>银行账户名</div>
            <div className='form-item-value'>{record.bank_account || '-'}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>分行名称</div>
            <div className='form-item-value'>{record.branch_name || '-'}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>分行代码</div>
            <div className='form-item-value'>{record.branch_number || '-'}</div>
          </div>
        </div>
      ]
    },
    {
      title: '提现金额',
      dataIndex: 'amount',
      hideInSearch: true,
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: statusMap,
    },
    {
      title: '审核信息',
      dataIndex: 'audit_info',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    // 操作列
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return record.status === 0 ? <div className='btn-block' key="btn-line1">
          <Button
            size="small"
            type="primary"
            onClick={async () => {
              await handleModalOpen(true);
              const params = {
                ...record,
                status: 1,
              }
              await auditForm.current?.setFieldsValue(params);
            }}
          >审核</Button>
        </div> : null
      }
    }
  ];

  
  return (
    <PageContainer>
      <ProTable<API.UserItem, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        request={getList}
        columns={columns}
      />

      {/* 审核弹窗 */}
      <ModalForm
        width={800}
        title="审核"
        formRef={auditForm}
        open={createModalOpen}
        onOpenChange={(open) => {
          // 表单关闭时重置表单
          if (!open) {
            auditForm.current?.resetFields();
          }
          handleModalOpen(open);
        }}
        onFinish={async (values) => {
          const res = await update(values);
          if (res.success) {
            message.success('审核成功');
            handleModalOpen(false);
            actionRef.current?.reload();
          }
        }}
      >
        <ProFormText
          name="id"
          label="ID"
          hidden
        />
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <ProFormSelect
            options={[
              { label: '审核通过', value: 1 },
              { label: '审核不通过', value: 2 },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="audit_info"
          label="审核信息"
        >
          <ProFormTextArea placeholder="请输入审核信息" />
        </Form.Item>
      </ModalForm>
    </PageContainer >
  );
};

export default TableList;
