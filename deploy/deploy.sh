#!/bin/bash
# =============================================================
# deploy.sh — 本地一键部署 / 更新脚本
# 类似 nyu-treehole 的 deploy_to_aliyun.sh
#
# 首次使用前配置：
#   export SERVER_IP="47.103.99.94"
#   export SERVER_USER="root"
#   export SERVER_PASS="你的密码"   # 或者配置 SSH 密钥免密登录
#
# 用法：bash deploy/deploy.sh
# =============================================================

SERVER_IP="${SERVER_IP:-47.103.99.94}"
SERVER_USER="${SERVER_USER:-root}"
APP_DIR="/opt/student-community"

echo "=========================================="
echo "  部署到 ${SERVER_USER}@${SERVER_IP}"
echo "=========================================="

# 检查 sshpass（用于密码登录），如果有 SSH 密钥则不需要
SSH_CMD="ssh -o StrictHostKeyChecking=no"
SCP_CMD="scp -o StrictHostKeyChecking=no"

if [ -n "$SERVER_PASS" ]; then
  if ! command -v sshpass &> /dev/null; then
    echo "提示：未安装 sshpass，将使用 SSH 密钥。"
    echo "如需密码登录，请先运行: brew install sshpass (Mac) 或 apt install sshpass (Linux)"
  else
    SSH_CMD="sshpass -p '${SERVER_PASS}' ssh -o StrictHostKeyChecking=no"
    SCP_CMD="sshpass -p '${SERVER_PASS}' scp -o StrictHostKeyChecking=no"
  fi
fi

run_remote() {
  echo ""
  echo ">>> $1"
  eval "${SSH_CMD} ${SERVER_USER}@${SERVER_IP} \"$1\""
}

# ── 1. 拉取最新代码 ───────────────────────────────────────────
echo ""
echo "[1/4] 拉取最新代码..."
run_remote "cd ${APP_DIR} && git pull origin master 2>&1"

# ── 2. 重新构建镜像并启动 ─────────────────────────────────────
echo ""
echo "[2/4] 构建并启动（约 5-8 分钟）..."
run_remote "cd ${APP_DIR} && docker compose up -d --build 2>&1 | tail -20"

# ── 3. 等待数据库就绪，执行迁移 ──────────────────────────────
echo ""
echo "[3/4] 等待数据库就绪（30s）..."
sleep 30
run_remote "cd ${APP_DIR} && docker compose ps 2>&1"
run_remote "cd ${APP_DIR} && docker compose exec -T app npx prisma migrate deploy 2>&1"
run_remote "cd ${APP_DIR} && docker compose exec -T app npx prisma db seed 2>&1"

# ── 4. 验证 ───────────────────────────────────────────────────
echo ""
echo "[4/4] 验证..."
run_remote "curl -s -o /dev/null -w 'HTTP Status: %{http_code}' http://localhost/"
run_remote "cd ${APP_DIR} && docker compose logs app --tail=10 2>&1"

echo ""
echo "=========================================="
echo "  ✓ 部署完成！"
echo "  访问：http://${SERVER_IP}"
echo "  管理员：admin@example.com / admin123"
echo "  ⚠️  生产环境请立即修改管理员密码！"
echo "=========================================="
