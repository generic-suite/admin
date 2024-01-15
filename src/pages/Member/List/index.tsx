import { setTextConfig, removeRule, rule, updateRule, deleteTextConfig } from '@/services/ant-design-pro/api';
import { getList, addData, removeData, updateData, addMoney, getBankInfo, setBankInfo, getVipLevel, setVipLevel, setBaseInfo, changePassword } from './api';
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
import { Button, Drawer, Input, message, Popconfirm, Form, Upload, InputNumber, Modal } from 'antd';
import React, { useRef, useState, nextTick } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import VipLevelModal from './components/VipLevel';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import './index.scss'
import dayjs from 'dayjs'
import { red, volcano, gold, yellow, lime, green, cyan, blue, geekblue, purple, magenta, grey } from '@ant-design/colors';
import { userStatusMap, userRowBtnTextMap, isAllowTrade } from './config'
const TableList: React.FC = () => {

  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  // 当前操作的列
  const [currentRow, setCurrentRow] = useState<API.UserItem>();
  // 加扣款的弹窗
  const [AddSubtractModalOpen, handleAddSubtractModalOpen] = useState<boolean>(false);
  // 编辑银行信息的弹窗
  const [editBankModalOpen, handleEditBankModalOpen] = useState<boolean>(false);
  // 编辑用户会员等级的弹窗
  const [editVipLevelModalOpen, handleEditVipLevelModalOpen] = useState<boolean>(false);
  // 账号禁用的弹窗
  const [accountDisableModalOpen, handleAccountDisableModalOpen] = useState<boolean>(false);
  // 快捷操作的数据
  const [shortcutData, setShortcutData] = useState<any[]>([])
  // 加扣款的金额
  const [addSubtractNum, setAddSubtractNum] = useState<number>(0);

  // 修改登录密码/提现密码的弹窗
  const [editPasswordModalOpen, handleEditPasswordModalOpen] = useState<boolean>(false);
  const editPasswordForm = useRef<FormInstance>(); // 编辑登录密码/提现密码的表单
  const [editPasswordType, setEditPasswordType] = useState<Number>(1) // 编辑密码的类型 1:登录密码 2:提现密码
  const showModal = () => {
    handleAddSubtractModalOpen(true);
  };
  const handleCancel = () => {
    // 重置金额
    setAddSubtractNum(0)
    handleAddSubtractModalOpen(false);
  };
  const changeBalanceSubmit = async (params) => {
    const { success } = await addMoney(params);
    if (success) {
      handleAddSubtractModalOpen(false)
      // 刷新表格
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }
  const actionRef = useRef<ActionType>(); // 表格的action
  const addForm = useRef<FormInstance>(); // 添加会员的表单
  const editCardForm = useRef<FormInstance>(); // 编辑银行信息的表单
  const userVipLevelForm = useRef<FormInstance>(); // 编辑用户会员等级的表单
  // 快捷操作的数据

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const disabledUser = (record) => {
    return [
      {
        key: '1',
        buttonText: userRowBtnTextMap[record.status], // 按钮文字
        buttonStyle: { background: cyan.primary }, // 按钮样式
        buttonClick: () => { // 按钮点击事件
          setShortcutData({
            modalText: `是否要设置用户状态：${userRowBtnTextMap[record.status]}`,
            userId: record.userId,
            value: record.status === 1 ? 2 : 1,
            actionField: 'status',
            apiUrl: setBaseInfo,
          })
          setCurrentRow(record)
          handleAccountDisableModalOpen(true)
        },
      },
      {
        key: '2',
        buttonText: isAllowTrade[record.is_allow_trade === 1 ? 2 : 1], // 按钮文字
        buttonStyle: { background: geekblue.primary }, // 按钮样式
        buttonClick: () => { // 按钮点击事件
          setShortcutData({
            modalText: `是否要修改交易状态为：${isAllowTrade[record.status === 1 ? 2 : 1]}`,
            userId: record.userId,
            value: record.is_allow_trade === 1 ? 2 : 1,
            actionField: 'is_allow_trade',
            apiUrl: setBaseInfo,
          })
          setCurrentRow(record)
          handleAccountDisableModalOpen(true)
        },
      }
    ]
  }


  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: <FormattedMessage id="pages.member.memberlist.name" />,
      dataIndex: 'username',
      hideInForm: true,
    },
    {
      title: <FormattedMessage id="pages.member.memberlist.basicinfo" />,
      dataIndex: 'img',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => [
        <div className='form-basicinfo' key="basicinfo">
          <div className='form-item flex'>
            <div className='form-item-label'>账号：</div>
            <div className='form-item-value'>{record.username}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>手机号：</div>
            <div className='form-item-value'>{record.mobile}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>等级：</div>
            <div className='form-item-value'>{record.level_id}</div>
          </div>
        </div>
      ]
    },
    {
      title: <FormattedMessage id="pages.member.memberlist.accountinfo" />,
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => [
        <div className='form-accountinfo' key="accountinfo">
          <div className='form-item flex'>
            <div className='form-item-label'>状态：</div>
            <div className='form-item-value'>{record.status}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>交易：</div>
            <div className='form-item-value'>{record.is_allow_trade}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>信用：</div>
            <div className='form-item-value'>{record.credit}</div>
          </div>
        </div>
      ]
    },
    // 钱包信息
    {
      title: <FormattedMessage id="pages.member.memberlist.walletinfo" />,
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => [
        <div className='form-walletinfo' key="walletinfo">
          <div className='form-item flex'>
            <div className='form-item-label'>余额：</div>
            <div className='form-item-value'>{record.balance}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>冻结：</div>
            <div className='form-item-value'>{record.freeze_money}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>累计充值：</div>
            <div className='form-item-value'>{record.recharge_money}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>累计提现：</div>
            <div className='form-item-value'>{record.withdraw_money}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>累计佣金：</div>
            <div className='form-item-value'>{record.commission_total}</div>
          </div>
          <div className='form-item flex'>
            <div className='form-item-label'>今日佣金：</div>
            <div className='form-item-value'>{record.commission_today}</div>
          </div>
        </div>
      ]
    },
    // 任务情况
    {
      title: '任务情况',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => [
        <div className='form-taskinfo' key="taskinfo">
          {record.today_trade_order_count} - {record.order_count}
        </div>
      ]
    },
    // 邀请码
    {
      title: <FormattedMessage id="pages.member.memberlist.invitecode" />,
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => [
        <div className='form-invitecode' key="invitecode" onClick={
          () => {
            const input = document.createElement('input');
            input.setAttribute('readonly', 'readonly');
            input.setAttribute('value', record.invite_code);
            document.body.appendChild(input);
            input.select();
            if (document.execCommand('copy')) {
              document.execCommand('copy');
              message.success('复制成功');
            }
          }
        }>
          {record.invite_code}
        </div>
      ]
    },
    {
      title: <FormattedMessage id="pages.member.memberlist.createTime" />,
      dataIndex: 'create_time',
      hideInSearch: true,
      render: (_, record) => [
        <div className='form-createtime' key="createtime">
          {dayjs(record.create_time).format('YYYY-MM-DD HH:mm:ss')}
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
          <div className='btn-flex' >
            <Button
              size="small"
              type="primary"
              onClick={async () => {
                await handleModalOpen(true);
                addForm.current?.setFieldsValue(record);
              }}
            >基本资料</Button>
            <Button size="small" type="primary" onClick={() => {
              showModal()
              setCurrentRow(record)
            }}>加扣款</Button>
            <Button size="small" type="primary" onClick={async () => {
              // 获取银行信息
              const res = await getBankInfo(record.userId)
              await handleEditBankModalOpen(true)
              editCardForm.current?.setFieldsValue(res.data)
              setCurrentRow(record)
            }}>银行信息</Button>

            <Button size="small" type="primary" onClick={async () => {
              await setCurrentRow(record)
              await handleEditVipLevelModalOpen(true)
            }}>vip等级</Button>
          </div>
          <div className='btn-flex' key="btn-line2">
            {/* 循环disabledUser数组 */}
            {disabledUser(record).map((item, index) => {
              return <Button
                key={index}
                size="small"
                type="primary"
                style={item.buttonStyle}
                onClick={item.buttonClick}
              >
                {item.buttonText}
              </Button>
            })}

          </div>
          <div className='btn-flex' key="btn-line3">
            <Button
              size="small"
              type="primary"
              style={{ background: volcano.primary }}
              onClick={async () => {
                await setCurrentRow(record)
                await handleEditPasswordModalOpen(true)
                await setEditPasswordType(1)
                await editPasswordForm.current?.setFieldsValue({
                  userId: record.userId
                })
              }}
            >登录密码</Button>
            <Button
              size="small"
              type="primary"
              style={{ background: red.primary }}
              onClick={async () => {
                await setCurrentRow(record)
                await handleEditPasswordModalOpen(true)
                await setEditPasswordType(2)
                await editPasswordForm.current?.setFieldsValue({
                  userId: record.userId
                })
              }}
            >提现密码</Button>
          </div>
        </div>

      ],
    }
  ];

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
            <PlusOutlined />添加会员
          </Button>,
        ]}
        request={getList}
        columns={columns}
      />
      <ModalForm
        title='添加会员'
        formRef={addForm}
        width="800px"
        open={createModalOpen}
        onOpenChange={(open) => {
          // 表单关闭时重置表单
          if (!open) {
            addForm.current?.resetFields();
          }
          handleModalOpen(open);
        }}
        onFinish={async (value) => {
          const params = {
            ...value,
            repassword: value.password,
          }
          const res: API.Result = await addData(params as API.Register);
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
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProFormText
          name="realname"
          label="昵称"
          placeholder="请输入"
          rules={[{ required: true, message: '请输入昵称' }]}
        />

        <Form.Item label="登录密码" name="password" rules={[{ required: true, message: '请输入登录密码' }]}>
          <Input.Password placeholder="请输入" />
        </Form.Item>
        <ProFormText
          name="mobile"
          label="手机号"
          placeholder="请输入"
        />
        <Form.Item label="提现密码" name="deal_pass" rules={[{ required: true, message: '请输入提现密码' }]}>
          <Input.Password placeholder="请输入" />
        </Form.Item>
        <ProFormText
          name="invite_code"
          label="验证码"
          placeholder="请输入"
        />

      </ModalForm>
      {/* 加扣款弹窗 */}
      <Modal
        width={400}
        open={AddSubtractModalOpen}
        title="加扣款"
        onOk={() => {
          handleAddSubtractModalOpen(false);
        }}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" key="add" onClick={() => {
            changeBalanceSubmit({
              userId: currentRow?.userId,
              amount: addSubtractNum,
              isRecharge: true
            })
          }}>
            加款
          </Button>,
          <Button key="subtract" onClick={() => {
            changeBalanceSubmit({
              userId: currentRow?.userId,
              amount: addSubtractNum,
              isRecharge: false
            })
          }}>
            扣款
          </Button>,
          <Button
            key="cancel"
            onClick={() => {
              handleAddSubtractModalOpen(false)
            }}
          >
            取消
          </Button>,
        ]}
      >
        <InputNumber className='flex' min={0} value={addSubtractNum} onChange={value => setAddSubtractNum(value as number)} />
      </Modal>
      {/* 编辑银行信息的弹窗 */}
      <ModalForm
        title="编辑银行信息"
        width={800}
        formRef={editCardForm}
        open={editBankModalOpen}
        onOpenChange={(open) => {
          // 表单关闭时重置表单
          if (!open) {
            editCardForm.current?.resetFields();
          }
          handleEditBankModalOpen(open);
        }}
        onFinish={async (value) => {
          const res = await setBankInfo(currentRow.userId, value)
          if (res.success) {
            handleEditBankModalOpen(false)
            // 刷新表格
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          name="bank_name"
          label="银行名称"
        />
        <ProFormText
          name="bank_card"
          label="银行卡号"
        />
        <ProFormText
          name="bank_account"
          label="银行账户名"
        />
        <ProFormText
          name="branch_name"
          label="分行名称"
        />
        <ProFormText
          name="branch_number"
          label="分行代码"
        />
      </ModalForm>

      {/* 编辑用户vip等级的弹窗 */}
      <VipLevelModal
        open={editVipLevelModalOpen}
        levelId={currentRow?.level_id}
        formRef={userVipLevelForm}
        onCancel={(open) => {
          if (!open) {
            // 清空表单
            userVipLevelForm.current?.resetFields();
          }
          handleEditVipLevelModalOpen(open)
        }}
        onSubmit={async (value) => {
          const params = {
            userId: currentRow?.userId,
            ...value
          }
          const res = await setVipLevel(params)
          if (res.success) {
            userVipLevelForm.current?.resetFields();
            handleEditVipLevelModalOpen(false)
            // 刷新表格
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >

      </VipLevelModal>
      {/* 修改登录密码/提现密码的弹窗 */}
      <ModalForm
        title={setEditPasswordType === 1 ? '修改登录密码' : '修改提现密码'}
        width={400}
        formRef={editPasswordForm}
        open={editPasswordModalOpen}
        onOpenChange={(open) => {
          // 表单关闭时重置表单
          if (!open) {
            setCurrentRow(undefined) // 重置当前操作的列
            setEditPasswordType(1) // 重置类型
            editPasswordForm.current?.resetFields();
          }
          handleEditPasswordModalOpen(open);
        }}
        onFinish={async (value) => {
          const params = {
            type: editPasswordType,
            ...value
          }
          const res = await changePassword(params)
          if (res.success) {
            handleEditPasswordModalOpen(false)
            message.success('修改成功')
            // 刷新表格
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          name="userId"
          label="用户ID"
          placeholder="请输入"
          hidden
        />
        <ProFormText
          name="password"
          label={setEditPasswordType === 1 ? '登录密码' : '提现密码'}
          placeholder="请输入"
        />
      </ModalForm>
      <Modal
        width={400}
        open={accountDisableModalOpen}
        title={shortcutData.modalText}
        onOk={async () => {
          const params = {
            userId: currentRow?.userId,
            [shortcutData.actionField]: shortcutData.value
          }
          const res = await shortcutData.apiUrl(params)
          if (res.success) {
            message.success('设置成功')
          }
          handleAccountDisableModalOpen(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          handleAccountDisableModalOpen(false);
        }}
      >
      </Modal>
    </PageContainer >
  );
};

export default TableList;
