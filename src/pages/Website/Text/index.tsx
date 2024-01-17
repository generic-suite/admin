import { setTextConfig, removeRule, getTextList, updateRule, deleteTextConfig } from '@/services/ant-design-pro/api';
import { FileExcelFilled, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { useForm, Controller } from 'react-hook-form';
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
import { Button, Drawer, Input, message, Popconfirm, Form, } from 'antd';
import React, { useRef, useState, nextTick } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import ReactQuill from '@/components/ReactQuill'


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


const textTypeMap = [
  { text: 'pages.website.basic.text.texttype.alert', value: '1' },
  { text: 'pages.website.basic.text.texttype.notification', value: '2' },
  { text: 'pages.website.basic.text.texttype.qualification', value: '3' },
  { text: 'pages.website.basic.text.texttype.aboutus', value: '4' },
  { text: 'pages.website.basic.text.texttype.question', value: '5' },
  { text: 'pages.website.basic.text.texttype.agent', value: '6' },
  { text: 'pages.website.basic.text.texttype.usdt', value: '7' },
  { text: 'pages.website.basic.text.texttype.terms', value: '8' },
  { text: 'pages.website.basic.text.texttype.privacy', value: '9' },
  { text: 'pages.website.basic.text.texttype.certificate', value: '10' },
  { text: 'pages.website.basic.text.texttype.activity', value: '11' },
]


const delData = async (e) => {
  const hide = message.loading('正在删除');
  try {
    await deleteTextConfig(e.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试！');
    return false;
  }
}

const langMap = [
  { text: 'pages.website.basic.text.languagetype.zh', value: 'zh-CN' },
  { text: 'pages.website.basic.text.languagetype.en', value: 'en' },
]

const TableList: React.FC = () => {

  const { control, handleSubmit, setValue, watch } = useForm();
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
      title: <FormattedMessage id="pages.website.basic.text.texttype" defaultMessage="文本类型" />,
      dataIndex: 'config_type',
      hideInForm: true,
      valueEnum: textTypeMap.reduce((pre, item) => {
        pre[item.value] = { text: intl.formatMessage({ id: item.text }) }
        return pre
      }, {}),
    },
    {
      title: <FormattedMessage id="pages.website.basic.text.languagetype" defaultMessage="语言类型" />,
      dataIndex: 'lang',
      hideInForm: true,
      valueEnum: langMap.reduce((pre, item) => {
        pre[item.value] = { text: intl.formatMessage({ id: item.text }) }
        return pre
      }, {}),
    },

    {
      title: <FormattedMessage id="pages.searchTable.title" defaultMessage="内容" />,
      hideInSearch: true,
      dataIndex: 'content',
    },
    // 操作列
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={async () => {
            await handleModalOpen(true);
            addForm.current?.setFieldsValue(record);
            setValue('content', record.content)
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" />
        </a>,
        <Popconfirm
          key="popConfirm"
          title="系统提示"
          description="确定删除该条文本配置信息吗?"
          onConfirm={async () => {
            await delData(record)
            actionRef.current?.reload()
          }}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger>
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
      <ProTable<API.RuleListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
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
        request={getTextList}
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.website.basic.text.new',
        })}
        formRef={addForm}
        width="800px"
        open={createModalOpen}
        onOpenChange={(open) => {
          // 表单关闭时重置表单
          if (!open) {
            addForm.current?.resetFields();
            setValue('content', '')
          }
          handleModalOpen(open);
        }}
        onFinish={async (value) => {
          const richTextContent = watch('content');
          const defaultValue = {
            ...value,
            content: richTextContent
          }
          const success = await handleAddText(defaultValue);
          if (success) {
            handleModalOpen(false);
            // 刷新表格
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormSelect
          width='md'
          name="config_type"
          label="文本类型"
          options={textTypeMap.map(item => {
            return {
              value: item.value,
              label: intl.formatMessage({ id: item.text })
            }
          })}
        ></ProFormSelect>
        <ProFormSelect
          width='md'
          name="lang"
          label="语言"
          options={langMap.map(item => {
            return {
              value: item.value,
              label: intl.formatMessage({ id: item.text })
            }
          })}
        ></ProFormSelect>
        <Form.Item label="内容" name="content">
          <Controller
            name="content"
            label="内容"
            control={control}
            render={({ field }) => <ReactQuill defaultValue={field.value} onChange={content => field.onChange(content)} />}
          ></Controller>
        </Form.Item>

      </ModalForm>
    </PageContainer >
  );
};

export default TableList;
