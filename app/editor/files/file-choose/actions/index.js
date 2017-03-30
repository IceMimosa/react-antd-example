import { actionTypeCreatorWithNameSpace, createAction } from 'common/utils/action';
import agent from 'agent';

const actionTypeCreator = actionTypeCreatorWithNameSpace('fileChoose');

export const moveFile = createAction(actionTypeCreator('moveFile'), (sources, dest) => {
  return agent.put('/api/horus/hdfs/moves')
              .query({ sources: JSON.stringify(sources), dest, override: true })
              .then(response => response.body);
});

export const copyFile = createAction(actionTypeCreator('moveFile'), (sources, dest, override) => {
  return agent.put('/api/horus/hdfs/copies')
              .query({ sources: JSON.stringify(sources), dest, override })
              .then(response => response.body);
});

export const folderList = createAction(actionTypeCreator('folderList'), (vPath = '/', type = '', suffixs = '') => {
  type = suffixs[0] === 'q' ? '2' : '3';
  return agent.get('/api/horus/data/develop/paging')
    .query({ vPath, type, suffixs: suffixs ? JSON.stringify(suffixs) : suffixs })
    .then(response => response.body.files);
}, {
  fetch: {
    processing: true,
  },
});

export const initTree = createAction(actionTypeCreator('initTree'), (children) => {
  return { tree: [{ name: '/', key: '/', fileType: 1, children }] };
});

export const emptyTree = createAction(actionTypeCreator('emptyTree'), () => {
  return { tree: [{ name: '/', key: '/', fileType: 1 }] };
});

export const addTree = createAction(actionTypeCreator('addTree'), (tree, eventKey, children) => {
  const newTree = [...tree];
  const traveral = (data) => {
    data.forEach((item) => {
      if (item.key === eventKey) {
        item.children = children;
        item.isLeaf = false;
        if (children && children.length === 0) {
          item.isLeaf = true;
        }
      } else if (item.children) {
        traveral(item.children);
      }
    });
  };
  traveral(newTree);
  return { tree: newTree };
});
