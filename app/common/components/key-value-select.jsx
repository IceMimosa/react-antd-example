import { Select } from 'antd';


export default ({ valueField, ...props }) => {
  return (
    <Select {...props}>
      {
        _.map(props.optionMap, (v, k) => <Select.Option key={k}>{valueField ? v[valueField] : v}</Select.Option>)
      }
    </Select>
  );
};