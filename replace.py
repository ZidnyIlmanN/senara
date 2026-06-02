import re

with open('src/app/shop/page.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useCart import
content = content.replace("import { Icon } from '../components/ui'", "import { Icon } from '../components/ui'\nimport { useCart } from '../components/CartContext'")

# Add useCart hook inside ShopPage component
content = re.sub(
    r'(export default function ShopPage\(\) \{\s*)(const \[priceRange, setPriceRange\] = useState\(100\))',
    r'\1const { totalItems, openCart, addToCart } = useCart()\n  \2',
    content
)

# Update cart icon in ShopPage
content = re.sub(
    r'(<button className="hover:text-secondary transition-all active:scale-95 duration-150 ease-in-out relative")>',
    r'\1 onClick={openCart}>\n',
    content
)
content = re.sub(
    r'(<Icon name="bag" size=\{24\} />\n)',
    r'\1                                {totalItems > 0 && (\n                                  <span className="absolute -top-1 -right-2 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">\n                                    {totalItems}\n                                  </span>\n                                )}\n',
    content
)

# Now for the buttons, let's use regex to find each article
def replace_card(m):
    article = m.group(0)
    # Extract name
    name_m = re.search(r'<h3[^>]*>(.*?)</h3>', article)
    name = name_m.group(1) if name_m else 'Product'
    # Extract price
    price_m = re.search(r'€([0-9.]+)', article)
    price = float(price_m.group(1)) if price_m else 0.0
    # Extract image
    img_m = re.search(r'src="([^"]+)"', article)
    img = img_m.group(1) if img_m else ''
    
    # Generate an ID
    product_id = name.lower().replace(' ', '-')
    
    # Replace the button
    btn_regex = r'<button className="bg-primary text-on-primary.*?">.*?Add\s*</button>'
    new_btn = f'''<button onClick={{() => addToCart({{id: "{product_id}", name: "{name}", price: {price}, image: "{img}"}})}} className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 hover:bg-secondary transition-all active:scale-95 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                    Add
                                </button>'''
    
    return re.sub(btn_regex, new_btn, article, flags=re.DOTALL)

content = re.sub(r'<article className="group relative bg-surface-container-low border border-outline-variant/30 overflow-hidden">.*?</article>', replace_card, content, flags=re.DOTALL)

with open('src/app/shop/page.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
