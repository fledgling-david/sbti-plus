from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# 修复模块导入：把api目录加入Python路径，线上也能找到routes模块
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from routes import router

# 关键：加上root_path="/api"，让FastAPI正确匹配Vercel转发的路径
app = FastAPI(
    title="SBTI人格测试API",
    description="线上部署兼容版",
    version="1.0.0",
    root_path="/api"  # 这行是解决路由不匹配的关键！
)

# CORS跨域配置（放行所有环境，避免前端请求被拦截）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载路由（注意：这里绝对不能加prefix="/api"！）
app.include_router(router)

# 健康检查接口（现在加上root_path后，/api/health会正确匹配到这里）
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API运行正常！"}

# 必须删除所有uvicorn启动代码！
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("index:app", host="0.0.0.0", port=8000)