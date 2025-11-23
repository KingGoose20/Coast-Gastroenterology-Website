from bs4 import BeautifulSouphtml_file = r"C:\Users\Angus\Documents\Websites\Coast Gastro Base Website\coastgastroenterology.com\index.html"
css_file = "styles.min.css"    # your cleaned + minified CSSwith open(html_file, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")# Remove all <style> tags
for tag in soup.find_all("style"):
    tag.decompose()# Remove <link rel="stylesheet"> tags if you want to replace old CSS completely
for tag in soup.find_all("link", rel="stylesheet"):
    tag.decompose()# Add new stylesheet link inside <head>
new_link = soup.new_tag("link", rel="stylesheet", href=css_file)
if soup.head:
    soup.head.append(new_link)
else:
    # create <head> if missing
    new_head = soup.new_tag("head")
    new_head.append(new_link)
    soup.insert(0, new_head)# Save updated HTML
with open("index.cleaned.html", "w", encoding="utf-8") as f:
    f.write(str(soup))print("✅ Updated HTML written to index.cleaned.html")
