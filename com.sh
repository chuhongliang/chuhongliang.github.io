git add .
read -p "请输入提交记录：" commitLog
git commit -m "$commitLog"
git pull
git push