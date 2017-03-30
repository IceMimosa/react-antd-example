import { Modal } from 'antd';
import * as React from 'react';

import { isPromise } from 'common/utils';

// usage: <FormModal form={FormComponent} formProps={{ someProps }}/>
// 会在 fromProps 中放一个 afterSubmit 回调，用于关闭当前 Modal
// 当 formProps 中有 afterSubmit 时，会进行包装
// 推荐使用 SmartForm 来包装内部的 Form
class FormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
    };
  }

  show() {
    this.setState({ visible: true });
  }
  handleCancel() {
    this.setState({ visible: false });
  }
  afterSubmit(value) {
    const formProps = this.props.formProps || {};
    if (_.isFunction(formProps.afterSubmit)) {
      formProps.afterSubmit(value);
    }
    if (_.isFunction(this.props.afterSubmit)) {
      this.props.afterSubmit(value);
    }
    this.handleCancel();
  }

  render() {
    const FormClass = this.props.form;
    const formProps = this.props.formProps || {};

    return (
      <Modal
        {...this.props}
        visible={this.state.visible}
        footer={undefined}
        onCancel={::this.handleCancel}
      >
        <FormClass {...formProps} afterSubmit={::this.afterSubmit}/>
      </Modal>
    );
  }
}

/**
 * Usage: SimpleModal.create(options)(ComponentNeedToWrappedWithModal)
 * options: {
 *   autoHide: true | false // is auto hide modal after ok or cancel
 *   onOk: null | function(wrappedComponent, modal) // callback when ok button click, can be a Promise
 *   onCancel: null | function(wrappedComponent, modal) // callback when cancel button click, can be a Promise
 *   onShow: null | function(wrappedComponent, modal, ...otherArgsPassFormShowFunction) // callback when modal show
 *   anyOthers // will pass through to the antd Modal
 * }
 */
const SimpleModal = {
  create: (options = {}) => WrappedComponent => {
    const { autoHide = true, onOk, onCancel, onShow, ...otherProps } = options;

    return class SimpleModalWrap extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          loading: false,
          visible: false,
          modalProps: {},
        };
      }

      show(...args) {
        this.setState({ visible: true });
        const wrappedInstance = this.refs.wrappedComponent;
        if (onShow) {
          if (wrappedInstance) {
            onShow(wrappedInstance, this, ...args);
          } else {
            // the wrappedComponent not exists before first shown. wait unit next tick.
            setTimeout(() => {
              onShow(this.refs.wrappedComponent, this, ...args);
            }, 0);
          }
        }
      }
      hide() {
        this.setState({ visible: false });
      }
      loading(isLoading) {
        this.setState({ loading: isLoading });
      }
      setModalProps(props) {
        this.setState({
          modalProps: props,
        });
      }
      onOk() {
        this.onHide(onOk);
      }
      onCancel() {
        this.onHide(onCancel);
      }
      onHide(func) {
        let funcResult;
        if (func) {
          funcResult = func(this.refs.wrappedComponent, this);
        } else {
          this.hide();
        }
        if (autoHide) {
          if (isPromise(funcResult)) {
            funcResult.then(() => this.hide());
          } else {
            this.hide();
          }
        }
      }

      render() {
        const props = Object.assign({}, this.props, { modal: this });

        return (
          <Modal {...Object.assign({}, otherProps, this.props.modalProps, this.state.modalProps)}
            closable={false}
            visible={this.state.visible}
            confirmLoading={this.state.loading}
            onOk={::this.onOk}
            onCancel={::this.onCancel}
          >
            <WrappedComponent ref='wrappedComponent' {...props}/>
          </Modal>
        );
      }
    };
  },
};

export { FormModal, SimpleModal };
