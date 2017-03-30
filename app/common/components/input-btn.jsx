import * as React from 'react';
import { Input, Button } from 'antd';
import { notify } from 'common/utils';

class InputBtn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      loading: false,
    };
  }

  componentWillUnmount() {
    this.cancelCode();
  }

  cancelCode() {
    if (this.codeTimeout) {
      clearTimeout(this.codeTimeout);
      this.codeTimeout = undefined;
    }
  }

  timer() {
    let seconds = this.state.time;
    if (seconds !== 0) {
      seconds--;
      this.codeTimeout = setTimeout(() => {
        if (!this.state.unmount) this.setState({ time: seconds });
        this.timer();
      }, 1000);
    }
  }

  sendVerific() {
    this.setState({ loading: true });
    const mobile = this.props.form.getFieldValue('mobile');
    this.props.onSendVerfiCode({ mobile })
      .then(() => {
        notify('success', '验证码已发送');
        const seconds = 60;
        this.setState({
          time: seconds,
          verific: false,
          loading: false,
        }, () => { this.timer(); });
      }, () => {
        this.setState({ loading: false });
      });
  }

  inputCode(e) {
    this.props.form.setFieldsValue({ verifyCode: e.target.value });
  }

  render() {
    const { form } = this.props;
    const { time, loading } = this.state;
    const { getFieldDecorator, getFieldValue, getFieldError } = form;
    const verificationField = getFieldDecorator('verifyCode', {
      rules: [{ required: true, message: '验证码必填' }],
    });
    const verific = !!getFieldValue('mobile') && !getFieldError('mobile') && !time;
    return (
      <div className='code'>
        {verificationField(
          <Input className='code-content' onChange={e => { form.setFieldsValue({ verifyCode: e.target.value }); }} ref={(ref) => { this.input = ref; }}/>
        )}
        <Button className='btn-verific' onClick={::this.sendVerific} disabled={!verific} loading={loading} type='ghost'>
          {time > 0 ? time : '发送验证码'}
        </Button>
      </div >
    );
  }
}

export default InputBtn;
