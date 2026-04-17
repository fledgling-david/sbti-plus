from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# -------------- 1. 修复模块导入问题 --------------
# 把api目录加入Python路径，让线上也能找到routes、models等自定义模块
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 现在可以正常导入了
from routes import router

# -------------- 2. 初始化FastAPI --------------
app = FastAPI(
    title="SBTI人格测试API",
    description="线上部署兼容版",
    version="1.0.0"
)

# -------------- 3. CORS跨域配置（放行所有环境） --------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------- 4. 修复文件读取路径问题（如果你的代码里有读取本地文件） --------------
# 示例：如果你的questions.json和index.py在同一个api文件夹里，用这个方式读取
# （如果没有读取文件的代码，可以直接删掉这部分）
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
questions_path = os.path.join(BASE_DIR, "questions.json")

# -------------- 5. 挂载路由（注意：这里不要加prefix="/api"！） --------------
# 线上Vercel会自动给所有请求加/api前缀，再加prefix会导致路径重复，匹配不到
app.include_router(router)

# -------------- 6. 健康检查接口（用于排查线上函数是否正常启动） --------------
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API运行正常！"}

# -------------- 必须删除所有uvicorn启动代码！--------------
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("index:app", host="0.0.0.0", port=8000)