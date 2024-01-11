import { updateRule, deleteTextConfig } from '@/services/ant-design-pro/api';
import { getList } from './api';
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
      title: '订单号',
      dataIndex: 'order_no',
      hideInForm: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      hideInForm: true,
    },
    {
      title: '商品名称',
      dataIndex: 'goods_name',
    },
    {
      title: '订单金额',
      dataIndex: 'order_amount',
      hideInSearch: true,
    },
    {
      title: '订单佣金',
      dataIndex: 'order_commission',
      hideInSearch: true,
    },
    {
      title: '订单状态',
      dataIndex: 'order_status',
      valueEnum: statusMap,
    },
    {
      title: '下单时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '订单完成时间',
      dataIndex: 'order_time',
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
