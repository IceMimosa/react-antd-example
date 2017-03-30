import { isPromise, isFSA } from 'common/utils';
import * as React from 'react';


const SmartForm = {
  // 搞两层扩展用，万一后头要传点什么别的鬼
  // 提供两个 prop 给被包裹的组件
  //   function smartSubmit((values) => {}) 执行校验，错误则返回，无错误时，尝试调用 afterSubmit
  //     提交成功会重置 form
  //   submiting 异步执行时，会自动改变状态
  beSmart: () => (WrappedComponent) => {
    class SmartedForm extends React.Component {
      constructor(props) {
        super(props);
        this.state = { submiting: false };
      }

      smartSubmit(doSubmit) {
        const { validateFieldsAndScroll, resetFields } = this.props.form;
        validateFieldsAndScroll((error, values) => {
          if (!!error) {
            return;
          }
          const submitResult = doSubmit(values);
          if (isPromise(submitResult)) {
            this.setState({ submiting: true });
            submitResult.then((value) => {
              this.setState({ submiting: false });
              const fsa = isFSA(value);
              // FSA 的话，非 error 才执行
              if (!fsa || (fsa && !value.error)) {
                resetFields();
                if (_.isFunction(this.props.afterSubmit)) {
                  this.props.afterSubmit(value);
                }
              }
              return value;
            });
            return;
          }
        });
      }

      render() {
        const props = Object.assign({}, this.props, { smartSubmit: ::this.smartSubmit, submiting: this.state.submiting });
        return <WrappedComponent {...props}/>;
      }
    }

    return SmartedForm;
  },
};

export { SmartForm };
