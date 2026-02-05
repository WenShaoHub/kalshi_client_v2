# scripts/log_change.py
import sys
from datetime import datetime

def append_log(change_type, summary, risk_analysis):
    # 自动生成带时间戳、类型和风险分析的日志
    entry = f"""
## [{datetime.now().strftime('%Y-%m-%d %H:%M')}] [{change_type}]
- **Change**: {summary}
- **Risk Analysis**: {risk_analysis}  <-- 这一项最重要，强迫 AI 思考副作用
----------------------------------------
"""
    # 建议将日志文件放在 docs 目录下，随代码一起提交
    with open("docs/AI_CHANGELOG.md", "a", encoding="utf-8") as f:
        f.write(entry)
    print(f"✅ [Flight Recorder] Log appended to AI_CHANGELOG.md")

if __name__ == "__main__":
    # 实际调用时，AI 会自动传入这三个参数
    if len(sys.argv) < 4:
        print("Usage: python log_change.py <type> <summary> <risk>")
    else:
        append_log(sys.argv[1], sys.argv[2], sys.argv[3])