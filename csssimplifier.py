from bs4 import BeautifulSoup
import cssutils

# Load HTML
with open(r"C:\Users\Angus\Documents\Websites\Coast Gastro Base Website\coastgastroenterology.com\index.html", "r", encoding="utf-8") as f:

    html = f.read()

soup = BeautifulSoup(html, "html.parser")

# Extract all classes and ids used in HTML
used_classes = {cls for tag in soup.find_all(True) for cls in (tag.get("class") or [])}
used_ids = {tag.get("id") for tag in soup.find_all(True) if tag.get("id")}

# Extract <style> CSS
css_code = "\n".join(tag.string for tag in soup.find_all("style") if tag.string)

# Parse CSS
sheet = cssutils.parseString(css_code)

# Keep only rules that match used selectors
cleaned_css = []
for rule in sheet:
    if rule.type == rule.STYLE_RULE:
        selector = rule.selectorText
        keep = False
        for cls in used_classes:
            if f".{cls}" in selector:
                keep = True
        for i in used_ids:
            if f"#{i}" in selector:
                keep = True
        if keep:
            cleaned_css.append(rule.cssText)
    elif rule.type == rule.COMMENT:
        continue
    else:
        cleaned_css.append(rule.cssText)

final_css = "\n".join(cleaned_css)

# Minify
final_css = cssutils.ser.prefs.useMinified()
final_css = sheet.cssText.decode("utf-8")

with open("styles.min.css", "w", encoding="utf-8") as f:
    f.write(final_css)

print("✅ Cleaned + minified CSS written to styles.min.css")
