import * as React from 'react';
import { Tooltip } from 'antd';
import { Icon } from 'common';
import 'editor/dynamic-nodes/components/dynamic-nodes.scss';
import 'editor/dynamic-nodes/components/vis-overwrite.scss';
import './circle-nodes.scss';
import { generateUUID, clickable } from 'scripts';
import Immutable from 'immutable';

class CircleNodes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
    };
    this.draw = this.draw.bind(this);
    this.destroy = this.destroy.bind(this);
    this.backClick = this.backClick.bind(this);
    this.operateClick = this.operateClick.bind(this);
    this.nodeSelected = this.nodeSelected.bind(this);

    const uuid = generateUUID().replace(/\-/g, '');
    this.compId = `node${uuid}`;
    this.network = null;
  }

  componentDidMount() {
    require.ensure(['vis-network'], (require) => {
      require('vis-network');
      const { data } = this.props;
      this.draw(data);
    });
  }

  componentWillReceiveProps(nextProps) {
    const nextData = Immutable.fromJS(nextProps.data);
    const data = Immutable.fromJS(this.props.data);
    if (!Immutable.is(nextData, data)) {
      this.draw(nextProps.data);
    }
  }

  destroy() {
    if (this.network !== null) {
      this.network.destroy();
      this.network = null;
    }
  }

  draw(data = {}) {
    this.destroy();
    if (!window.Network) {
      require.ensure(['vis-network'], (require) => {
        require('vis-network');
        this.draw(data);
      });
      return null;
    }

    const { direction = 'DU' } = this.props;
    const options = {
      layout: {
        hierarchical: {
          direction,
        },
      },
      edges: {
        smooth: {
          type: 'cubicBezier',
          forceDirection: 'vertical',
          roundness: 0.4,
        },
      },
      physics: {
        enabled: false,
      },
      locale: 'cn',
      interaction: {
        navigationButtons: true,
        keyboard: false,
        dragNodes: false,
      },
    };
    this.network = new Network(this.refs.network, data, options);
    this.network.on('select', this.nodeSelected);
  }

  nodeSelected(params) {
    const { onSelect } = this.props;
    if (!onSelect) {
      return;
    }
    const { nodes } = params;
    if (nodes.length === 1) {
      onSelect(nodes[0]);
    }
  }

  operateClick(type, domClass) {
    this.setState({ type });
    this.backClick();
    clickable(document.querySelector(`#${this.compId} .${domClass}`));
  }

  backClick() {
    clickable(document.querySelector(`#${this.compId} .vis-back`));
  }

  render() {
    const { type } = this.state;
    return (
      <div className='dynamic-nodes circle'>
        <Tooltip placement='left' title='还原'>
          <a href="#" className='node-operate'><Icon type='huanyuan' className={type=='restore' ? 'active' : ''} onClick={()=>this.operateClick('restore', 'vis-zoomExtends')}/></a>
        </Tooltip>
        <div ref='network' className='network' id={this.compId}></div>
      </div>
    );
  }
}

export default CircleNodes;
