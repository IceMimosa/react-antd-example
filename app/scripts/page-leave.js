export const setBeforeLoad = (words = '内容尚未保存，是否刷新?') => {
  window.onbeforeunload = (e) => {
    const pathname = window.location.pathname;
    const event = (e || window.event);
    event.returnValue = words; // For + IE
    return words;
  };
};

export const removeBeforeLoad = () => {
  window.onbeforeunload = false;
};
