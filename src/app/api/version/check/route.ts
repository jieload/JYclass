import { NextResponse } from "next/server";
import { readVersionInfoFromDir } from "@/lib/version-info";

/**
 * 检查版本更新
 * GET /api/version/check
 * 说明：本系统仅在本地网络使用，不向任何外部服务器发起请求，
 *       版本检查仅读取本机当前版本，不再拉取远程更新信息。
 */
export async function GET() {
  try {
    // 读取本地当前版本号（public/latest.json 为唯一真源，VERSION.md 兜底）
    const currentVersion =
      readVersionInfoFromDir(process.cwd()).version || "unknown";

    return NextResponse.json({
      current: currentVersion,
      latest: currentVersion,
      hasUpdate: false,
      downloadUrl: "",
      changelog: "",
      releaseDate: "",
    });
  } catch {
    return NextResponse.json({
      current: "unknown",
      hasUpdate: false,
      error: "版本检查失败",
    });
  }
}
