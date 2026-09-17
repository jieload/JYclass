#!/bin/bash
PID=$(lsof -ti:3000 2>/dev/null)
if [ -n "$PID" ]; then
    kill -9 $PID
    echo "建邺智课 已停止"
else
    echo "未发现运行中的 建邺智课"
fi
