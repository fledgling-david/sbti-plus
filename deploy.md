# SBTI人格测试项目部署指南

## 1. 服务器环境配置

### 1.1 登录服务器
使用SSH工具（如PuTTY、Xshell等）登录腾讯云轻量应用服务器。

### 1.2 安装系统依赖
```bash
# 更新系统包
apt update && apt upgrade -y

# 安装必要的系统依赖
apt install -y build-essential nginx git curl
```

### 1.3 安装Node.js
```bash
# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 验证安装
node -v
npm -v
```

### 1.4 安装Python
```bash
# 安装Python 3.9
apt install -y python3.9 python3-pip python3.9-venv

# 验证安装
python3 --version
pip3 --version
```

## 2. 项目文件上传与部署

### 2.1 克隆项目代码
```bash
# 克隆项目到服务器
git clone https://github.com/your-username/sbti-plus.git /var/www/sbti-plus

# 进入项目目录
cd /var/www/sbti-plus
```

### 2.2 安装前端依赖并构建
```bash
# 安装前端依赖
npm install

# 构建前端项目
npm run build
```

### 2.3 配置后端环境
```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate

# 安装Python依赖
pip install -r requirements.txt

# 退出虚拟环境
deactivate
```

## 3. Nginx配置

### 3.1 创建Nginx配置文件
```bash
# 创建Nginx配置文件
nano /etc/nginx/sites-available/sbti-plus
```

### 3.2 配置Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;

    # 前端静态文件
    location / {
        root /var/www/sbti-plus/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3.3 启用Nginx配置
```bash
# 创建符号链接
ln -s /etc/nginx/sites-available/sbti-plus /etc/nginx/sites-enabled/

# 测试Nginx配置
nginx -t

# 重启Nginx
systemctl restart nginx
```

### 3.4 配置SSL证书（使用Let's Encrypt）
```bash
# 安装Certbot
apt install -y certbot python3-certbot-nginx

# 申请SSL证书
certbot --nginx -d your-domain.com

# 设置自动续期
echo "0 12 * * * /usr/bin/certbot renew --quiet" >> /etc/crontab
```

## 4. 服务启动与监控

### 4.1 创建后端服务脚本
```bash
# 创建服务脚本
nano /etc/systemd/system/sbti-backend.service
```

```ini
[Unit]
Description=SBTI Backend Service
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/sbti-plus/backend
ExecStart=/var/www/sbti-plus/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

### 4.2 启动服务
```bash
# 启用并启动后端服务
systemctl enable sbti-backend
systemctl start sbti-backend

# 查看服务状态
systemctl status sbti-backend
```

### 4.3 监控服务
```bash
# 查看后端服务日志
journalctl -u sbti-backend -f

# 查看Nginx日志
tail -f /var/log/nginx/error.log
```

## 5. 常见问题排查

### 5.1 后端服务无法启动
- 检查端口是否被占用：`netstat -tuln | grep 8000`
- 检查依赖是否安装：`cd /var/www/sbti-plus/backend && source venv/bin/activate && pip list`
- 检查服务日志：`journalctl -u sbti-backend -n 100`

### 5.2 前端无法访问后端API
- 检查Nginx配置是否正确：`nginx -t`
- 检查后端服务是否运行：`systemctl status sbti-backend`
- 检查防火墙设置：`ufw status`

### 5.3 SSL证书问题
- 检查证书是否过期：`certbot certificates`
- 重新申请证书：`certbot renew --force-renewal`

### 5.4 性能优化
- 增加后端worker数量：修改`sbti-backend.service`文件中的`--workers`参数
- 启用Nginx缓存：在Nginx配置中添加缓存配置
- 优化前端构建：使用`npm run build`的生产模式构建

## 6. 项目维护

### 6.1 更新项目代码
```bash
# 进入项目目录
cd /var/www/sbti-plus

# 拉取最新代码
git pull

# 重新构建前端
npm install
npm run build

# 重启后端服务
systemctl restart sbti-backend

# 重启Nginx
systemctl restart nginx
```

### 6.2 备份数据
```bash
# 备份项目目录
tar -czf sbti-plus-backup-$(date +%Y%m%d).tar.gz /var/www/sbti-plus

# 下载备份到本地（使用SCP工具）
# scp root@your-server:/var/www/sbti-plus/sbti-plus-backup-20260415.tar.gz .
```

## 7. 部署完成验证

1. 访问 `https://your-domain.com` 查看前端页面
2. 访问 `https://your-domain.com/api/health` 验证后端API是否正常
3. 完成一次测试流程，确保所有功能正常工作

---

**部署成功！** 现在你的SBTI人格测试项目已经在腾讯云轻量应用服务器上成功部署，可以开始接收用户测试了。