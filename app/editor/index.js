/*
  公用的编辑器
  请按需引入而不是整体 import { xx } from 'editor'
*/

import EditNode from './nodes/containers/edit-node';
import DynamicNodes from './dynamic-nodes';
import CircleNodes from './circle-nodes';

import Xml from './codemirror/xml';
import Sql from './codemirror/sql';
import FileChooseModal from './files/file-choose/containers/modal';
import FileCopyModal from './files/file-choose/containers/modal-copy';
import { MutiInput } from './nodes/components/muti';

export {
  EditNode,
  DynamicNodes,
  CircleNodes,
  Xml,
  Sql,
  FileChooseModal,
  FileCopyModal,
  MutiInput
};