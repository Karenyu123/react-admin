import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import PropTypes from 'prop-types'
import { reqDeleteImg } from '../../api'
import commenName from '../../config/commenName'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  constructor(props) {
    super(props)
    let fileList = []
    const { imgs } = this.props
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((item,index) => ({
        uid: -index,
        name: item,
        status: 'done',
        url: commenName.BASE_UPLOAD_URL+item
      }))
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList
    }
  }
 

  handleCancel = () => this.setState({ previewVisible: false });
  // 预览图片
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange =async ({ fileList, file }) => {
    //获取上传返回数据
    const res = file.response
    if (file.status === 'done') {
      if (res.status === 0) {
        const { name, url } = res.data
        //修改图片列表里面最新上传图片的name和url值
        fileList[fileList.length - 1].name = name
        fileList[fileList.length - 1].url = url
        message.success('上传图片成功')
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      console.log(file.name)
      const res = await reqDeleteImg(file.name)
      if (res.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }
    this.setState({ fileList })
  }
  getImages = () => {
    return this.state.fileList.map(item => item.name)
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          name='image'
          accept='image/*'
          fileList={ fileList }
          onPreview={ this.handlePreview }
          onChange={ this.handleChange }
        >
          { fileList.length >= 3 ? null : uploadButton }
        </Upload>
        <Modal
          visible={ previewVisible }
          footer={ null }
          onCancel={ this.handleCancel }>
          <img alt="example" style={ { width: '100%' } } src={ previewImage } />
        </Modal>
      </div>
    );
  }
}