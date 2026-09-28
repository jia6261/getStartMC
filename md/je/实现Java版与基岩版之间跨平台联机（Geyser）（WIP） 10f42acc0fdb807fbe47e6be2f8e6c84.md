# 使用 Geyser 实现 Java 版与基岩版跨平台联机

> Geyser 是第三方协议桥接项目：基岩版玩家通过 Geyser 连接 Java 版服务器。它不是官方 Mojang 服务，也不是把 Java 世界转换成基岩世界；两端玩法、UI、附加内容和部分机制仍有差异。

## 需要准备

- 一台已能正常运行的 Minecraft **Java Edition** 服务器。先备份世界，并记下服务器软件、Minecraft 版本和管理权限。
- 一份与服务器端类型/版本相符的 Geyser 构建。插件一般用于受支持的 Paper/Spigot 环境；代理或独立运行方案的安装方法不同。
- 允许基岩客户端连接的 UDP 端口。Geyser 默认配置常见端口为 `19132/UDP`，但托管商或主机可能分配其他端口；请以实际配置/控制台和服务商面板为准。

## 一、先确认版本兼容

Geyser 模拟其当前支持的基岩客户端版本并连接 Java 服务器，因此兼容范围会随 Bedrock 与 Java 更新而变。安装前先查看 [Geyser 支持版本说明](https://geysermc.org/wiki/geyser/supported-versions/) 和服务器提供商页面。过旧的 Java 服务端可能需要 ViaVersion 或另一种受支持的代理方案；不要拿过期教程中的版本号照抄。

## 二、安装 Geyser（以支持的 Paper/Spigot 插件服务端为例）

1. 关闭服务端并备份完整目录。
2. 从 [GeyserMC 官方下载页](https://geysermc.org/download) 获取与该服务端兼容的 `Geyser-Spigot` 插件 JAR。不要使用来历不明的重打包文件。
3. 把 JAR 放到服务端 `plugins` 文件夹，启动一次服务器以生成配置，再正常关闭。
4. 打开 `plugins/Geyser-Spigot/config.yml`，检查 `bedrock.address`、`bedrock.port` 与托管商分配值。配置中的 Bedrock 端口承载的是 **UDP**，并非 Java 常用的 TCP 端口。
5. 重启服务端，查看启动日志是否有 Geyser 正常加载及监听端口的信息。
6. 使用官方文档所述的连接测试命令或一台基岩版客户端测试。基岩玩家添加服务器时填服务端地址和 Bedrock UDP 端口；Java 玩家继续用自己的 Java 地址/端口。

## 三、可选：使用 Floodgate

默认的 Geyser 登录方式通常要求通过 Java Edition 账号身份验证。若希望基岩玩家使用自己的基岩 Microsoft/Xbox 账号加入，而不要求每位玩家都拥有 Java Edition，可按需安装同一项目提供的 **Floodgate**。这并不代表可以绕过基岩平台账号或服务器访问控制。

Paper/Spigot 的基本流程是：关闭服务器 → 从 [Floodgate 官方下载页](https://geysermc.org/download/?project=floodgate) 取得匹配插件 → 放入 `plugins` → 启动生成配置 → 将 Geyser 配置的 `auth-type` 设为 `floodgate` → 重启。代理和独立部署请按 [Floodgate 官方设置说明](https://geysermc.org/wiki/floodgate/setup/) 操作，不要把代理架构的密钥文件随意复制或公开。

## 四、放通 UDP 端口

自托管时需同时满足：Geyser 正在监听正确端口、主机防火墙允许对应的入站 UDP、路由器/云平台安全组将同一个 UDP 端口转发到 Geyser 主机。若使用 Docker，还必须显式发布 UDP 端口。只放通 Java 的 TCP `25565` 并不足以让 Bedrock 玩家连接。

如果使用游戏托管商，先看该商的 [Geyser 配置说明](https://geysermc.org/wiki/geyser/setup/)：有的商会要求共用分配端口或申请额外 UDP 端口。不要在服务商不支持时自行打开任意端口。

## 排障顺序

1. 检查 `plugins` 是否加载 Geyser，配置文件是否有拼写错误。
2. 核对客户端使用的是 **Bedrock 地址与 UDP 端口**；Java 地址可连通不代表 Bedrock UDP 已开放。
3. 核对服务器/Minecraft 版本是否在 [支持范围](https://geysermc.org/wiki/geyser/supported-versions/) 内，必要时按官方指南调整 ViaVersion/代理部署。
4. 在服务器控制台按 Geyser 文档执行 `geyser connectiontest <地址> <端口>`，并查看主机、路由器、安全组、Docker/托管面板的 UDP 规则。
5. 确认代理网络与 Floodgate 的安装位置及密钥一致；遇到认证问题时，不要把 Floodgate 密钥贴到公开论坛。

### 参考资料

- [GeyserMC：安装和配置](https://geysermc.org/wiki/geyser/setup/)
- [GeyserMC：支持版本](https://geysermc.org/wiki/geyser/supported-versions/)
- [GeyserMC：端口转发](https://geysermc.org/wiki/geyser/port-forwarding/)
- [Floodgate：概览与设置](https://geysermc.org/wiki/floodgate/) · [设置步骤](https://geysermc.org/wiki/floodgate/setup/)

> Geyser/Floodgate 是独立社区项目。名称、兼容表和配置可能变化，升级前请以项目官方文档为准。
