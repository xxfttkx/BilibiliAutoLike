// 监听来自 popup.js 的消息，更新设置  没用到
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateSettings") {
    const sleepTime = message.sleepTime || 1000; // 默认值为 1000 毫秒
    const likeCount = message.likeCount || 35; // 默认点赞 35 次
    const autoLike = message.autoLike || true; // 默认自动点赞

    // 保存设置到 chrome.storage
    chrome.storage.local.set({ sleepTime: sleepTime, likeCount: likeCount, autoLike: autoLike });

    // 如果自动点赞开启，且已经进入直播间，执行自动点赞
    if (autoLike) {
      autoLikeIfMedalDark(sleepTime, likeCount);
    }
  }
});

// 从 chrome.storage 获取保存的设置
chrome.storage.local.get(['sleepTime', 'likeCount', 'autoLike'], function (items) {
  const sleepTime = items.sleepTime || 1000; // 默认值为 1000 毫秒
  const likeCount = items.likeCount || 35; // 默认点赞 35 次
  const autoLike = items.autoLike !== undefined ? items.autoLike : true; // 默认自动点赞

  // 如果自动点赞开启，执行自动点赞
  if (autoLike) {
    autoLikeIfMedalDark(sleepTime, likeCount);
  }
});

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let stopLike = false; // 控制点赞是否继续

async function autoLikeIfMedalDark(sleepTime, likeCount) {
  await sleep(3000); // 延迟时间
  const medal = document.querySelector(".medal-item-ctnr");
  let isDark = medal?.classList.contains("medal-item-dim");
  isDark = true;

  if (isDark) {
    const followBtn = document.querySelectorAll(".side-bar-btn-cntr")[1];

    if (followBtn) {
      console.log("followBtn found");
      followBtn.addEventListener("click", () => {
        console.log("点击了关注按钮，准备切换直播间，停止点赞");
        stopLike = true;
      });
    }
    else {
      console.log("no followBtn");
    }

    console.log("粉丝牌熄灭，开始自动点赞");

    const likeBtn = document.querySelector(".like-btn");
    if (!likeBtn) {
      console.log("未找到点赞按钮");
      return;
    }

    // 根据点赞次数来点击
    for (let i = 0; i < likeCount; i++) {
      if (stopLike) {
        console.log("检测到中断，停止点赞");
        stopLike = false; // 重置标志，方便下次运行
        return;
      }
      likeBtn.click();
      await sleep(sleepTime); // 每次点赞后等待指定的延迟时间
    }

    console.log("已点赞" + likeCount + "次");
  } else {
    console.log("粉丝牌未熄灭，无需点赞");
  }
}
