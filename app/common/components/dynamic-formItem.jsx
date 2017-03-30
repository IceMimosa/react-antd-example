import { Form, Row, Col, Input } from 'antd';
import { Icon as CustomIcon } from 'common';
import { notify } from 'common/utils';
import * as React from 'react';

const FormItem = Form.Item;

class DynamicFormItem extends React.Component {
  render() {
    const { layout, dataList, changed, add, remove } = this.props;
    const { getFieldDecorator } = this.props.form;
    const label = (typeof this.props.label) === 'object' ? label : { key: this.props.label, value: this.props.label };
    const row = _.map(this.props.row, (u) => { return (typeof u) === 'object' ? u : { key: u, value: u }; });
    const span = 20 / row.length;
    return (
      <div>
        {
          dataList.map((value, i) => {
            return (
              <FormItem key={i} className={`dynamic-item item-${label.key}-${i}`} label={`${label.value} ${i + 1}`} {...layout}>
                <Row>
                  {
                    _.map(row, (u, j) => {
                      return (
                        <Col span={span} key={j}>
                          <FormItem className={`dynamic-item item-${u.key}-${j}`}>
                            {
                              getFieldDecorator(`row-${i}-col-${j}`, {
                                rules: [],
                                initialValue: dataList[i] ? dataList[i][j] : '',
                              })(<Input placeholder={u.value} onChange={e => changed(e, i, j)}/>)
                            }
                          </FormItem>
                        </Col>
                      );
                    })
                  }
                  <Col span={2}>
                    <CustomIcon type='cir-del' onClick={() => remove(i)}/>
                  </Col>
                  <Col span={2}>
                    <CustomIcon type='cir-add' onClick={() => add(i)}/>
                  </Col>
                </Row>
              </FormItem>
            );
          })
        }
      </div>
    );
  }
}

export default DynamicFormItem;
