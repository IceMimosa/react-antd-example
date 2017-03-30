import { Form, Input, Col, Icon } from 'antd';
const InputGroup = Input.Group;
const FormItem = Form.Item
import * as React from 'react';
import { PathSelect } from './nodes';
import './muti.scss';

let uuid = 0

const mutiItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
};

class MutiInput extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
  }

  deleteItem (k) {
    const { keywords, form } = this.props
    const { setFieldsValue, getFieldValue } = form
    let keyString = `keys${keywords}`
    let keys = getFieldValue(keyString);
    keys = keys.filter((key) => {
      return key !== k;
    });
    let object = {}
    object[keyString] = keys
    setFieldsValue(object);
  }

  addItem () {
    if(uuid==0 && this.props.uuid){
      uuid = this.props.uuid + 1
    }else {
      uuid ++;
    }
    const { keywords, form } = this.props
    const { setFieldsValue, getFieldValue } = form
    let keyString = `keys${keywords}`
    let keys = getFieldValue(keyString);
    keys = keys.concat(uuid);
    let object = {}
    object[keyString] = keys
    setFieldsValue(object);
  }


  generateObjectGroup(k, nameString, valueString, form) {
    const { getFieldDecorator } = form
    return (
      <InputGroup size='large' key={k} className='muti-group'>
        <Col span='11'>
          <FormItem >
            {getFieldDecorator(nameString, {
              rules: [{ required: true, message: '不能为空' }],
            })(<Input placeholder='请输入key'/>)}
          </FormItem>
        </Col>
        <Col span='11'>
          <FormItem >
            {getFieldDecorator(valueString, {
              rules: [{ required: true, message: '不能为空' }],
            })(<Input placeholder='请输入value'/>)}
          </FormItem>
        </Col>
        <Col span='2'>
          <div className='center'><Icon type='minus-circle-o' onClick={()=>this.deleteItem(k)}/></div>
        </Col>
      </InputGroup>
    )
  }

  generateListGroup(k, nameString, form) {
    const { getFieldDecorator } = form
    return(
      <InputGroup size='large' key={k} className='muti-group'>
        <Col span='22'>
           <FormItem >
            {getFieldDecorator(nameString, {
              rules: [{ required: true, message: '不能为空' }],
            })(<Input placeholder='请输入key'/>)}
          </FormItem>
        </Col>
        <Col span='2'>
          <div className='center'><Icon type='minus-circle-o' onClick={()=>this.deleteItem(k)}/></div>
        </Col>
      </InputGroup>
    )
  }

  generateFileListGroup(k, nameString, form) {
    const { onOpenFile, fileType } = this.props
    const { getFieldValue, getFieldDecorator } = this.props.form;
    const words = getFieldValue( nameString )
    return(
      <InputGroup size='large' key={k} className='muti-group'>
        <Col span='22'>
          <FormItem >
            {getFieldDecorator(nameString, {
              rules: [{ required: true, message: '不能为空' }],
              })(<div><PathSelect onClick={()=>onOpenFile(nameString, fileType)} words={words ? words : '请选择文件'}/></div>)
            }
          </FormItem>
        </Col>
        <Col span='2'>
          <div className='center'><Icon type='minus-circle-o' onClick={()=>this.deleteItem(k)}/></div>
        </Col>
      </InputGroup>
    )
  }

  generateGroup (k, nameString, valueString, form) {
    const { mutiType='object' } = this.props
    let component = '';
    switch(mutiType){
      case 'object':
        component = this.generateObjectGroup(k, nameString, valueString, form); break;
      case 'list':
        component = this.generateListGroup(k, nameString, form); break;
      case 'fileList':
        component = this.generateFileListGroup(k, nameString, form); break;
      default:
        console.error("mutiType not exists, current mutiType is", mutiType)
        component = <div></div>
    }
    return component
  }

  render () {
    const { name, keywords, form, layout } = this.props
    const { getFieldDecorator, getFieldValue } = form;
    getFieldDecorator(`keys${keywords}`, { initialValue: []});
    let fieldValue = getFieldValue(`keys${keywords}`);
    let isUse = fieldValue && fieldValue.length > 0 ? true : false
    const formItems = fieldValue?fieldValue.map((k) => {
      let nameString = `${keywords}-name${k}`
      let valueString = `${keywords}-value${k}`
      return this.generateGroup(k, nameString, valueString, form)
    }):[];
    const itemLyout = layout ? layout : mutiItemLayout;
    return (
      <FormItem label={name} className={isUse? 'muti':''} {...itemLyout}>
        {formItems}
        <div className='center'><Icon type='plus-circle-o' onClick={this.addItem}/></div>
      </FormItem>
    )
  }
}

export { MutiInput }
