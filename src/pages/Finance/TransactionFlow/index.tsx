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
import { typeMap, statusMap } from './config'


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
      title: '类型',
      dataIndex: 'type',
      valueEnum: typeMap,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: statusMap,
    },
    {
      title: '交易前余额',
      dataIndex: 'beforePrice',
      hideInSearch: true,
    },
    {
      title: '交易金额',
      dataIndex: 'price',
      hideInSearch: true,
    },
    {
      title: '交易后余额',
      dataIndex: 'afterPrice',
      hideInSearch: true,
      render: (_, record) => {
        if (record.status === 1) {
          return (+record.beforePrice + +record.price).toFixed(2)
        } else {
          return (+record.beforePrice - +record.price).toFixed(2)
        }
      }
    },
    {
      title: '交易说明',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ];


  return (
    <PageContainer>
      <ProTable<API.UserItem, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        request={getList}
        columns={columns}
      />
    </PageContainer >
  );
};

export default TableList;
