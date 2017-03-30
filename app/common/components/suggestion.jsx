import { Select } from 'antd';
import * as React from 'react';


class Suggestion extends React.Component {
  constructor(props) {
    super(props);
    this.selectedOptions = [];
  }

  componentWillReceiveProps(nextProps) {
    // 非 mutiple 模式下 value 是单独的
    const nextValue = this.props.multiple ? nextProps.value : [nextProps.value];
    // 因为外部 form resetFields 和 setFieldValues 都不会触发 onChange ，所以在这里处理
    // 存储已选取的 options ，否则选中项的 text 会不见
    this.selectedOptions = _.concat(this.props.options, this.selectedOptions)
      .filter(option => {
        return _.includes(nextValue, option.value);
      });
  }

  onSearch(value) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    if (value === undefined || value === '') {
      return;
    }
    this.timeout = setTimeout(() => this.props.onSuggest(value), 500);
  }

  render() {
    const { multiple, options, ...otherProps } = this.props;

    return (
      <Select {...otherProps}
        filterOption={false}
        multiple={multiple}
        showSearch={!multiple}
        onSearch={::this.onSearch}
      >
        {_.unionBy(_.concat(options, this.selectedOptions), option => {
          return option.value;
        })
        .map(({ value, text }) => {
          return <Select.Option key={value} value={value}>{text}</Select.Option>;
        })}
      </Select>
    );
  }
}

export default Suggestion;
