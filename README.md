# 词序 · IELTS 3500（GitHub 同步版）

紫白配色，适配电脑与 iPhone。包括单词卡、原书日文与中文双语释义、原书分组音频、听辨、拼写小测、错词、间隔复习、学习统计与 JSON 导出。

**本包已有可直接上传的网页，根目录 index.html 就是首页。当前已导入基本语0001–1000，共1000词，不是3500词完整词库。**

## 最短开通流程

### 1. 创建同步数据库（Supabase）

1. 打开 https://supabase.com/ ，创建自己的项目。
2. 打开项目里的 SQL Editor，把本包 `supabase/setup.sql` 全部粘贴进去并运行。
3. 在项目设置的 API / API Keys 页面，找到 Project URL 和 **publishable key**（或 legacy **anon key**）。这两个是网页客户端配置，不是数据库密码。不要使用 secret / service_role key。
4. 编辑本包根目录的 `config.js`，填入这两个值，保留引号：

```js
window.IELTS_CONFIG = {
  supabaseUrl: "https://你的项目编号.supabase.co",
  supabaseKey: "你的publishable或anon key"
};
```

5. 在 Authentication 的邮箱登录设置中确保启用 Email。个人使用最省事的方法：在 Authentication → Users 中由你创建一个邮箱＋密码用户，并确认邮箱，然后关闭 Allow new users to sign up（如需只自己使用）。不要在网页或 GitHub 中填写这个密码。
6. 若选择开放注册并开启 Confirm email，请把 Authentication → URL Configuration → Site URL 设为稍后得到的完整 GitHub Pages 地址（含仓库路径），并将该地址加入 Redirect URLs。注册后先点确认邮件，再返回网页登录。邮件限额由你的 Supabase 项目决定。

### 2. 上传 GitHub

1. 在 GitHub 新建仓库，例如 `ielts-3500`。
2. 解压 ZIP。进入 `IELTS3500-GitHub` 文件夹，上传**里面的内容**到仓库根目录，而不是上传 ZIP 本身，也不要多套一层文件夹。
3. 根目录必须能直接看到 `index.html`、`config.js`、`assets`、`audio` 等文件/文件夹。`source` 是可修改源码，`supabase` 是数据库脚本，一并上传也可以。
4. 仓库 → Settings → Pages → Source 选择 **Deploy from a branch** → 选择 `main` 和 **/(root)** → Save。
5. 等 Pages 部署完成，打开 GitHub 显示的网站地址。一般形如 `https://用户名.github.io/ielts-3500/`。

不需要填写 GitHub Token，也不需要 GitHub Actions、Node 或构建命令。根据 GitHub 账户套餐，私有仓库的 Pages 可用性可能不同。

### 3. 手机电脑同步

- 两端打开**同一个 Pages 地址**，用**同一个邮箱和密码**登录；不是 ChatGPT 登录。
- 每次打分上传；每30秒、网页重新获得焦点、网络恢复时拉取更新。右上角显示“已同步到云端”后，可在另一台设备接着学。
- 断网期间，已打开网页中的新记录暂存本机。保持该浏览器数据，联网并打开网页后自动补传。
- iPhone 用 Safari 打开，分享 → 添加到主屏幕。
- 两台设备同时学习不同词的记录可以合并。同一个词在两端重复练习会作为不同练习记录保留；系统按练习时间排序。
- 退出登录前先同步；未上传的记录存在时，网页会阻止常规退出。

## 上传前须知

- GitHub Pages 只提供静态网页；**只上传文件尚不能自动同步**，必须完成 Supabase 配置和 SQL 建表。
- Supabase 的 RLS 规则限制每个登录用户只能读取和写入自己的学习记录。未登录用户没有这些表的权限。
- 网页本身、词库和25段配套音频会随 Pages 可被访问；邮箱登录只保护学习记录。配套书籍/录音仍属于原权利人，请按你拥有的使用授权决定是否上传。
- 这是新的独立邮箱账户系统；旧 Sites 版记录不会自动转移。旧版可先导出 JSON 留存，本版目前提供导出，不提供旧版记录自动导入。
- 没配置时显示配置提示页，不伪装已同步。不提供完整离线缓存。

## 文件结构

- `index.html`、`assets/`：已经构建的网页，直接发布。
- `config.js`：部署时手动填写的 Supabase 客户端配置。
- `audio/`：0001–1000，共25段原书录音。
- `supabase/setup.sql`：数据库和用户隔离权限。
- `source/`：React + TypeScript + Vite 源码及自动检查。

## 修改源码后重新构建

需要 Node.js 22.13+（推荐24）。在 `source` 中执行：

```sh
npm install
npm run check
npm test
npm run build
```

结果位于 `web-build/`，将其中内容覆盖到仓库根目录。**先备份根目录 config.js；构建产生的是空配置模板，不要覆盖你已填写的值。**

## 当前词库与复习规则

已核对旺文社《実践 IELTS 英単語3500》改订版第18–42页（0001–1000），保留原书日文释义和关联表达，补充中文释义；前80词保留原有补充搭配。原书关联表达不保证所有语境可互换。

认识后按约第1、3、7、14、30天复习；模糊次日复习，不会10分钟后复习。当天重复熟练同一词不跳过未来间隔。每日目标默认100词、可改；新增不超过剩余可用词数。每日计划150–180分钟，暂不自动调整词量。

0001–1000单词卡片、词库发音按钮及拼写小测均播放原书对应录音。首次点击某组需要加载音频，随后同组可复用。完整原书MP3仍可在听力练习中连续播放。学习日期按日本时间分组。

## 常见问题

- **显示配置提示**：根目录 config.js 未填，或网址格式错误。不要填控制台的网址；填 Project URL。
- **登录失败**：检查账号密码、Email provider 与邮箱是否确认。先在控制台创建并确认个人用户更直接。
- **能登录但同步失败**：运行 setup.sql；检查配置是不是同一个 Supabase 项目，项目是否暂停，网络是否可访问 Supabase。
- **打开是404**：检查 index.html 是否在根目录，Pages 是否选择 main / root，部署是否完成。
- **音频404**：确认 audio 文件夹一并上传，没有更改文件名。网页与音频路径均支持仓库子路径。
- **改配置没变化**：刷新或强制刷新页面，等 Pages 完成新一轮部署。

官方资料：
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/database/postgres/row-level-security


## 原书逐词发音

1000个词条均有一一对应的播放时间点，数据在 source/lib/original-audio.json；25组音频在根目录 audio/original/。播放器使用 Web Audio 控制片段长度，内存最多缓存3组，快速换词会停止旧词。

可打开同目录的“原书录音试听.html”核对全部1000词，无需登录，不记录进度。这一页需通过 GitHub Pages 或本地HTTP服务打开，不能直接双击作为离线文件使用。

源码的 scripts/prepare-audio.mjs 在测试/构建前从仓库根目录 audio 复制音频到 source/public/audio，源码目录无需额外存一份相同音频。请保留根目录 audio。

录音按组号和书中顺序匹配，已检查静音边界及转码时间偏移；不等同于1000词全部经过人工逐词试听。如有个别词需要微调，可按词号定位修正。
