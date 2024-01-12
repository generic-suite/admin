import {
  ProFormDateTimePicker,
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { getVipList } from '@/services/base/api'



export type UpdateFormProps = {
  open: boolean;
  levelId: number;
  formRef: any;
  onSubmit: (values: FormValueType) => Promise<void>;
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
};


const VipLevelModal = (props) => {

  // 列表数据
  const [vipList, setVipList] = useState([]);
  return (
    <ModalForm
      title='修改用户会员等级'
      width={400}
      visible={props.open}
      onVisibleChange={props.onCancel}
      onOpenChange={async open => {
        if (open) {
          const { data } = await getVipList();
          const list = data.map(item => {
            return {
              value: item.id,
              label: item.name,
            }
          })
          await setVipList(list);
          props.formRef.current?.setFieldsValue({
            level_id: props.levelId,
          });
        } else {
          props.onCancel();
        }
      }}
      onFinish={props.onSubmit}
      formRef={props.formRef}
    >
      <ProFormSelect
        name="level_id"
        label="会员等级"
        options={vipList}
      >
      </ProFormSelect>
    </ModalForm>
  )
}

export default VipLevelModal;