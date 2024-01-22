def cal_discount(cart):
    applicable_discounts = []

    if cart["subtotal"] > 200:
        applicable_discounts.append(("flat_10_discount", 10))

    for product in cart["products"]:
        if product["quantity"] > 10:
            applicable_discounts.append(("bulk_5_discount", product["total_price"] * 0.05))

    if cart["total_qty"] > 20:
        applicable_discounts.append(("bulk_10_discount", cart["subtotal"] * 0.1))

    if cart["total_qty"] > 30:
        for product in cart["products"]:
            if product["quantity"] > 15:
                discount_amt = (product["quantity"] - 15) * (product["price"] * 0.5)
                applicable_discounts.append(("tiered_50_discount", discount_amt))

    if applicable_discounts:
        best_discount = max(applicable_discounts, key=lambda x: x[1])
        cart["discount_name"], cart["discount_amt"] = best_discount
        cart["subtotal"] -= best_discount[1]


def main():
    products = {
        "Product A": 20,
        "Product B": 40,
        "Product C": 50
    }

    cart = {
        "products": [],
        "subtotal": 0,
        "total_qty": 0,
        "discount_name": None,
        "discount_amt": 0,
        "shipping_fee": 0,
        "gift_wrap_fee": 0
    }

    for p_name, price in products.items():
        qty = int(input(f"Enter the quantity of {p_name}: "))
        is_gift_wrapped = input(f"Is {p_name} wrapped as a gift? (yes/no): ").lower() == "yes"
        total_price = qty * price
        gift_wrap_fee = qty if is_gift_wrapped else 0
        cart["products"].append({"name": p_name, "quantity": qty, "price": price, "total_price": total_price, "gift_wrap_fee": gift_wrap_fee})
        cart["subtotal"] += total_price
        cart["total_qty"] += qty

    cal_discount(cart)

    cart["shipping_fee"] = (cart["total_qty"] // 10) * 5

    print("\nProduct Details:")
    for product in cart["products"]:
        print(f"{product['name']} - Quantity: {product['quantity']}, Total: ${product['total_price']}")

    print("\nSubtotal: $", cart["subtotal"])

    if cart["discount_name"]:
        print(f"Discount Applied ({cart['discount_name']}): $", cart["discount_amt"])

    print("Shipping Fee: $", cart["shipping_fee"])
    print("Gift Wrap Fee: $", sum([product["gift_wrap_fee"] for product in cart["products"]]))

    cart["total"] = cart["subtotal"] + cart["shipping_fee"] + sum([product["gift_wrap_fee"] for product in cart["products"]])

    print("\nTotal: $", cart["total"])


if __name__ == "__main__":
    main()
