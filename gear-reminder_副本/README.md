# 「带什么」— 把网页原型打包成安卓 app（保姆级步骤）

这套工程用 **Capacitor** 把你测试过的那个网页 app 原样裹成一个原生安卓 app，并接上了**真正的本地通知**：到点系统会真的弹推送，app 关着也会弹。
你测过的所有功能（模板、排拍摄、收拾/核对两段勾选、完成撒花特效）都在，数据现在存在手机本地、不会丢。

> 最后编译出 APK 这一步要在**你自己的电脑**上跑（需要安卓构建环境）。第一次配环境大概 30–60 分钟，之后改代码再出包就几分钟。
> 如果你不想自己折腾，可以把整个文件夹连这份说明丢给 Claude Code / Cursor，或交给一个会安卓的朋友，让他照着下面的步骤跑。

---

## 一、先装好三样东西（一次性）

1. **Node.js**（选 LTS 版）：https://nodejs.org
2. **Android Studio**：https://developer.android.com/studio
   - 安装时让它把 Android SDK 一起装上
   - 需要 **JDK 17 或更新**（Android Studio 通常自带）
3. 一台**安卓手机**（打开「开发者选项 → USB 调试」），或用 Android Studio 里的模拟器

---

## 二、初始化工程（在本文件夹里依次运行）

打开终端，`cd` 进入这个文件夹（里面有 `www/`、`capacitor.config.json`），然后：

```bash
# 1. 初始化 npm（已有 package.json 可跳过，回车默认即可）
npm init -y

# 2. 装 Capacitor 核心 + 命令行
npm install @capacitor/core @capacitor/cli

# 3. 装本地通知插件 + 安卓平台
npm install @capacitor/local-notifications @capacitor/android

# 4. 生成安卓原生工程，并把网页同步进去
npx cap add android
npx cap sync
```

> `capacitor.config.json` 里已经配好 `webDir: "www"`。建议把里面的 `appId` 改成你自己的，比如 `com.你的名字.gearreminder`（只能小写字母/数字/点，作为 app 的唯一标识）。改完再跑一次 `npx cap sync`。

---

## 三、加一个权限，让"到点准时弹"更可靠

用编辑器打开这个文件：

```
android/app/src/main/AndroidManifest.xml
```

在 `<manifest ...>` 标签下面、`<application>` 上面，加一行：

```xml
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

（这是安卓 12+ 让定时通知**精确到点**的权限；通知本身的弹出权限插件会在 app 首次运行时自动向你索要。）

---

## 四、装到手机上看效果

```bash
npx cap open android
```

这会打开 Android Studio。等它把工程加载完（第一次会下载一些依赖，稍等）：

1. 手机连上电脑（或启动一个模拟器）
2. 点顶部那个绿色的 **运行 ▶** 按钮
3. app 就会装到手机上并打开
4. 第一次进去会弹"是否允许通知"，点**允许**

测一下提醒：在 app 里排一场**几分钟后**的拍摄，把手机锁屏放一边，到点就会收到推送。

---

## 五、生成可以发给别人的安装包（APK）

在 Android Studio 顶部菜单：**Build → Build App Bundle(s) / APK(s) → Build APK(s)**。
出好后它会提示 APK 的位置（一般在 `android/app/build/outputs/apk/`）。把这个 `.apk` 发到安卓手机上点开就能装（手机需允许"安装未知来源应用"）。

---

## 六、（可选）上架 Google Play

- 需要一个 Google Play 开发者账号（一次性注册费）。
- ⚠️ 注意：对**新注册的个人开发者账号**，Google 要求先做一轮"封闭测试"——至少 **12 名测试者、连续 14 天**，才能申请正式上架。自己装到自己手机（第五步那样）不受这个限制。

---

## 七、以后改了代码怎么办

你（或 AI 工具）改了 `www/index.html` 之后，只要：

```bash
npx cap copy        # 把最新网页同步进安卓工程
```

再在 Android Studio 里重新运行即可。换 app 图标和名字也在 Android Studio 里设置。

---

## 排查：提醒没弹？

- 确认首次进 app 时点了**允许通知**（没点的话去手机「设置 → 应用 → 带什么 → 通知」打开）。
- 确认第三步那行 `SCHEDULE_EXACT_ALARM` 权限加了。
- 部分手机（小米/华为/OPPO 等）有激进的省电策略，可能延迟或拦截后台通知。去系统设置里把本 app 的**电池优化关掉 / 允许后台运行 / 允许自启动**。
- 排的拍摄时间要在**未来**——过去时间不会再排提醒。

---

## 这个工程里有什么

```
gear-reminder/
├── www/
│   └── index.html          ← 你的整个 app（界面 + 逻辑 + 通知调度）
├── capacitor.config.json   ← app 名称 / 标识 / 网页目录
├── package.json
└── README.md               ← 本文件
```

`android/` 和 `node_modules/` 是上面命令自动生成的，不在压缩包里。
