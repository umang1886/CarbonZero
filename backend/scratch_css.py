import os
import re

FRONTEND_DIR = r"c:\Users\umang\Desktop\Projects\CarbonZero\frontend\src"

def replace_inline_styles():
    for root, dirs, files in os.walk(FRONTEND_DIR):
        for file in files:
            if file.endswith((".tsx", ".ts")):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()

                # Replace style={{ color: "#HEX" }} -> text-[#HEX]
                # We need to append to className or add it if not exists.
                # Since doing this perfectly is hard with regex (className might be before or after style),
                # let's just do a simpler pass: if there is `className="..." style={{ color: "#HEX" }}`, merge them.
                
                # Regex for: style={{ color: "#HEX" }}
                # Actually, many styles are like: `style={{ color: "rgba(240,246,252,0.6)" }}`
                
                # We will target the most common static ones using regex.
                # 1. `style={{ background: "#0D1117" }}`
                content = re.sub(r'className="([^"]+)"\s*style=\{\{\s*background:\s*"#0D1117"\s*\}\}', r'className="\1 bg-[#0D1117]"', content)
                content = re.sub(r'style=\{\{\s*background:\s*"#0D1117"\s*\}\}\s*className="([^"]+)"', r'className="\1 bg-[#0D1117]"', content)
                
                # 2. `style={{ color: "#52B788" }}`
                content = re.sub(r'className="([^"]+)"\s*style=\{\{\s*color:\s*"#52B788"\s*\}\}', r'className="\1 text-[#52B788]"', content)
                content = re.sub(r'style=\{\{\s*color:\s*"#52B788"\s*\}\}\s*className="([^"]+)"', r'className="\1 text-[#52B788]"', content)

                # 3. `style={{ color: "rgba(240,246,252,0.6)" }}` -> text-[#F0F6FC]/60
                content = re.sub(r'className="([^"]+)"\s*style=\{\{\s*color:\s*"rgba\(240,246,252,0.6\)"\s*\}\}', r'className="\1 text-[#F0F6FC]/60"', content)
                
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)

if __name__ == "__main__":
    replace_inline_styles()
    print("Done")
