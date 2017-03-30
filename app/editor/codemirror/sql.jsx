import * as React from 'react';
import ReactDOM from 'react-dom';

export const sqlOption = {
  mode: { name: 'text/x-hive' },
  lineNumbers: true,
  tabSize: 2,
  smartIndent: true, // 自动缩进，设置是否根据上下文自动缩进（和上一行相同的缩进量）
  showCursorWhenSelecting: true, // 在选择时是否显示光标
  lineWiseCopyCut: true, // 启用时，如果在复制或剪切时没有选择文本，那么就会自动操作光标所在的整行。
  extraKeys: { 'Ctrl': 'autocomplete' },
};

class Sql extends React.Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.CodeMirror = null;
  }

  componentDidMount() {
    if (this.editor) {
      return;
    }
    require.ensure(['codemirror'], (require) => {
      const CodeMirror = require('codemirror');
      require('codemirror/mode/sql/sql');
      require('codemirror/addon/hint/sql-hint');
      require('codemirror/addon/hint/show-hint');
      require('codemirror/lib/codemirror.css');
      require('codemirror/addon/hint/show-hint.css');
      this.CodeMirror = CodeMirror;
      this.editor = CodeMirror.fromTextArea(ReactDOM.findDOMNode(this.refs.sql).querySelector('textarea'), sqlOption);
    });
  }

  componentDidUpdate() {
    if (!this.props.isShow || !this.CodeMirror) {
      return;
    }
    this.editor.toTextArea();
    this.editor = this.CodeMirror.fromTextArea(ReactDOM.findDOMNode(this.refs.sql).querySelector('textarea'), sqlOption);
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

  render() {
    const { defaultValue, className, isShow = true } = this.props;
    const classes = isShow ? className : 'hide';
    return (
      <div className={classes} ref='sql'>
        <textarea defaultValue={defaultValue} style={{ display: 'none' }}></textarea>
      </div>
    );
  }
}


export default Sql;
