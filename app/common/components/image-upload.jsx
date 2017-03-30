import React, { Component } from 'react';
import { Input, Upload } from 'antd';
import { Icon } from 'common';

import './image-upload.scss';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.imageUrl) {
      this.setState({ imageUrl: nextProps.value });
    }
  }

  getUploadProps() {
    const { form, id } = this.props;
    return {
      action: '/api/images/upload',
      showUploadList: false,
      onChange: (info) => {
        if (!info.file.response) {
          return;
        }
        const url = info.file.response.url;
        this.setState({ imageUrl: url });
        form.setFieldsValue({ [id]: url });
      },
    };
  }

  render() {
    const { uploadText = '上传图片', hintText = '支持图片格式为jpg/png', hint } = this.props;
    const imageUrl = this.state.imageUrl;
    return (
      <div className='image-upload-wrap'>
        <div className='image-upload' >
          <Input type='hidden' value={imageUrl}/>
          <Upload {...this.getUploadProps()}>
          {
            imageUrl ? <div><img role='presentation' src={imageUrl}/><div className='noImage'><Icon key='icon' type='thin-add'/><div key='text'>{uploadText}</div></div></div>
              : <div><Icon key='icon' type='thin-add'/><div key='text'>{uploadText}</div></div>
          }
          </Upload>
        </div>
        {
          hint ? <div className='hint'>{hintText}</div> : null
        }
      </div>
    );
  }
}

export default ImageUpload;
