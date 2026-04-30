with open('src/App.css', 'r') as f:
    content = f.read()

# Replace both empty .blog-image blocks
content = content.replace(
    '  .blog-image {\n\n    /*        height: 200px;*/',
    '  .blog-image {\n    display: block;\n    /*        height: 200px;*/'
)

with open('src/App.css', 'w') as f:
    f.write(content)

print("Fixed both .blog-image rulesets")
