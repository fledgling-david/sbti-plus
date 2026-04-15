from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router

app = FastAPI(
    title="SBTI人格测试API",
    description="提供SBTI人格测试的题库和结果计算服务",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(router, prefix="/api")


@app.get("/")
def read_root():
    """
    根路径
    """
    return {"message": "Welcome to SBTI Personality Test API"}


@app.get("/health")
def health_check():
    """
    健康检查
    """
    return {"status": "healthy"}
