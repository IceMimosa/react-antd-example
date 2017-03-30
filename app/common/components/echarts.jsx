import echarts from 'echarts';
import React from 'react';
import elementResizeEvent from 'element-resize-event';

import './echarts.scss';

class Echarts extends React.Component {
  // first add
  componentDidMount() {
    let echartObj = this.renderEchartDom();
    let onEvents = this.props.onEvents || [];
    if (this.props.groupId) {
      echartObj.group = this.props.groupId;
      echarts.connect(this.props.groupId);
    }
    for (let eventName in onEvents) {
      // ignore the event config which not satisfy
      if (typeof eventName === 'string' && typeof onEvents[eventName] === 'function') {
        // binding event
        echartObj.on(eventName, (param) => {
          onEvents[eventName](param, echartObj);
        });
      }
    }
    // on chart ready
    if (typeof this.props.onChartReady === 'function') this.props.onChartReady(echartObj);

    // on resize
    elementResizeEvent(this.refs.echartsDom, () => {
      echartObj.resize();
    });
  }

  // update
  componentDidUpdate() {
    this.renderEchartDom();
  }

  // remove
  componentWillUnmount() {
    echarts.dispose(this.refs.chart);
  }

  // render the dom
  renderEchartDom() {
    // init the echart object
    let echartObj = this.getEchartsInstance();
    // set the echart option
    echartObj.setOption(this.props.option, this.props.notMerge || false, this.props.lazyUpdate || false);

    // set loading mask
    if (this.props.showLoading) echartObj.showLoading();
    else echartObj.hideLoading();

    return echartObj;
  }

  getEchartsInstance() {
    // return the echart object
    let { mapData } = this.props
    if(mapData) {
      echarts.registerMap('china', mapData);
      return echarts.init(this.refs.echartsDom, this.props.theme);
    }
    return echarts.getInstanceByDom(this.refs.echartsDom) || echarts.init(this.refs.echartsDom, this.props.theme);
  }

  render() {
    let className = 'paas-echarts' + (this.props.mapData ? " paas-map-echarts" : "");
    if (!!this.props.className) {
      className += ` ${this.props.className}`;
    }
    return (
      <div ref='echartsDom' className={className} style={this.props.style}/>
    );
  }
}

export default Echarts;
