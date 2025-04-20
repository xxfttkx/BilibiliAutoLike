document.addEventListener("DOMContentLoaded", () => {
    const sleepTimeInput = document.getElementById("sleepTime");
    const likeCountInput = document.getElementById("likeCount");
    const autoLikeCheckbox = document.getElementById("autoLike");
    const saveBtn = document.getElementById("saveBtn");
  
    // 1. 从 storage 读取已有设置并填入 UI
    chrome.storage.local.get(["sleepTime", "likeCount", "autoLike"], (items) => {
      sleepTimeInput.value = items.sleepTime || 1000;
      likeCountInput.value = items.likeCount || 35;
      autoLikeCheckbox.checked = items.autoLike ?? true; // 默认 true
    });
  
    // 2. 保存设置 + 发送到 content.js
    saveBtn.addEventListener("click", () => {
      const sleepTime = parseInt(sleepTimeInput.value);
      const likeCount = parseInt(likeCountInput.value);
      const autoLike = autoLikeCheckbox.checked;
  
      chrome.storage.local.set({
        sleepTime: sleepTime,
        likeCount: likeCount,
        autoLike: autoLike
      });

      window.close(); // 关闭 popup（可选）
  
      // 通知 content.js（当前 tab）
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        return;
        if (tabs.length === 0) return;
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "updateSettings",
          sleepTime,
          likeCount,
          autoLike
        });
      });
     
    });
  });
  