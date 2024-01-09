import { PageContainer } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Card, theme, Button, Checkbox, Form, Input, TimePicker, InputNumber, message } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs'
import { queryBasicList, updateBasicList } from './api'

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

type FieldType = {
  app_name: string; // 系统名字
  open_time: string; // 开盘时间
  close_time: string; // 闭盘时间
  withdraw_start_time: string; // 提现开始时间
  withdraw_end_time: string; // 提现结束时间
  register_reward: number; // 注册奖励
  rebate_multiple: number; // 返佣倍数
  first_rebate_ratio: number; // 一级返佣比例
  second_rebate_ratio: number; // 二级返佣比例
  third_rebate_ratio: number; // 三级返佣比例
  fourth_rebate_ratio: number; // 四级返佣比例
  fifth_rebate_ratio: number; // 五级返佣比例
};

const basic: React.FC = () => {

  const [form] = Form.useForm();

  const [formJson, setFormJson] = useState<FieldType>({
    app_name: '', // 系统名字
    open_time: '', // 开盘时间
    clone_time: '', // 闭盘时间
    withdraw_start_time: '', // 提现开始时间
    withdraw_end_time: '', // 提现结束时间
    register_reward: 0, // 注册奖励
    rebate_multiple: 0, // 返佣倍数
    first_rebate_ratio: 0, // 一级返佣比例
    second_rebate_ratio: 0, // 二级返佣比例
    third_rebate_ratio: 0, // 三级返佣比例
    fourth_rebate_ratio: 0, // 四级返佣比例
    fifth_rebate_ratio: 0, // 五级返佣比例
  })

  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = (values: any) => {
    const open_time = values.open_time.format('HH:mm:ss')
    // 循环values，如果是dayjs类型，转换成字符串
    const newValues = Object.keys(values).reduce((pre, cur) => {
      if (values[cur] instanceof dayjs) {
        pre[cur] = values[cur].format('HH:mm:ss')
      } else {
        pre[cur] = values[cur]
      }
      return pre
    }, {})
    updateBasicList(newValues).then(res => {
      if (res.success) {
        console.log('fasfasfsa', messageApi, res)
        message.success(res.msg);
      }
    })
  };


  useEffect(() => {
    queryBasicList().then(res => {
      if (res.success) {
        const data = res.data
        console.log('🚀  file: index.tsx:60  queryBasicList  data.clone_time:', data.close_time)
        form.setFieldsValue({
          app_name: data.app_name || '',
          open_time: dayjs(data.open_time, 'HH:mm:ss'),
          close_time: dayjs(data.close_time, 'HH:mm:ss'),
          withdraw_start_time: dayjs(data.withdraw_start_time, 'HH:mm:ss'),
          withdraw_end_time: dayjs(data.withdraw_end_time, 'HH:mm:ss'),
          register_reward: data.register_reward || 0,
          rebate_multiple: data.rebate_multiple || 0,
          first_rebate_ratio: data.first_rebate_ratio || 0,
          second_rebate_ratio: data.second_rebate_ratio || 0,
          third_rebate_ratio: data.third_rebate_ratio || 0,
          fourth_rebate_ratio: data.fourth_rebate_ratio || 0,
          fifth_rebate_ratio: data.fifth_rebate_ratio || 0,
        })
      }
    });
  }, [])

  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="APP名称"
            name="app_name"
            rules={[{ required: true, message: 'Please input System Name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="开盘时间"
            name="open_time"
          >
            <TimePicker format="HH:mm:ss" />
          </Form.Item>

          <Form.Item<FieldType>
            label="闭盘时间"
            name="close_time"
          >
            <TimePicker format="HH:mm:ss" />
          </Form.Item>

          <Form.Item<FieldType>
            label="提现-开始时间"
            name="withdraw_start_time"
          >
            <TimePicker format="HH:mm:ss" />
          </Form.Item>

          <Form.Item<FieldType>
            label="提现-结束时间"
            name="withdraw_end_time"
          >
            <TimePicker format="HH:mm:ss" />
          </Form.Item>


          <Form.Item<FieldType>
            label="注册奖励"
            name="register_reward"
          >
            <InputNumber min={0} precision={2} />
          </Form.Item>

          <Form.Item<FieldType>
            label="返佣倍数"
            name="rebate_multiple"
            extra="设置卡单或者连单用户才会生效"
          >
            <InputNumber min={0} precision={2} />
          </Form.Item>

          <Form.Item<FieldType>
            label="一级返佣比例"
            name="first_rebate_ratio"
            extra="佣金*返佣比例"
          >
            <InputNumber min={0} precision={2} />
          </Form.Item>

          <Form.Item<FieldType>
            label="二级返佣比例"
            name="second_rebate_ratio"
            extra="佣金*返佣比例"
          >
            <InputNumber min={0} precision={2} />
          </Form.Item>

          <Form.Item<FieldType>
            label="三级返佣比例"
            name="third_rebate_ratio"
            extra="佣金*返佣比例"
          >
            <InputNumber min={0} precision={2} />
          </Form.Item>

          <Form.Item<FieldType>
            label="四级返佣比例"
            name="fourth_rebate_ratio"
            extra="佣金*返佣比例"
          >
            <InputNumber min={0} precision={2} />
          </Form.Item>

          <Form.Item<FieldType>
            label="五级返佣比例"
            name="fifth_rebate_ratio"
            extra="佣金*返佣比例"
          >
            <InputNumber min={0} precision={2} />
          </Form.Item>


          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">提交</Button>
          </Form.Item>
        </Form>

      </Card>
    </PageContainer>
  )
}

export default basic