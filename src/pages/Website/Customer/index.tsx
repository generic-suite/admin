import { getList, addData, update, remove } from './api';
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
import './index.scss'


const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false); // modal窗口的弹窗
  const [currentRow, setCurrentRow] = useState<API.UserItem>(); // 当前操作的列
  const actionRef = useRef<ActionType>(); // 表格的action
  const modalFormRef = useRef<FormInstance>(); // 审核的表单
  const intl = useIntl(); // 国际化配置
  // 表格的列配置
  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '客服名',
      dataIndex: 'name',
      hideInForm: true,
    },
    {
      title: '客服地址',
      dataIndex: 'value',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    // 操作列
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <Button key="config" type="link" size="small"
          onClick={async () => {
            await handleModalOpen(true);
            await setCurrentRow(record);
            modalFormRef.current?.setFieldsValue(record);
          }}
        >编辑</Button>,
        // 删除
        <Popconfirm
          key="delete"
          title="确定删除吗？"
          onConfirm={async () => {
            await remove(record.id);
            message.success('删除成功');
            actionRef.current?.reload();
          }}
        >
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ]
    }
  ];
  return (
    <PageContainer>
      <ProTable<API.UserItem, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        request={getList}
        columns={columns}
        pagination={false}
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined />添加客服信息
          </Button>,
        ]}
      />

      <ModalForm
        title={currentRow ? '编辑客服信息' : '添加客服信息'}
        formRef={modalFormRef}
        width="400px"
        visible={createModalOpen}
        onVisibleChange={handleModalOpen}
        onFinish={async (value) => {
          let res;
          if (currentRow) {
            // 编辑
            res = await update(value);
          } else {
            // 新增
            res = await addData(value);
          }
          if (res.success) {
            await setCurrentRow(undefined)
            await modalFormRef.current?.resetFields();
            handleModalOpen(false);
            actionRef.current?.reload();
          }
        }}
        onOpenChange={async (open) => {
          if (!open) {
            await setCurrentRow(undefined)
            await modalFormRef.current?.resetFields();
          }
          handleModalOpen(open)
        }}
      >
        <ProFormText
          name="id"
          label="ID"
          hidden
        />
        <ProFormText
          width="md"
          name="name"
          label="客服名"
          placeholder="请输入客服名"
          rules={[{ required: true, message: '请输入客服名' }]}
        />
        <ProFormText
          width="md"
          name="value"
          label="客服地址"
          placeholder="请输入客服地址"
          rules={[{ required: true, message: '请输入客服地址' }]}
        />
      </ModalForm>
    </PageContainer >
  );
};

export default TableList;
