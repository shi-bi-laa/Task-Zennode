const readline = require('readline-sync');

function calculateDiscount(cart) {
    let applicableDiscounts = [];

    if (cart.subtotal > 200) {
        applicableDiscounts.push(["flat_10_discount", 10]);
    }

    for (const product of cart.products) {
        if (product.quantity > 10) {
            applicableDiscounts.push(["bulk_5_discount", product.totalPrice * 0.05]);
        }
    }

    if (cart.totalQuantity > 20) {
        applicableDiscounts.push(["bulk_10_discount", cart.subtotal * 0.1]);
    }

    if (cart.totalQuantity > 30) {
        for (const product of cart.products) {
            if (product.quantity > 15) {
                const discountAmount = (product.quantity - 15) * (product.price * 0.5);
                applicableDiscounts.push(["tiered_50_discount", discountAmount]);
            }
        }
    }

    if (applicableDiscounts.length > 0) {
        const bestDiscount = applicableDiscounts.reduce((a, b) => (a[1] > b[1] ? a : b));
        cart.discountName = bestDiscount[0];
        cart.discountAmount = bestDiscount[1];
        cart.subtotal -= bestDiscount[1];
    }
}

function main() {
    const products = {
        "Product A": 20,
        "Product B": 40,
        "Product C": 50
    };

    const cart = {
        products: [],
        subtotal: 0,
        totalQuantity: 0,
        discountName: null,
        discountAmount: 0,
        shippingFee: 0,
        giftWrapFee: 0,
        total: 0
    };

    for (const [productName, price] of Object.entries(products)) {
        const quantity = parseInt(readline.question(`Enter the quantity of ${productName}:`), 10);
        const isGiftWrapped = readline.keyInYNStrict(`Is ${productName} wrapped as a gift?`);
        const totalPrice = quantity * price;
        const giftWrapFee = isGiftWrapped ? quantity : 0;
        cart.products.push({ name: productName, quantity, price, totalPrice, giftWrapFee });
        cart.subtotal += totalPrice;
        cart.totalQuantity += quantity;
    }

    calculateDiscount(cart);

    cart.shippingFee = Math.floor(cart.totalQuantity / 10) * 5;

    console.log("\nProduct Details:");
    for (const product of cart.products) {
        console.log(`${product.name} - Quantity: ${product.quantity}, Total: $${product.totalPrice}`);
    }

    console.log("\nSubtotal: $", cart.subtotal);

    if (cart.discountName) {
        console.log(`Discount Applied (${cart.discountName}): $`, cart.discountAmount);
    }

    console.log("Shipping Fee: $", cart.shippingFee);
    console.log("Gift Wrap Fee: $", cart.products.reduce((sum, product) => sum + product.giftWrapFee, 0));

    cart.total = cart.subtotal + cart.shippingFee + cart.products.reduce((sum, product) => sum + product.giftWrapFee, 0);

    console.log("\nTotal: $", cart.total);
}

main();
