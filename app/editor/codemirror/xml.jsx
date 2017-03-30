import * as React from 'react';
import ReactDOM from 'react-dom';

export const xmlOption = {
  mode: { name: 'text/xml' },
  lineNumbers: true,
  tabSize: 2,
  smartIndent: true, // 自动缩进，设置是否根据上下文自动缩进（和上一行相同的缩进量）
  showCursorWhenSelecting: true, // 在选择时是否显示光标
  lineWiseCopyCut: true, // 启用时，如果在复制或剪切时没有选择文本，那么就会自动操作光标所在的整行。
  readOnly: false,       // 是否只读
};

class Xml extends React.Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.CodeMirror = null;
  }

  componentWillMount() {
    const { readOnly } = this.props;
    // 是否只读
    if (readOnly) {
      xmlOption.readOnly = readOnly;
    }
  }

  componentDidMount() {
    if (this.editor) {
      return;
    }
    require.ensure(['codemirror'], (require) => {
      const CodeMirror = require('codemirror');
      require('codemirror/mode/xml/xml');
      require('codemirror/addon/hint/xml-hint');
      require('codemirror/addon/hint/show-hint');
      require('codemirror/lib/codemirror.css');
      require('codemirror/addon/hint/show-hint.css');
      this.CodeMirror = CodeMirror;
      this.editor = CodeMirror.fromTextArea(ReactDOM.findDOMNode(this.refs.xml).querySelector('textarea'), xmlOption);
    });
  }

  componentDidUpdate() {
    if (!this.props.isShow || !this.CodeMirror) {
      return;
    }
    this.editor.toTextArea();
    this.editor = this.CodeMirror.fromTextArea(ReactDOM.findDOMNode(this.refs.xml).querySelector('textarea'), xmlOption);
  }

  componentWillUnmount() {
    this.editor.toTextArea();
  }

  getValue() {
    return this.editor.getValue();
  }

  setValue(value) {
    return this.editor.setValue(value);
  }

  initValue(value) {
    if (!!value) {
      this.editor ? this.setValue(value) : '';
    }
  }

  render() {
    const { defaultValue, className, isShow = true } = this.props;
    let classes = isShow ? className : 'hide';

    // 初始化值
    this.initValue(defaultValue);
    return (
      <div className={classes} ref='xml'>
        <textarea defaultValue={defaultValue} style={{ display: 'none' }}></textarea>
      </div>
    );
  }
}

export default Xml;


