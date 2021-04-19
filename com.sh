git add .
read -p "请输入提交记录：" commitResult
git commit -m "$commitResult"
git pull
git push