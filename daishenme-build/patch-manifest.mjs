// 给 android/app/src/main/AndroidManifest.xml 自动加上"精确定时通知"权限。
// 在 `npx cap add android` 之后运行一次：  node patch-manifest.mjs
// 重复运行也安全（已经有了就跳过）。
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const path = "android/app/src/main/AndroidManifest.xml";
const PERM = '<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />';

if (!existsSync(path)) {
  console.error("❌ 没找到 " + path + "，请先运行：npx cap add android");
  process.exit(1);
}

let xml = readFileSync(path, "utf8");

if (xml.includes("SCHEDULE_EXACT_ALARM")) {
  console.log("✅ 权限已存在，无需改动。");
  process.exit(0);
}

// 把权限插到 <application 之前；找不到就插到 <manifest ...> 标签之后。
if (xml.includes("<application")) {
  xml = xml.replace("<application", "    " + PERM + "\n\n    <application");
} else {
  xml = xml.replace(/(<manifest[^>]*>)/, "$1\n    " + PERM);
}

writeFileSync(path, xml, "utf8");
console.log("✅ 已加入 SCHEDULE_EXACT_ALARM 权限。");
