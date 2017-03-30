import { Select } from 'antd';
import React, { Component } from 'react';
import * as ReactRedux from 'react-redux';


const getMapStateToProps = stateKey => {
  return state => ({ options: state[stateKey] });
};

const getMapDispatchToProps = loadDataAction => {
  return dispatch => ({
    loadData() {
      dispatch(loadDataAction());
    },
  });
};

export default {
  create: ({ state, loadDataAction, keyField, valueField, ...otherProps }) => {
    class BackendSelect extends Component {
      componentDidMount() {
        const { loadData } = this.props;
        if (loadData && typeof loadData === 'function') {
          loadData();
        }
      }

      render() {
        const { options = [] } = this.props;
        return (
          <Select defaultValue={this.props.defaultVal} {...otherProps} {...this.props}>
            {
              _.map(options, option => <Select.Option key={option[keyField]}>{option[valueField]}</Select.Option>)
            }
          </Select>
        );
      }
    }

    const mapStateToProps = getMapStateToProps(state);
    const mapDispatchToProps = typeof loadDataAction === 'function' ? getMapDispatchToProps(loadDataAction) : null;
    return ReactRedux.connect(mapStateToProps, mapDispatchToProps)(BackendSelect);
  },
};
