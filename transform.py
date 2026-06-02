import re
import os

with open('shop_all.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract body
body_match = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL)
if body_match:
    content = body_match.group(1)
    # Remove script tags
    content = re.sub(r'<script.*?</script>', '', content, flags=re.DOTALL)
    # Convert class to className
    content = content.replace('class=', 'className=')
    content = content.replace('for=', 'htmlFor=')
    # Convert HTML comments to JSX comments
    content = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', content, flags=re.DOTALL)
    # Close img tags
    content = re.sub(r'<img([^>]*[^/])>', r'<img\1/>', content)
    # Close input tags
    content = re.sub(r'<input([^>]*[^/])>', r'<input\1/>', content)
    # Remove onclick attributes
    content = re.sub(r' onclick="[^"]*"', '', content)
    # Remove disabled attributes
    content = re.sub(r' disabled=""', ' disabled', content)
    content = re.sub(r' checked=""', ' defaultChecked', content)

    # Separate into header, main, footer for easier insertion if needed, or just dump
    
    react_code = f"""import React, {{ useState }} from 'react';
import Link from 'next/link';

export default function ShopPage() {{
  const [openFilters, setOpenFilters] = useState({{
    'filter-type': true,
    'filter-condition': true,
    'filter-ingredients': true
  }});

  const toggleFilter = (id) => {{
    setOpenFilters(prev => ({{ ...prev, [id]: !prev[id] }}));
  }};

  return (
    <div className="bg-background text-on-background font-body-md antialiased">
      {content}
    </div>
  );
}}
"""
    # Create dir if not exists
    os.makedirs('src/app/shop', exist_ok=True)
    with open('src/app/shop/page.jsx', 'w', encoding='utf-8') as out:
        out.write(react_code)
