import axios from 'axios';

export const fetchProducts = async (limit) => {
  const { data } = await axios.get(
    `https://fakestoreapi.com/products?limit=${limit}`
  );
  return data;
};

export const fetchProduct = async (id) => {
  const { data } = await axios.get(`https://fakestoreapi.com/products/${id}`);
  return data;
};

export const fetchCartProducts = (cartItems) => {
  let newCartItems = [];
  const cartItemsIds = cartItems.map((cartItem) => cartItem.id);
  Promise.all(
    cartItemsIds.map(async (cartItemId, i) => {
      const { data } = await axios.get(
        `https://fakestoreapi.com/products/${cartItemId}`
      );
      return { ...data, quantity: cartItems[i].quantity };
    })
  ).then((values) => {
    newCartItems.push(...values);
  });
  return newCartItems;
};

export const fetchProductsByName = async (sTitle) => {
  const { data } = await axios.get(`https://fakestoreapi.com/products`);
  return data.filter((product) =>
    product.title.toLowerCase().includes(sTitle.toLowerCase())
  );
};

export const fetchProductsByCategory = async (category) => {
  const { data } = await axios.get(
    `https://fakestoreapi.com/products/category/${category}`
  );
  return data;
};
